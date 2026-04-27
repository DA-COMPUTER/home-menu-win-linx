# HomeMenu

A lightweight Windows home-menu application built with HTML/CSS/JS, packaged into a `.exe` using [Nativefier](https://github.com/nativefier/nativefier) via GitHub Actions.

---

## 📁 Repository Structure

```
home-menu/
├── home-menu.html                       ← Main UI (single-file, all CSS+JS inlined)
│
├── launchers/
│   ├── launch-file-explorer.bat         ← Opens Windows File Explorer
│   ├── launch-microsoft-edge.bat        ← Opens Microsoft Edge (with fallback paths)
│   ├── launch-notepad.bat               ← Opens Notepad (placeholder example)
│   └── launch-calculator.bat            ← Opens Calculator (placeholder example)
│
└── .github/
    └── workflows/
        └── build.yml                    ← GitHub Actions: builds & releases the EXE
```

---

## 🚀 Features

| Feature | Details |
|---|---|
| **App Launchers** | Buttons trigger `.bat` files via forced browser download |
| **Search Bar** | Google or Bing, selectable via dropdown, Enter-to-search |
| **Live Clock** | Displays current local time in the header |
| **Dark theme** | Custom grid-overlay background, glowing accents |

---

## ⚙️ How the `.bat` launcher trick works

When the app is packaged with Nativefier (Electron wrapper), a button click calls:

```js
function launchApp(name) {
  const link = document.createElement('a');
  link.href = 'launchers/' + name;
  link.download = name;          // forces Electron to download the file
  document.body.appendChild(link);
  link.click();
  link.remove();
}
```

Electron treats the download the same as a browser would. When Windows receives a `.bat` file download, you can open it directly from the Downloads bar → Windows executes it.

> **Security note:** Windows may prompt "Do you want to run this file?" — that's expected and correct. Never disable this prompt.

---

## 🛠️ Adding more app launchers

1. Create `launchers/launch-myapp.bat`:

```bat
@echo off
start "" "C:\Path\To\MyApp.exe"
```

2. Add the button to `home-menu.html` inside `<div class="apps-grid">`:

```html
<button class="app-btn" onclick="launchApp('launch-myapp.bat')">
  <span class="icon">🖥️</span>
  <span class="app-name">My App</span>
</button>
```

3. Add the `--inject` flag to `build.yml`:

```yaml
--inject launchers/launch-myapp.bat ^
```

---

## 📦 Building the EXE

### Via GitHub Actions (recommended)

1. Push this repo to GitHub.
2. Go to **Releases → Create a new release**.
3. Tag it (e.g. `v1.0.0`) and publish.
4. The Action will build and attach `HomeMenu-Windows-x64.zip` to the release.

### Locally

```bash
npm install -g nativefier

nativefier \
  --name "HomeMenu" \
  --platform windows \
  --arch x64 \
  --out dist \
  --single-instance \
  --disable-dev-tools \
  --inject launchers/launch-file-explorer.bat \
  --inject launchers/launch-microsoft-edge.bat \
  "home-menu.html"
```

---

## 📝 Notes

- Nativefier wraps Electron ~28. The injected `.bat` files are bundled into the app's `resources/app/` directory.
- The `--inject` flag copies each file relative to the HTML root, preserving the `launchers/` path.
- Edge fallback paths: the `launch-microsoft-edge.bat` tries `Program Files (x86)`, then `Program Files`, then `msedge` via PATH.
- The `.zip` artifact includes the full Electron app folder. Extract it and run `HomeMenu.exe`.
