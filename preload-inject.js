// preload-inject.js
// Injected by Nativefier via --inject. Runs in the renderer with access to
// Node.js / Electron APIs. Works on both Windows and Linux (Raspberry Pi).

(function () {
  const { shell } = require('electron');
  const { exec }  = require('child_process');
  const path      = require('path');
  const fs        = require('fs');
  const os        = require('os');

  const IS_WINDOWS = os.platform() === 'win32';
  const IS_LINUX   = os.platform() === 'linux';

  // ── App maps per platform ──────────────────────────────────────────────────
  //
  // Windows: absolute paths or bare command names
  // Linux:   desktop app IDs (for xdg-open) or bare command names
  //
  const WINDOWS_APPS = {
    'explorer':   'C:\\Windows\\explorer.exe',
    'edge':       null,   // resolved below
    'notepad':    'C:\\Windows\\notepad.exe',
    'calculator': 'calc',
  };

  const LINUX_APPS = {
    'files':      'nautilus',          // GNOME Files (file manager)
    'chromium':   'chromium-browser',  // Chromium (default Pi browser)
    'mousepad':   'mousepad',          // Mousepad text editor (XFCE / Pi)
    'calculator': 'galculator',        // galculator (lightweight, works on Pi)
    'terminal':   'lxterminal',        // LXTerminal (default Pi terminal)
  };

  // Resolve Edge path on Windows
  if (IS_WINDOWS) {
    const edgePaths = [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    ];
    WINDOWS_APPS['edge'] = edgePaths.find(p => fs.existsSync(p)) || 'msedge';
  }

  const APP_MAP = IS_WINDOWS ? WINDOWS_APPS : LINUX_APPS;

  // ── Launch helper ──────────────────────────────────────────────────────────
  function runCommand(cmd) {
    if (IS_WINDOWS) {
      // Windows: use cmd.exe start so the process detaches cleanly
      exec(`start "" "${cmd}"`, { shell: 'cmd.exe' }, (err) => {
        if (err) console.error('[HomeMenu] exec error:', err);
      });
    } else {
      // Linux: launch detached so closing HomeMenu doesn't kill the child
      const child = exec(cmd, { detached: true, stdio: 'ignore' });
      child.unref();
    }
  }

  // ── Override window.launchApp ──────────────────────────────────────────────
  window.launchApp = function (name) {
    const target = APP_MAP[name];
    if (!target) {
      console.warn('[HomeMenu] Unknown app key:', name, '(platform:', os.platform() + ')');
      if (window.showToast) window.showToast('❌ Unknown app: ' + name, 'var(--danger)');
      return;
    }

    const label = name.charAt(0).toUpperCase() + name.slice(1);
    if (window.showToast) window.showToast('⚡ Launching ' + label);

    if (IS_WINDOWS && path.isAbsolute(target)) {
      // Prefer shell.openPath for real absolute Windows paths
      shell.openPath(target).then(err => {
        if (err) {
          console.error('[HomeMenu] shell.openPath error:', err);
          runCommand(target); // fallback
        }
      });
    } else {
      runCommand(target);
    }
  };

  // ── Expose platform info to the UI ────────────────────────────────────────
  window.HOME_MENU_PLATFORM = os.platform(); // 'win32' | 'linux'

  console.log('[HomeMenu] preload-inject.js ready — platform:', os.platform());
})();
