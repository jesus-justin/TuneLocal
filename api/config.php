<?php
/**
 * TuneLocal Database Configuration
 * Configure your database connection here
 */

// Database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');          // Default XAMPP username
define('DB_PASS', '');              // Default XAMPP password (empty)
define('DB_NAME', 'tunelocal');

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors in output (breaks JSON)
ini_set('log_errors', 1);
ini_set('error_log', '../error.log');

// Increase limits for large file uploads
ini_set('memory_limit', '512M');
ini_set('post_max_size', '512M');
ini_set('upload_max_filesize', '512M');
ini_set('max_execution_time', '300');
ini_set('max_input_time', '300');

// Set timezone
date_default_timezone_set('UTC');

// Create database connection
function getDBConnection() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }
        
        // Set charset to UTF-8
        $conn->set_charset("utf8mb4");
        
        // Increase max_allowed_packet for large files
        $conn->query("SET GLOBAL max_allowed_packet=1073741824"); // 1GB
        
        return $conn;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database connection failed. Please check if MySQL is running in XAMPP and the database "tunelocal" exists.',
            'details' => $e->getMessage()
        ]);
        exit;
    }
}

// CORS headers for API access
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
