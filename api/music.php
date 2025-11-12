<?php
/**
 * TuneLocal Music API
 * Handles all music library operations
 */

// Catch any errors before output
ob_start();

require_once 'config.php';

$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGet($conn);
            break;
        case 'POST':
            handlePost($conn);
            break;
        case 'DELETE':
            handleDelete($conn);
            break;
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
ob_end_flush();

/**
 * Get music tracks or statistics
 */
function handleGet($conn) {
    $action = $_GET['action'] ?? 'list';
    
    switch ($action) {
        case 'list':
            // Get all tracks
            $sql = "SELECT id, name, file_name, file_type, file_size, date_added, play_count 
                    FROM music_library 
                    ORDER BY date_added DESC";
            $result = $conn->query($sql);
            
            $tracks = [];
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $tracks[] = $row;
                }
            }
            
            echo json_encode([
                'success' => true,
                'tracks' => $tracks,
                'count' => count($tracks)
            ]);
            break;
            
        case 'stats':
            // Get statistics
            $sql = "SELECT * FROM library_stats";
            $result = $conn->query($sql);
            $stats = $result->fetch_assoc();
            
            echo json_encode([
                'success' => true,
                'stats' => $stats
            ]);
            break;
            
        case 'get':
            // Get single track with data
            $id = $_GET['id'] ?? 0;
            $sql = "SELECT * FROM music_library WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($row = $result->fetch_assoc()) {
                // Update play count
                $updateSql = "UPDATE music_library 
                             SET play_count = play_count + 1, last_played = NOW() 
                             WHERE id = ?";
                $updateStmt = $conn->prepare($updateSql);
                $updateStmt->bind_param('i', $id);
                $updateStmt->execute();
                
                echo json_encode([
                    'success' => true,
                    'track' => $row
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Track not found'
                ]);
            }
            break;
            
        default:
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
            break;
    }
}

/**
 * Upload new music track
 */
function handlePost($conn) {
    $action = $_POST['action'] ?? 'upload';
    
    switch ($action) {
        case 'upload':
            try {
                // Get uploaded file data
                $name = $_POST['name'] ?? '';
                $fileName = $_POST['fileName'] ?? '';
                $fileType = $_POST['fileType'] ?? '';
                $fileSize = intval($_POST['fileSize'] ?? 0);
                $fileData = $_POST['fileData'] ?? '';
                
                if (empty($name) || empty($fileName) || empty($fileData)) {
                    throw new Exception('Missing required fields: name, fileName, or fileData');
                }
                
                // Validate file size (max 100MB recommended)
                if ($fileSize > 104857600) { // 100MB
                    throw new Exception('File too large. Maximum size is 100MB.');
                }
                
                // Insert into database
                $sql = "INSERT INTO music_library (name, file_name, file_type, file_size, file_data) 
                        VALUES (?, ?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                
                if (!$stmt) {
                    throw new Exception('Database prepare failed: ' . $conn->error);
                }
                
                $stmt->bind_param('sssis', $name, $fileName, $fileType, $fileSize, $fileData);
                
                if ($stmt->execute()) {
                    echo json_encode([
                        'success' => true,
                        'id' => $conn->insert_id,
                        'message' => 'Track uploaded successfully'
                    ]);
                } else {
                    throw new Exception('Failed to upload track: ' . $stmt->error);
                }
                
                $stmt->close();
                
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => $e->getMessage()
                ]);
            }
            break;
            
        case 'clear':
            // Clear all tracks
            $sql = "DELETE FROM music_library";
            if ($conn->query($sql)) {
                echo json_encode([
                    'success' => true,
                    'message' => 'All tracks deleted'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Failed to clear library'
                ]);
            }
            break;
            
        default:
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
            break;
    }
}

/**
 * Delete music track
 */
function handleDelete($conn) {
    $id = $_GET['id'] ?? 0;
    
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid track ID'
        ]);
        return;
    }
    
    $sql = "DELETE FROM music_library WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Track deleted successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to delete track'
        ]);
    }
}
?>
