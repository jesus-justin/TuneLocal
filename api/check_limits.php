<?php
/**
 * Check PHP Upload Limits
 */
?>
<!DOCTYPE html>
<html>
<head>
    <title>PHP Upload Limits - TuneLocal</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        h1 { color: #1db954; }
        table { background: white; border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border: 1px solid #ddd; }
        th { background: #1db954; color: white; }
        .warning { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 20px 0; }
        .success { background: #d4edda; padding: 10px; border-left: 4px solid #28a745; margin: 20px 0; }
        .error { background: #f8d7da; padding: 10px; border-left: 4px solid #dc3545; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>PHP Configuration for TuneLocal</h1>
    
    <h2>Current Upload Limits</h2>
    <table>
        <tr>
            <th>Setting</th>
            <th>Current Value</th>
            <th>Recommended</th>
            <th>Status</th>
        </tr>
        <tr>
            <td>upload_max_filesize</td>
            <td><?php echo ini_get('upload_max_filesize'); ?></td>
            <td>1024M</td>
            <td><?php echo (int)ini_get('upload_max_filesize') >= 1024 ? '✅' : '⚠️'; ?></td>
        </tr>
        <tr>
            <td>post_max_size</td>
            <td><?php echo ini_get('post_max_size'); ?></td>
            <td>1024M</td>
            <td><?php echo (int)ini_get('post_max_size') >= 1024 ? '✅' : '⚠️'; ?></td>
        </tr>
        <tr>
            <td>memory_limit</td>
            <td><?php echo ini_get('memory_limit'); ?></td>
            <td>1024M</td>
            <td><?php echo (int)ini_get('memory_limit') >= 1024 ? '✅' : '⚠️'; ?></td>
        </tr>
        <tr>
            <td>max_execution_time</td>
            <td><?php echo ini_get('max_execution_time'); ?> seconds</td>
            <td>600 seconds</td>
            <td><?php echo (int)ini_get('max_execution_time') >= 600 ? '✅' : '⚠️'; ?></td>
        </tr>
        <tr>
            <td>max_input_time</td>
            <td><?php echo ini_get('max_input_time'); ?> seconds</td>
            <td>600 seconds</td>
            <td><?php echo (int)ini_get('max_input_time') >= 600 ? '✅' : '⚠️'; ?></td>
        </tr>
    </table>
    
    <?php
    $upload_max = (int)ini_get('upload_max_filesize');
    $post_max = (int)ini_get('post_max_size');
    $memory = (int)ini_get('memory_limit');
    
    if ($upload_max >= 1024 && $post_max >= 1024 && $memory >= 1024) {
        echo '<div class="success"><strong>✅ All settings are optimal!</strong> You can upload large files.</div>';
    } else {
        echo '<div class="error"><strong>⚠️ Settings need adjustment</strong></div>';
        echo '<div class="warning">';
        echo '<h3>How to Fix:</h3>';
        echo '<ol>';
        echo '<li>Open XAMPP Control Panel</li>';
        echo '<li>Stop Apache (if running)</li>';
        echo '<li>Click "Config" button next to Apache → Select "php.ini"</li>';
        echo '<li>Find and change these lines:<br><br>';
        echo '<code>upload_max_filesize = 1024M</code><br>';
        echo '<code>post_max_size = 1024M</code><br>';
        echo '<code>memory_limit = 1024M</code><br>';
        echo '<code>max_execution_time = 600</code><br>';
        echo '<code>max_input_time = 600</code><br><br>';
        echo '</li>';
        echo '<li>Save the file (Ctrl+S)</li>';
        echo '<li>Start Apache again</li>';
        echo '<li>Refresh this page to verify</li>';
        echo '</ol>';
        echo '</div>';
    }
    ?>
    
    <h2>MySQL Packet Size</h2>
    <?php
    try {
        $conn = new mysqli('localhost', 'root', '', 'tunelocal');
        $result = $conn->query("SHOW VARIABLES LIKE 'max_allowed_packet'");
        $row = $result->fetch_assoc();
        $max_packet = (int)$row['Value'] / 1024 / 1024; // Convert to MB
        
        echo "<p>Current: <strong>{$max_packet} MB</strong></p>";
        
        if ($max_packet >= 1024) {
            echo '<div class="success">✅ MySQL can handle large files (1GB+)</div>';
        } else {
            echo '<div class="warning">';
            echo '<p>⚠️ MySQL packet size should be increased</p>';
            echo '<p>Run this in phpMyAdmin SQL tab:</p>';
            echo '<code>SET GLOBAL max_allowed_packet=1073741824;</code>';
            echo '</div>';
        }
        
        $conn->close();
    } catch (Exception $e) {
        echo '<div class="error">Could not check MySQL: ' . $e->getMessage() . '</div>';
    }
    ?>
    
    <hr>
    <p><a href="test.php">← Back to Database Test</a> | <a href="../index.html">Go to TuneLocal →</a></p>
</body>
</html>
