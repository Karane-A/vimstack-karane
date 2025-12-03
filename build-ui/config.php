<?php
// API base of your builder (FastAPI)
define('BUILD_API_BASE', rtrim(getenv('BUILD_API_BASE') ?: 'http://192.248.172.30:8000', '/'));

// Project root (where package.json, resources/, public/ exist)
// Default should be the repository root. Since this file lives in build-ui,
// go one directory up by default.
define('PROJECT_ROOT', rtrim(getenv('PROJECT_ROOT') ?: dirname(__DIR__), DIRECTORY_SEPARATOR));

// Where to store temp jobs/logs
define('JOB_ROOT', sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'php_build_jobs');
if (!is_dir(JOB_ROOT)) { @mkdir(JOB_ROOT, 0777, true); }