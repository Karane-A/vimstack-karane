<?php
require_once __DIR__ . '/functions.php';
header('Content-Type: application/json');

$job = $_GET['job'] ?? '';
if (!$job || !is_file(status_path($job))) {
  http_response_code(404);
  echo json_encode(['error' => 'job not found']);
  exit;
}

$status = json_decode(@file_get_contents(status_path($job)), true) ?: [];
$log = @file_get_contents(log_path($job)) ?: '';
// Optionally tail log
$max = 20000;
if (strlen($log) > $max) $log = substr($log, -$max);

echo json_encode(['status' => $status, 'log' => $log]);