<?php
require_once __DIR__ . '/config.php';

function job_dir(string $job): string { return JOB_ROOT . DIRECTORY_SEPARATOR . $job; }
function status_path(string $job): string { return job_dir($job) . '/status.json'; }
function log_path(string $job): string { return job_dir($job) . '/log.txt'; }

function write_status(string $job, string $status, string $step, string $message = ''): void {
  $data = ['status' => $status, 'step' => $step, 'message' => $message, 'ts' => time()];
  @file_put_contents(status_path($job), json_encode($data));
}
function append_log(string $job, string $text): void {
  @file_put_contents(log_path($job), $text, FILE_APPEND);
}

function println_log(string $job, string $line): void {
  append_log($job, $line . PHP_EOL);
}

function isValidZip(string $path): bool {
  $zip = new ZipArchive();
  if ($zip->open($path) !== true) return false;
  $ok = $zip->numFiles >= 1;
  $zip->close();
  return $ok;
}

function createFrontendZip(string $root, string $zipPath, string $job): void {
  $include = [
    'package.json','package-lock.json','yarn.lock','pnpm-lock.yaml',
    'vite.config.ts','vite.config.js','tsconfig.json','eslint.config.js','components.json',
    'resources','public',
  ];
  $excludeDirs = ['node_modules','vendor','.git','.idea','.vscode'];
  $excludeFiles = ['.DS_Store'];

  if (file_exists($zipPath)) @unlink($zipPath);

  $zip = new ZipArchive();
  if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    throw new RuntimeException("Cannot create zip at $zipPath");
  }

  foreach ($include as $rel) {
    $abs = $root . DIRECTORY_SEPARATOR . $rel;
    if (!file_exists($abs)) continue;
    if (is_dir($abs)) {
      $it = new RecursiveIteratorIterator(
        new RecursiveCallbackFilterIterator(
          new RecursiveDirectoryIterator($abs, FilesystemIterator::SKIP_DOTS),
          function ($cur) use ($excludeDirs, $excludeFiles) {
            $name = $cur->getFilename();
            if ($cur->isDir() && in_array($name, $excludeDirs, true)) return false;
            if ($cur->isFile() && in_array($name, $excludeFiles, true)) return false;
            return true;
          }
        ),
        RecursiveIteratorIterator::LEAVES_ONLY
      );
      foreach ($it as $file) {
        if (!$file->isFile()) continue;
        $full = $file->getPathname();
        $local = ltrim(str_replace($root . DIRECTORY_SEPARATOR, '', $full), DIRECTORY_SEPARATOR);
        $zip->addFile($full, $local);
      }
    } else {
      $local = ltrim(str_replace($root . DIRECTORY_SEPARATOR, '', $abs), DIRECTORY_SEPARATOR);
      $zip->addFile($abs, $local);
    }
  }
  $zip->close();
  if (!isValidZip($zipPath)) throw new RuntimeException("Created zip invalid: $zipPath");
}

function enqueueBuild(string $apiBase, string $zipPath): string {
  $ch = curl_init("$apiBase/build");
  $postFields = ['file' => new CURLFile($zipPath, 'application/zip', 'frontend.zip')];
  curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => $postFields, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 120]);
  $resp = curl_exec($ch);
  $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $err = curl_error($ch);
  curl_close($ch);
  if ($resp === false || $http < 200 || $http >= 300) throw new RuntimeException("Upload failed (HTTP $http): $err $resp");
  $json = json_decode($resp, true);
  if (!is_array($json) || empty($json['job_id'])) throw new RuntimeException("Invalid response: $resp");
  return (string)$json['job_id'];
}

