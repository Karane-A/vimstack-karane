<?php
require_once __DIR__ . '/functions.php';
header('Content-Type: application/json');

$job = 'job_' . bin2hex(random_bytes(8));
$dir = job_dir($job);
@mkdir($dir, 0777, true);
file_put_contents(log_path($job), "Starting job $job\n");
write_status($job, 'queued', 'init', 'Queued');

$php = PHP_BINARY ?: 'php';
$cmd = escapeshellcmd($php) . ' ' . escapeshellarg(__DIR__ . '/worker.php') . ' ' . escapeshellarg($job) . ' > /dev/null 2>&1 &';
exec($cmd);

echo json_encode(['job' => $job]);