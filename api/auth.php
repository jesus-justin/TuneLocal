<?php
/**
 * TuneLocal Authentication API
 * Handles user registration, login, and authentication
 */

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? $_POST['action'] ?? 'check';

try {
    switch ($action) {
        case 'register':
            handleRegister();
            break;
        case 'login':
            handleLogin();
            break;
        case 'logout':
            handleLogout();
            break;
        case 'check':
            handleCheckAuth();
            break;
        case 'get-profile':
            handleGetProfile();
            break;
        case 'update-profile':
            handleUpdateProfile();
            break;
        case 'change-password':
            handleChangePassword();
            break;
        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

/**
 * Handle user registration
 */
function handleRegister() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        return;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    
    $username = trim($input['username'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $confirmPassword = $input['confirmPassword'] ?? '';
    $firstName = trim($input['firstName'] ?? '');
    $lastName = trim($input['lastName'] ?? '');

    // Validation
    if (!$username || !$email || !$password) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        return;
    }

    if (strlen($username) < 3) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Username must be at least 3 characters']);
        return;
    }

    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Password must be at least 6 characters']);
        return;
    }

    if ($password !== $confirmPassword) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Passwords do not match']);
        return;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid email address']);
        return;
    }

    $conn = getDBConnection();

    // Check if username already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Username already taken']);
        $stmt->close();
        $conn->close();
        return;
    }
    $stmt->close();

    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Email already registered']);
        $stmt->close();
        $conn->close();
        return;
    }
    $stmt->close();

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $username, $email, $hashedPassword, $firstName, $lastName);

    if ($stmt->execute()) {
        $userId = $stmt->insert_id;
        
        // Create session token
        $sessionToken = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));
        $ipAddress = $_SERVER['REMOTE_ADDR'];
        $userAgent = $_SERVER['HTTP_USER_AGENT'];

        $sessionStmt = $conn->prepare("INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)");
        $sessionStmt->bind_param("issss", $userId, $sessionToken, $ipAddress, $userAgent, $expiresAt);
        $sessionStmt->execute();
        $sessionStmt->close();

        setcookie('auth_token', $sessionToken, strtotime('+30 days'), '/', '', false, true);

        echo json_encode([
            'success' => true,
            'message' => 'Registration successful',
            'user' => [
                'id' => $userId,
                'username' => $username,
                'email' => $email,
                'firstName' => $firstName,
                'lastName' => $lastName
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Registration failed']);
    }

    $stmt->close();
    $conn->close();
}

/**
 * Handle user login
 */
function handleLogin() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        return;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    
    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';

    if (!$username || !$password) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Username and password required']);
        return;
    }

    $conn = getDBConnection();

    // Find user by username or email
    $stmt = $conn->prepare("SELECT id, username, email, password, first_name, last_name, avatar_url FROM users WHERE (username = ? OR email = ?) AND is_active = 1");
    $stmt->bind_param("ss", $username, $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid username or password']);
        $stmt->close();
        $conn->close();
        return;
    }

    $user = $result->fetch_assoc();
    $stmt->close();

    // Verify password
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid username or password']);
        $conn->close();
        return;
    }

    // Update last login
    $updateStmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $updateStmt->bind_param("i", $user['id']);
    $updateStmt->execute();
    $updateStmt->close();

    // Create session token
    $sessionToken = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));
    $ipAddress = $_SERVER['REMOTE_ADDR'];
    $userAgent = $_SERVER['HTTP_USER_AGENT'];

    $sessionStmt = $conn->prepare("INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)");
    $sessionStmt->bind_param("issss", $user['id'], $sessionToken, $ipAddress, $userAgent, $expiresAt);
    $sessionStmt->execute();
    $sessionStmt->close();

    setcookie('auth_token', $sessionToken, strtotime('+30 days'), '/', '', false, true);

    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'firstName' => $user['first_name'],
            'lastName' => $user['last_name'],
            'avatar' => $user['avatar_url']
        ]
    ]);

    $conn->close();
}

/**
 * Handle logout
 */
function handleLogout() {
    $authToken = $_COOKIE['auth_token'] ?? null;

    if ($authToken) {
        $conn = getDBConnection();
        $stmt = $conn->prepare("DELETE FROM user_sessions WHERE session_token = ?");
        $stmt->bind_param("s", $authToken);
        $stmt->execute();
        $stmt->close();
        $conn->close();
    }

    setcookie('auth_token', '', time() - 3600, '/', '', false, true);

    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
}

/**
 * Check authentication status
 */
