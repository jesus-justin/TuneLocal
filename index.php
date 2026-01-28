<?php
// Simple router for TuneLocal
// Redirect to appropriate page based on authentication status

session_start();

// Check if user is authenticated
$isAuthenticated = false;
if (isset($_COOKIE['auth_token'])) {
    // Make a quick API call to check auth
    $response = @file_get_contents('http://localhost/TuneLocal/api/auth.php?action=check', false, 
        stream_context_create(['http' => ['timeout' => 2]]));
    
    if ($response && json_decode($response, true)['authenticated'] ?? false) {
        $isAuthenticated = true;
    }
}

// Determine redirect path
if ($isAuthenticated) {
    // Redirect to dashboard
    header('Location: pages/index.html', true, 302);
} else {
    // Redirect to landing page
    header('Location: pages/landing.html', true, 302);
}
exit;
?>
