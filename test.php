<?php
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Sample data for select dropdown
    echo json_encode([
        ["value" => 1, "text" => "Yes"],
        ["value" => 0, "text" => "No"]
    ]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Simulate saving the data and returning success response
    $input = json_decode(file_get_contents("php://input"), true);

    // If JSON is empty, try to read form-encoded data
    if (!$input) {
        $input = $_POST;
    }

    if (!isset($input['name']) || !isset($input['value'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid request"]);
        exit;
    }

    // Normally, you would store this in a database, but for testing, just return success
    echo json_encode(["success" => true, "newValue" => $input['value']]);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method Not Allowed"]);
}
