<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/app/helpers.php';

session_start();
header('Content-Type: application/json');

$pdo = null;
try {
    $pdo = getPDO();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

switch ($path) {
    case '/users':
        if ($method === 'POST') {
            $stmt = $pdo->query('SELECT id, phone_number, employee_id FROM users');
            echo json_encode($stmt->fetchAll());
            exit;
        }
        break;
    case '/register':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $phone = $data['phone_number'] ?? $data['phone'] ?? '';
            $eid = $data['employee_id'] ?? '';
            $pass = $data['password'] ?? '';
            if (!$phone || !$eid || !$pass) {
                http_response_code(400);
                echo json_encode(['success'=>false,'message'=>'Missing fields']);
                exit;
            }
            $records = findPhoneInCsv($phone);
            if (empty($records)) {
                http_response_code(404);
                echo json_encode(['success'=>false,'message'=>'Phone number not found in records']);
                exit;
            }
            $hash = password_hash($pass, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare('INSERT INTO users(phone_number, employee_id, password_hash) VALUES(?,?,?)');
            try {
                $stmt->execute([$phone, $eid, $hash]);
                echo json_encode(['message'=>'User registered']);
            } catch (PDOException $e) {
                http_response_code(400);
                echo json_encode(['success'=>false,'message'=>'User already exists']);
            }
            exit;
        }
        break;
    case '/login':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $phone = $data['phone_number'] ?? $data['phone'] ?? '';
            $pass = $data['password'] ?? '';
            if (!$phone || !$pass) {
                http_response_code(400);
                echo json_encode(['success'=>false,'message'=>'Missing credentials']);
                exit;
            }
            $stmt = $pdo->prepare('SELECT id, phone_number, employee_id, password_hash FROM users WHERE phone_number=?');
            $stmt->execute([$phone]);
            $user = $stmt->fetch();
            if (!$user || !password_verify($pass, $user['password_hash'])) {
                http_response_code(401);
                echo json_encode(['success'=>false,'message'=>'Invalid credentials']);
                exit;
            }
            $_SESSION['user_id'] = $user['id'];
            echo json_encode(['success'=>true,'message'=>'Login successful','user'=>[
                'id'=>$user['id'],
                'phone_number'=>$user['phone_number'],
                'employee_id'=>$user['employee_id']
            ]]);
            exit;
        }
        break;
    case '/records':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $phone = $data['phone_number'] ?? $data['phone'] ?? '';
            $records = findPhoneInCsv($phone);
            if (empty($records)) {
                http_response_code(404);
                echo json_encode(['success'=>false,'message'=>'No records found']);
            } else {
                echo json_encode($records);
            }
            exit;
        }
        break;
    case '/getAvailableMonths.php':
    case '/getAvailableMonths':
        if ($method === 'POST') {
            $files = listMonthFiles();
            echo json_encode(['success'=>true,'files'=>$files]);
            exit;
        }
        break;
    case '/getPayslip.php':
    case '/getPayslip':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $month = $data['month'] ?? '';
            $phone = $data['phone'] ?? $data['phone_number'] ?? '';
            $record = getPayslipRecord($month.'.csv', $phone);
            if (!$record) {
                http_response_code(404);
                echo json_encode(['success'=>false,'message'=>'Payslip not found']);
            } else {
                echo json_encode(['success'=>true,'data'=>$record]);
            }
            exit;
        }
        break;
}
http_response_code(404);
echo json_encode(['success'=>false,'message'=>'Endpoint not found']);
