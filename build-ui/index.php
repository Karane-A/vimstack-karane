<?php require_once __DIR__ . '/config.php'; ?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Frontend Build & Deploy</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .badge { display: inline-block; padding: 0.25rem 0.625rem; border-radius: 9999px; background: #e5e7eb; margin-right: 0.5rem; font-weight: 600; font-size: 0.75rem; }
    .ok { background: #d1fae5; }
    .fail { background: #fee2e2; }
  </style>
  <script>
    tailwind.config = { theme: { extend: { colors: { brand: { 600: '#5850EC', 700: '#4C51BF' } } } } };
  </script>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen">
  <div class="max-w-4xl mx-auto p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Frontend Build & Deploy</h1>
        <p class="text-sm text-slate-600 mt-1">API: <code class="px-2 py-0.5 rounded bg-slate-100 text-slate-700"><?php echo htmlspecialchars(BUILD_API_BASE, ENT_QUOTES); ?></code></p>
      </div>
      <button id="startBtn" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 4.5l5 3.5-5 3.5v-7z"/></svg>
        Start Build
      </button>
    </div>

    <div class="bg-white shadow-sm ring-1 ring-slate-200 rounded-xl p-6" id="panel" style="display:none;">
      <div class="mb-6">
        <div class="flex items-center justify-between text-xs text-slate-600 mb-2">
          <span id="progressLabel">Waiting to start…</span>
          <span id="progressPct">0%</span>
        </div>
        <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div id="progressBar" class="h-full bg-gradient-to-r from-brand-600 to-indigo-500 transition-all duration-500" style="width:0%"></div>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 gap-3">
        <div class="flex items-center gap-3"><span class="badge" id="s-init">INIT</span><span class="text-slate-700">Preparing</span></div>
        <div class="flex items-center gap-3"><span class="badge" id="s-zip">ZIP</span><span class="text-slate-700">Creating zip</span></div>
        <div class="flex items-center gap-3"><span class="badge" id="s-upload">UPLOAD</span><span class="text-slate-700">Upload to API</span></div>
        <div class="flex items-center gap-3"><span class="badge" id="s-build">BUILD</span><span class="text-slate-700">Remote build</span></div>
        <div class="flex items-center gap-3"><span class="badge" id="s-download">DOWNLOAD</span><span class="text-slate-700">Download artifact</span></div>
        <div class="flex items-center gap-3"><span class="badge" id="s-deploy">DEPLOY</span><span class="text-slate-700">Deploy to public/build</span></div>
        <div class="flex items-center gap-3"><span class="badge" id="s-done">DONE</span><span class="text-slate-700">Completed</span></div>
        <div class="flex items-center gap-3 sm:col-span-2"><span class="badge fail" id="s-error" style="display:none;">ERROR</span><span id="errMsg" class="text-rose-700"></span></div>
      </div>

      <!-- Manual Build Fallback -->
      <div id="manualFallback" class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg" style="display:none;">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <h4 class="text-sm font-medium text-amber-800">Build Failed - Manual Option Available</h4>
            <p class="text-sm text-amber-700 mt-1">Build failed. Please use the manual build service:</p>
            <a href="https://client.workdo.io/npm-builder/" target="_blank" class="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Manual Build Service
            </a>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="text-sm font-medium text-slate-700 mb-2">Logs</h3>
        <pre id="log" class="bg-slate-900 text-slate-100 p-4 rounded-lg max-h-[360px] overflow-auto text-xs leading-relaxed"></pre>
      </div>
    </div>
  </div>

<script>
const base = './';
const startBtn = document.getElementById('startBtn');
const panel = document.getElementById('panel');
const logEl = document.getElementById('log');
const errBadge = document.getElementById('s-error');
const errMsg = document.getElementById('errMsg');
const progressBar = document.getElementById('progressBar');
const progressPct = document.getElementById('progressPct');
const progressLabel = document.getElementById('progressLabel');
const badges = {
  init: document.getElementById('s-init'),
  zip: document.getElementById('s-zip'),
  upload: document.getElementById('s-upload'),
  build: document.getElementById('s-build'),
  download: document.getElementById('s-download'),
  deploy: document.getElementById('s-deploy'),
  done: document.getElementById('s-done'),
};

function mark(step, cls='ok') {
  Object.values(badges).forEach(b => b.classList.remove('ok'));
  if (badges[step]) badges[step].classList.add(cls);
}

const stepPercent = {
  init: 5,
  zipping: 15,
  upload: 30,
  building: 75,
  download: 90,
  deploy: 98,
  done: 100,
};

function setProgress(stepKey, statusState) {
  const pct = Math.max(0, Math.min(100, stepPercent[stepKey] ?? 0));
  progressBar.style.width = pct + '%';
  progressPct.textContent = pct + '%';
  const labelMap = {
    init: 'Preparing…',
    zipping: 'Creating zip…',
    upload: 'Uploading to API…',
    building: 'Remote build in progress…',
    download: 'Downloading artifact…',
    deploy: 'Deploying…',
    done: 'Completed',
  };
  progressLabel.textContent = labelMap[stepKey] || (statusState === 'finished' ? 'Completed' : 'Waiting…');

  // Visual feedback on failure
  if (statusState === 'failed') {
    progressBar.classList.remove('from-brand-600', 'to-indigo-500');
    progressBar.classList.add('from-rose-500', 'to-rose-600');
  } else {
    progressBar.classList.add('from-brand-600', 'to-indigo-500');
    progressBar.classList.remove('from-rose-500', 'to-rose-600');
  }
}

let pollTimer = null;
function poll(job) {
  fetch(base + 'progress.php?job=' + encodeURIComponent(job))
    .then(r => r.json())
    .then(data => {
      if (data.status) {
        const st = data.status.status;
        const step = data.status.step || '';
        logEl.textContent = data.log || '';
        if (st === 'failed') {
          errBadge.style.display = '';
          errMsg.textContent = data.status.message || 'Build failed';
          document.getElementById('manualFallback').style.display = '';
          clearInterval(pollTimer);
          setProgress(step || 'init', 'failed');
          return;
        }
        if (st === 'finished') {
          mark('done');
          clearInterval(pollTimer);
          setProgress('done', 'finished');
          return;
        }
        if (step === 'zipping') mark('zip');
        else if (step === 'upload') mark('upload');
        else if (step === 'building') mark('build');
        else if (step === 'download') mark('download');
        else if (step === 'deploy') mark('deploy');
        else mark('init');

        setProgress(step || 'init', st);
      }
    })
    .catch(() => {});
}

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  panel.style.display = '';
  mark('init');
  setProgress('init', 'started');
  fetch(base + 'start_build.php', { method: 'POST' })
    .then(r => r.json())
    .then(d => {
      if (!d.job) throw new Error('No job id');
      pollTimer = setInterval(() => poll(d.job), 1500);
    })
    .catch(e => { 
      errBadge.style.display=''; 
      errMsg.textContent = e.message; 
      document.getElementById('manualFallback').style.display = '';
      startBtn.disabled = false; 
    });
});
</script>
</body>
</html>