function handleCheckAuth() {
    $authToken = $_COOKIE['auth_token'] ?? null;

    if (!$authToken) {
        echo json_encode(['success' => false, 'authenticated' => false]);
        return;
    }

    $conn = getDBConnection();

    // Get user from valid session
    $stmt = $conn->prepare("SELECT user_id FROM user_sessions WHERE session_token = ? AND expires_at > NOW()");
    $stmt->bind_param("s", $authToken);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        setcookie('auth_token', '', time() - 3600, '/', '', false, true);
        echo json_encode(['success' => false, 'authenticated' => false]);
        $stmt->close();
        $conn->close();
        return;
    }

    $session = $result->fetch_assoc();
    $userId = $session['user_id'];
    $stmt->close();

    // Get user profile
    $userStmt = $conn->prepare("SELECT id, username, email, first_name, last_name, avatar_url, bio, favorite_genre, country, theme, language FROM users WHERE id = ?");
    $userStmt->bind_param("i", $userId);
    $userStmt->execute();
    $userResult = $userStmt->get_result();

    if ($userResult->num_rows === 0) {
        echo json_encode(['success' => false, 'authenticated' => false]);
        $userStmt->close();
        $conn->close();
        return;
    }

    $user = $userResult->fetch_assoc();
    $userStmt->close();
    $conn->close();

    echo json_encode([
        'success' => true,
        'authenticated' => true,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'firstName' => $user['first_name'],
            'lastName' => $user['last_name'],
            'avatar' => $user['avatar_url'],
            'bio' => $user['bio'],
            'favoriteGenre' => $user['favorite_genre'],
            'country' => $user['country'],
            'theme' => $user['theme'],
            'language' => $user['language']
        ]
    ]);
}

/**
 * Get user profile
 */
function handleGetProfile() {
    $authToken = $_COOKIE['auth_token'] ?? null;

    if (!$authToken) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthorized']);
        return;
    }

    $conn = getDBConnection();

    $stmt = $conn->prepare("SELECT user_id FROM user_sessions WHERE session_token = ? AND expires_at > NOW()");
    $stmt->bind_param("s", $authToken);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Session expired']);
        $stmt->close();
        $conn->close();
        return;
    }

    $session = $result->fetch_assoc();
    $userId = $session['user_id'];
    $stmt->close();

    $userStmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    $userStmt->bind_param("i", $userId);
    $userStmt->execute();
    $userResult = $userStmt->get_result();

    if ($userResult->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'User not found']);
        $userStmt->close();
        $conn->close();
        return;
    }

    $user = $userResult->fetch_assoc();
    $userStmt->close();
    $conn->close();

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'firstName' => $user['first_name'],
            'lastName' => $user['last_name'],
            'avatar' => $user['avatar_url'],
            'bio' => $user['bio'],
            'favoriteGenre' => $user['favorite_genre'],
            'country' => $user['country'],
            'theme' => $user['theme'],
            'language' => $user['language'],
            'createdAt' => $user['created_at'],
            'lastLogin' => $user['last_login']
        ]
    ]);
}

/**
 * Update user profile
 */
function handleUpdateProfile() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        return;
    }

    $authToken = $_COOKIE['auth_token'] ?? null;

    if (!$authToken) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthorized']);
        return;
    }

    $conn = getDBConnection();

    $stmt = $conn->prepare("SELECT user_id FROM user_sessions WHERE session_token = ? AND expires_at > NOW()");
    $stmt->bind_param("s", $authToken);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Session expired']);
        $stmt->close();
        $conn->close();
        return;
    }

    $session = $result->fetch_assoc();
    $userId = $session['user_id'];
    $stmt->close();

    $input = json_decode(file_get_contents('php://input'), true);

    $firstName = $input['firstName'] ?? null;
    $lastName = $input['lastName'] ?? null;
    $bio = $input['bio'] ?? null;
    $favoriteGenre = $input['favoriteGenre'] ?? null;
    $country = $input['country'] ?? null;
    $theme = $input['theme'] ?? null;
    $language = $input['language'] ?? null;

    $updateStmt = $conn->prepare("UPDATE users SET first_name = ?, last_name = ?, bio = ?, favorite_genre = ?, country = ?, theme = ?, language = ? WHERE id = ?");
    $updateStmt->bind_param("sssssssi", $firstName, $lastName, $bio, $favoriteGenre, $country, $theme, $language, $userId);

    if ($updateStmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to update profile']);
    }

    $updateStmt->close();
    $conn->close();
}

/**
 * Change password
 */
function handleChangePassword() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        return;
    }

    $authToken = $_COOKIE['auth_token'] ?? null;

    if (!$authToken) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthorized']);
        return;
    }

    $input = json_decode(file_get_contents('php://input'), true);

    $oldPassword = $input['oldPassword'] ?? '';
    $newPassword = $input['newPassword'] ?? '';
    $confirmPassword = $input['confirmPassword'] ?? '';

    if (!$oldPassword || !$newPassword) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing password fields']);
        return;
    }

    if ($newPassword !== $confirmPassword) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'New passwords do not match']);
        return;
    }

    if (strlen($newPassword) < 6) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Password must be at least 6 characters']);
        return;
    }

    $conn = getDBConnection();

    $stmt = $conn->prepare("SELECT user_id FROM user_sessions WHERE session_token = ? AND expires_at > NOW()");
    $stmt->bind_param("s", $authToken);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Session expired']);
        $stmt->close();
        $conn->close();
        return;
    }

    $session = $result->fetch_assoc();
    $userId = $session['user_id'];
    $stmt->close();

    $userStmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $userStmt->bind_param("i", $userId);
    $userStmt->execute();
    $userResult = $userStmt->get_result();
    $user = $userResult->fetch_assoc();
    $userStmt->close();

    if (!password_verify($oldPassword, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Current password is incorrect']);
        $conn->close();
        return;
    }

    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

    $updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $updateStmt->bind_param("si", $hashedPassword, $userId);

    if ($updateStmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to change password']);
    }

    $updateStmt->close();
    $conn->close();
}
?>
