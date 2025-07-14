<?php
$code = $_GET["code"] ?? '';

$path = "../lists/{$code}.json";
if (!file_exists($path)) {
    http_response_code(404);
    echo "List not found";
    exit;
}

header("Content-Type: application/json");
echo file_get_contents($path);
?>
