<?php
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo "Method Not Allowed";
    exit;
}

parse_str(file_get_contents("php://input"), $delete_vars);
$code = $_GET['code'] ?? $delete_vars['code'] ?? '';

if (!$code) {
    http_response_code(400);
    echo "Missing code";
    exit;
}

$path = "../lists/{$code}.json";
if (!file_exists($path)) {
    http_response_code(404);
    echo "List not found";
    exit;
}

if (unlink($path)) {
    echo "Deleted";
} else {
    http_response_code(500);
    echo "Failed to delete";
}
?>
