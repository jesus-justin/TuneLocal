<?php
/**
 * Test Database Connection
 * Open this file in browser to check if database is working
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>TuneLocal Database Connection Test</h1>";

// Test 1: Check if config file exists
echo "<h2>Test 1: Config File</h2>";
if (file_exists('config.php')) {
    echo "✅ config.php exists<br>";
    require_once 'config.php';
} else {
    echo "❌ config.php not found!<br>";
    exit;
}

// Test 2: Check database connection
echo "<h2>Test 2: Database Connection</h2>";
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
    if ($conn->connect_error) {
        echo "❌ Connection failed: " . $conn->connect_error . "<br>";
        exit;
    }
    echo "✅ Connected to MySQL successfully<br>";
    echo "MySQL Version: " . $conn->server_info . "<br>";
    
    // Test 3: Check if database exists
    echo "<h2>Test 3: Database 'tunelocal'</h2>";
    $result = $conn->query("SHOW DATABASES LIKE 'tunelocal'");
    if ($result->num_rows > 0) {
        echo "✅ Database 'tunelocal' exists<br>";
        
        // Select the database
        $conn->select_db(DB_NAME);
        
        // Test 4: Check tables
        echo "<h2>Test 4: Tables</h2>";
        $tables = ['music_library', 'playlists', 'saved_songs', 'settings'];
        foreach ($tables as $table) {
            $result = $conn->query("SHOW TABLES LIKE '$table'");
            if ($result->num_rows > 0) {
                echo "✅ Table '$table' exists<br>";
            } else {
                echo "❌ Table '$table' not found!<br>";
            }
        }
        
        // Test 5: Check music_library structure
        echo "<h2>Test 5: music_library Structure</h2>";
        $result = $conn->query("DESCRIBE music_library");
        if ($result) {
            echo "<table border='1' cellpadding='5'>";
            echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th></tr>";
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>{$row['Field']}</td>";
                echo "<td>{$row['Type']}</td>";
                echo "<td>{$row['Null']}</td>";
                echo "<td>{$row['Key']}</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
        
        // Test 6: Count records
        echo "<h2>Test 6: Record Count</h2>";
        $result = $conn->query("SELECT COUNT(*) as count FROM music_library");
        $row = $result->fetch_assoc();
        echo "Total tracks in library: " . $row['count'] . "<br>";
        
        // Test 7: API Test
        echo "<h2>Test 7: API Endpoints</h2>";
        echo "<a href='music.php?action=list' target='_blank'>Test: Get All Tracks</a><br>";
        echo "<a href='music.php?action=stats' target='_blank'>Test: Get Statistics</a><br>";
        
    } else {
        echo "❌ Database 'tunelocal' does not exist!<br>";
        echo "<p>Please import the SQL file first:</p>";
        echo "<ol>";
        echo "<li>Go to <a href='http://localhost/phpmyadmin' target='_blank'>phpMyAdmin</a></li>";
        echo "<li>Click 'New' to create database</li>";
        echo "<li>Name it: tunelocal</li>";
        echo "<li>Click 'Import' tab</li>";
        echo "<li>Choose: C:\\xampp\\htdocs\\TuneLocal\\database\\tunelocal.sql</li>";
        echo "<li>Click 'Go'</li>";
        echo "</ol>";
    }
    
    $conn->close();
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

echo "<hr>";
echo "<h2>Summary</h2>";
echo "<p>If all tests show ✅, your database is configured correctly!</p>";
echo "<p>If you see any ❌, please fix those issues first.</p>";
?>

<style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
    h1 { color: #1db954; }
    h2 { color: #333; margin-top: 20px; border-bottom: 2px solid #1db954; padding-bottom: 5px; }
    table { background: white; margin: 10px 0; }
    a { color: #1db954; text-decoration: none; font-weight: bold; }
    a:hover { text-decoration: underline; }
</style>