function waitForBuild(string $apiBase, string $jobId, string $job, int $timeoutSeconds = 1800, int $pollSeconds = 3): array {
  $deadline = time() + $timeoutSeconds;
  while (time() < $deadline) {
    sleep($pollSeconds);
    $ch = curl_init("$apiBase/status/" . urlencode($jobId));
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30]);
    $resp = curl_exec($ch); $http = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    if ($resp === false || $http < 200 || $http >= 300) continue;
    $json = json_decode($resp, true);
    if (!is_array($json) || empty($json['status'])) continue;
    write_status($job, $json['status'], 'building');
    if ($json['status'] === 'finished') return $json;
    if ($json['status'] === 'failed') {
      throw new RuntimeException("Remote build failed: " . substr((string)($json['error'] ?? ''), 0, 4000));
    }
  }
  throw new RuntimeException("Timed out waiting for build");
}

function downloadArtifact(string $apiBase, string $jobId, string $destPath): void {
  $fh = fopen($destPath, 'wb'); if ($fh === false) throw new RuntimeException("Cannot open $destPath");
  $ch = curl_init("$apiBase/download/" . urlencode($jobId));
  curl_setopt_array($ch, [CURLOPT_FILE => $fh, CURLOPT_TIMEOUT => 600, CURLOPT_FOLLOWLOCATION => true]);
  $ok = curl_exec($ch); $http = curl_getinfo($ch, CURLINFO_HTTP_CODE); $err = curl_error($ch); curl_close($ch); fclose($fh);
  if ($ok === false || $http < 200 || $http >= 300) { @unlink($destPath); throw new RuntimeException("Download failed (HTTP $http): $err"); }
  if (!isValidZip($destPath)) { @unlink($destPath); throw new RuntimeException("Downloaded file invalid"); }
}

function rrmdir(string $dir): void {
  if (!file_exists($dir)) return;
  if (is_file($dir) || is_link($dir)) { @unlink($dir); return; }
  foreach (scandir($dir) ?: [] as $item) {
    if ($item === '.' || $item === '..') continue;
    $path = $dir . DIRECTORY_SEPARATOR . $item;
    if (is_dir($path)) rrmdir($path); else @unlink($path);
  }
  @rmdir($dir);
}
function rcopys(string $src, string $dst): void {
  if (is_file($src)) { @mkdir(dirname($dst), 0777, true); copy($src, $dst); return; }
  @mkdir($dst, 0777, true);
  $dir = opendir($src); if ($dir === false) return;
  while (($file = readdir($dir)) !== false) {
    if ($file === '.' || $file === '..') continue;
    $sp = $src . DIRECTORY_SEPARATOR . $file; $dp = $dst . DIRECTORY_SEPARATOR . $file;
    if (is_dir($sp)) rcopys($sp, $dp); else { @mkdir(dirname($dp), 0777, true); copy($sp, $dp); }
  }
  closedir($dir);
}

function deployToPublicBuild(string $projectRoot, string $downloadZip): void {
  $extractDir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'fe_extract_' . uniqid();
  @mkdir($extractDir, 0777, true);
  try {
    $zip = new ZipArchive(); if ($zip->open($downloadZip) !== true) throw new RuntimeException("Cannot open zip");
    if (!$zip->extractTo($extractDir)) { $zip->close(); throw new RuntimeException("Failed to extract"); }
    $zip->close();

    $publicBuild = $projectRoot . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'build';
    if (is_dir($publicBuild)) rrmdir($publicBuild);

    $pb = $extractDir . '/public/build';
    $b  = $extractDir . '/build';
    $d  = $extractDir . '/dist';

    if (is_dir($pb)) { @mkdir($publicBuild, 0777, true); rcopys($pb, $publicBuild); }
    elseif (is_dir($b)) { @mkdir($publicBuild, 0777, true); rcopys($b, $publicBuild); }
    elseif (is_dir($d)) { @mkdir($publicBuild, 0777, true); rcopys($d, $publicBuild); }
    else {
      $maybePublic = $extractDir . '/public';
      if (is_dir($maybePublic)) rcopys($maybePublic, $projectRoot . '/public');
      else throw new RuntimeException("Artifact missing public/build, build, or dist");
    }
  } finally { rrmdir($extractDir); }
}