<?php
$input = json_decode(file_get_contents('php://input'), true);

$code = $input['code'] ?? '';
$data = $input['data'] ?? '';

if (!$code || !$data) {
    http_response_code(400);
    echo "Missing code or data";
    exit;
}

file_put_contents("../lists/{$code}.json", json_encode($data, JSON_PRETTY_PRINT));
echo "Saved";
?>
