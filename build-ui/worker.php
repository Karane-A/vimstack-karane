<?php
require_once __DIR__ . '/functions.php';

$job   = $argv[1] ?? ($_GET['job'] ?? '');
if (!$job) { exit(1); }

$apiBase = BUILD_API_BASE;
$root    = PROJECT_ROOT;

try {
  write_status($job, 'started', 'zipping', 'Creating upload zip');
  $uploadZip = job_dir($job) . '/upload.zip';
  $downloadZip = job_dir($job) . '/artifact.zip';

  createFrontendZip($root, $uploadZip, $job);
  println_log($job, "Zip created: $uploadZip (" . @filesize($uploadZip) . " bytes)");

  write_status($job, 'started', 'upload', 'Uploading to build API');
  $remoteJob = enqueueBuild($apiBase, $uploadZip);
  println_log($job, "Remote job: $remoteJob");

  write_status($job, 'started', 'building', 'Waiting for remote build');
  $result = waitForBuild($apiBase, $remoteJob, $job, 3600, 3);
  println_log($job, "Remote build finished");

  write_status($job, 'started', 'download', 'Downloading artifact');
  downloadArtifact($apiBase, $remoteJob, $downloadZip);
  println_log($job, "Downloaded: $downloadZip (" . @filesize($downloadZip) . " bytes)");

  write_status($job, 'started', 'deploy', 'Deploying to public/build');
  deployToPublicBuild($root, $downloadZip);
  println_log($job, "Deploy complete");

  write_status($job, 'finished', 'done', 'Success');
} catch (Throwable $e) {
  println_log($job, '[ERROR] ' . $e->getMessage());
  write_status($job, 'failed', 'error', $e->getMessage());
  exit(1);
}