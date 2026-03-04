<?php
/**
 * TuneLocal - API Logger
 * Logs API requests and responses for debugging
 * Version 1.0.1 - Enhanced logging capabilities
 */

class APILogger {
    private $logFile;
    
    public function __construct($logDir = '../logs') {
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        $this->logFile = $logDir . '/api-' . date('Y-m-d') . '.log';
    }
    
    public function log($method, $action, $status, $message = '') {
        $timestamp = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $logEntry = "[$timestamp] IP: $ip | Method: $method | Action: $action | Status: $status";
        
        if ($message) {
            $logEntry .= " | Message: $message";
        }
        
        error_log($logEntry . PHP_EOL, 3, $this->logFile);
    }
    
    public function getRecentLogs($lines = 50) {
        if (!file_exists($this->logFile)) {
            return [];
        }
        
        $file = new SplFileObject($this->logFile, 'r');
        $file->seek(PHP_INT_MAX);
        $lineCount = $file->key();
        $startLine = max(0, $lineCount - $lines);
        
        $logs = [];
        for ($i = $startLine; $i <= $lineCount; $i++) {
            $file->seek($i);
            if ($line = trim($file->current())) {
                $logs[] = $line;
            }
        }
        
        return $logs;
    }
}

// Create logger instance
$logger = new APILogger();
?>
