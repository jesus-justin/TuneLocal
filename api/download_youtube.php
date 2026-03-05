<?php
/**
 * TuneLocal - YouTube to Offline Downloader
 *
 * Given a YouTube URL and a title, this endpoint:
 *  - Uses yt-dlp (or youtube-dl) on the server to download best audio
 *  - Stores the audio in the music_library table (same format as regular uploads)
 *  - Returns JSON with the new offline track id
 *
 * Requirements on your XAMPP machine:
 *  - Install yt-dlp (recommended) or youtube-dl and ensure it is available on PATH,
 *    or update the $YTDLP_CANDIDATES list below with the full path.
 */

require_once __DIR__ . '/config.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
    exit;
}

// Read JSON body
$input = json_decode(file_get_contents('php://input'), true);
$sourceUrl = trim($input['url'] ?? '');
$title = trim($input['title'] ?? '');

if (!$sourceUrl || !$title) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing url or title'
    ]);
    exit;
}

// Basic YouTube URL validation (safety)
if (!preg_match('/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i', $sourceUrl)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Only YouTube URLs are supported for automatic offline download'
    ]);
    exit;
}

// Try to locate yt-dlp / youtube-dl
$YTDLP_CANDIDATES = [
    'yt-dlp',
    'yt-dlp.exe',
    'youtube-dl',
    'youtube-dl.exe'
];

function findDownloaderBinary(array $candidates) {
    foreach ($candidates as $bin) {
        // On Windows / XAMPP this will succeed only if the exe is on PATH
        $checkCmd = escapeshellcmd($bin) . ' --version 2>&1';
        $output = @shell_exec($checkCmd);
        if ($output !== null && trim($output) !== '') {
            return $bin;
        }
    }
    return null;
}

$downloader = findDownloaderBinary($YTDLP_CANDIDATES);
if ($downloader === null) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'yt-dlp / youtube-dl is not installed or not available on PATH. Install yt-dlp and restart Apache, then try again.'
    ]);
    exit;
}

$conn = getDBConnection();

// Prepare temp directory for downloads
$downloadDir = __DIR__ . '/../tmp_ytdl';
if (!is_dir($downloadDir)) {
    @mkdir($downloadDir, 0755, true);
}

// Build safe command
$escapedUrl = escapeshellarg($sourceUrl);
$pattern = $downloadDir . DIRECTORY_SEPARATOR . 'tunelocal_%(id)s.%(ext)s';
$escapedPattern = escapeshellarg($pattern);

// Download best audio only
$cmd = escapeshellcmd($downloader)
    . ' -f bestaudio --no-playlist --no-warnings -o ' . $escapedPattern . ' '
    . $escapedUrl . ' 2>&1';

$output = @shell_exec($cmd);

// Find resulting file
$files = glob($downloadDir . DIRECTORY_SEPARATOR . 'tunelocal_*.*');
if (!$files || count($files) === 0) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to download audio from YouTube. Check that yt-dlp is working correctly.',
        'details' => $output
    ]);
    $conn->close();
    exit;
}

$filePath = $files[0];
$fileSize = filesize($filePath);
$ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

// Map extension to MIME type
$mimeTypes = [
    'mp3'  => 'audio/mpeg',
    'm4a'  => 'audio/mp4',
    'aac'  => 'audio/aac',
    'ogg'  => 'audio/ogg',
    'opus' => 'audio/ogg',
    'webm' => 'audio/webm',
    'wav'  => 'audio/wav'
];

$mime = $mimeTypes[$ext] ?? 'audio/mpeg';

// Read file and convert to data URL (same format as manual uploads)
$binary = file_get_contents($filePath);
if ($binary === false) {
    @unlink($filePath);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to read downloaded audio file'
    ]);
    $conn->close();
    exit;
}

$base64 = base64_encode($binary);
$dataUrl = 'data:' . $mime . ';base64,' . $base64;

// Use a friendly file name
$safeTitle = preg_replace('/[^\w\s\-]+/u', '', $title);
$safeTitle = trim($safeTitle) !== '' ? $safeTitle : 'YouTube Track';
$fileName = $safeTitle . '.' . $ext;

try {
    $sql = "INSERT INTO music_library (name, file_name, file_type, file_size, file_data) 
            VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

    $stmt->bind_param('sssis', $safeTitle, $fileName, $mime, $fileSize, $dataUrl);

    if (!$stmt->execute()) {
        throw new Exception('Execute failed: ' . $stmt->error);
    }

    $trackId = $conn->insert_id;
    $stmt->close();

    // Clean up temp file
    @unlink($filePath);

    echo json_encode([
        'success' => true,
        'id' => $trackId,
        'message' => 'Track downloaded and saved to Offline Music',
        'name' => $safeTitle,
        'fileName' => $fileName
    ]);
} catch (Exception $e) {
    @unlink($filePath);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to save track to database',
        'details' => $e->getMessage()
    ]);
}

$conn->close();
?>

