# HOW TO SET UP YOUR REACT PROJECT - Complete Guide

## Files are Ready in Your Session Folder!

All 12 files have been created and saved in:
```
C:/Users/wallman_cau/.copilot/session-state/4a061d9b-1985-48e6-acff-be1a9df1a967/
```

---

## Folder Structure to Create

Create this exact folder structure in:
```
C:\Users\wallman_cau\Caius Capital LLP\Team - Team\Will A\Python\Guts 2 Brain\
```

```
ibd-tracker-react/
├── src/
│   ├── components/
│   │   ├── SymptomForm.jsx
│   │   ├── EntryHistory.jsx
│   │   ├── DashboardSummary.jsx
│   │   ├── WarningAlert.jsx
│   │   └── ExportButton.jsx
│   ├── hooks/
│   │   └── useEntries.js
│   ├── utils/
│   │   └── flareCalculations.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── index.html (already exists from Vite creation)
```

---

## Files Available in Session Folder

| Session File | Destination | Type |
|---|---|---|
| `package.json` | `ibd-tracker-react/package.json` | Replace default |
| `vite.config.js` | `ibd-tracker-react/vite.config.js` | Replace default |
| `src_main.jsx` | `ibd-tracker-react/src/main.jsx` | Replace default |
| `src_App.jsx` | `ibd-tracker-react/src/App.jsx` | Replace default |
| `src_App.css` | `ibd-tracker-react/src/App.css` | Replace default |
| `src_hooks_useEntries.js` | `ibd-tracker-react/src/hooks/useEntries.js` | NEW |
| `src_utils_flareCalculations.js` | `ibd-tracker-react/src/utils/flareCalculations.js` | NEW |
| `src_components_SymptomForm.jsx` | `ibd-tracker-react/src/components/SymptomForm.jsx` | NEW |
| `src_components_EntryHistory.jsx` | `ibd-tracker-react/src/components/EntryHistory.jsx` | NEW |
| `src_components_DashboardSummary.jsx` | `ibd-tracker-react/src/components/DashboardSummary.jsx` | NEW |
| `src_components_WarningAlert.jsx` | `ibd-tracker-react/src/components/WarningAlert.jsx` | NEW |
| `src_components_ExportButton.jsx` | `ibd-tracker-react/src/components/ExportButton.jsx` | NEW |

---

## Step-by-Step Setup (After Admin Approves)

### 1. Create the main project folder
```bash
cd "c:\Users\wallman_cau\Caius Capital LLP\Team - Team\Will A\Python\Guts 2 Brain"
npm create vite@latest ibd-tracker-react -- --template react
cd ibd-tracker-react
```

### 2. Create subfolder structure
```bash
mkdir src\components
mkdir src\hooks
mkdir src\utils
```

Windows PowerShell equivalent:
```powershell
New-Item -ItemType Directory -Path "src\components" -Force
New-Item -ItemType Directory -Path "src\hooks" -Force
New-Item -ItemType Directory -Path "src\utils" -Force
```

### 3. Copy files from session folder

Open File Explorer and navigate to:
```
C:\Users\wallman_cau\.copilot\session-state\4a061d9b-1985-48e6-acff-be1a9df1a967\
```

**Copy these files:**

| From Session Folder | To Project Folder | Action |
|---|---|---|
| `package.json` | `ibd-tracker-react\package.json` | Replace |
| `vite.config.js` | `ibd-tracker-react\vite.config.js` | Replace |
| `src_main.jsx` | `ibd-tracker-react\src\main.jsx` | Replace |
| `src_App.jsx` | `ibd-tracker-react\src\App.jsx` | Replace |
| `src_App.css` | `ibd-tracker-react\src\App.css` | Replace |
| `src_hooks_useEntries.js` | `ibd-tracker-react\src\hooks\useEntries.js` | New |
| `src_utils_flareCalculations.js` | `ibd-tracker-react\src\utils\flareCalculations.js` | New |
| `src_components_SymptomForm.jsx` | `ibd-tracker-react\src\components\SymptomForm.jsx` | New |
| `src_components_EntryHistory.jsx` | `ibd-tracker-react\src\components\EntryHistory.jsx` | New |
| `src_components_DashboardSummary.jsx` | `ibd-tracker-react\src\components\DashboardSummary.jsx` | New |
| `src_components_WarningAlert.jsx` | `ibd-tracker-react\src\components\WarningAlert.jsx` | New |
| `src_components_ExportButton.jsx` | `ibd-tracker-react\src\components\ExportButton.jsx` | New |

**When copying, rename the files:**
- `src_main.jsx` → `main.jsx`
- `src_App.jsx` → `App.jsx`
- `src_App.css` → `App.css`
- `src_hooks_useEntries.js` → `useEntries.js`
- `src_utils_flareCalculations.js` → `flareCalculations.js`
- `src_components_SymptomForm.jsx` → `SymptomForm.jsx`
- (etc. - remove the `src_` and `src_components_` prefixes)

### 4. Install dependencies
```bash
npm install
```

### 5. Start dev server
```bash
npm run dev
```

### 6. Open browser
```
http://localhost:5173/
```

---

## Quick Copy-Paste Method (Windows PowerShell)

After you create the folders, run this in PowerShell to copy all files:

```powershell
$source = "C:\Users\wallman_cau\.copilot\session-state\4a061d9b-1985-48e6-acff-be1a9df1a967\"
$dest = "C:\Users\wallman_cau\Caius Capital LLP\Team - Team\Will A\Python\Guts 2 Brain\ibd-tracker-react\"

# Copy config files
Copy-Item "$source\package.json" "$dest\package.json" -Force
Copy-Item "$source\vite.config.js" "$dest\vite.config.js" -Force

# Copy src files and rename
Copy-Item "$source\src_main.jsx" "$dest\src\main.jsx" -Force
Copy-Item "$source\src_App.jsx" "$dest\src\App.jsx" -Force
Copy-Item "$source\src_App.css" "$dest\src\App.css" -Force

# Copy hooks
Copy-Item "$source\src_hooks_useEntries.js" "$dest\src\hooks\useEntries.js" -Force

# Copy utils
Copy-Item "$source\src_utils_flareCalculations.js" "$dest\src\utils\flareCalculations.js" -Force

# Copy components
Copy-Item "$source\src_components_SymptomForm.jsx" "$dest\src\components\SymptomForm.jsx" -Force
Copy-Item "$source\src_components_EntryHistory.jsx" "$dest\src\components\EntryHistory.jsx" -Force
Copy-Item "$source\src_components_DashboardSummary.jsx" "$dest\src\components\DashboardSummary.jsx" -Force
Copy-Item "$source\src_components_WarningAlert.jsx" "$dest\src\components\WarningAlert.jsx" -Force
Copy-Item "$source\src_components_ExportButton.jsx" "$dest\src\components\ExportButton.jsx" -Force

Write-Host "All files copied successfully!"
```

---

## Verify Everything is Correct

After copying, your folder should look like:

```
ibd-tracker-react/
├── node_modules/ (created by npm install)
├── src/
│   ├── components/
│   │   ├── SymptomForm.jsx ✓
│   │   ├── EntryHistory.jsx ✓
│   │   ├── DashboardSummary.jsx ✓
│   │   ├── WarningAlert.jsx ✓
│   │   └── ExportButton.jsx ✓
│   ├── hooks/
│   │   └── useEntries.js ✓
│   ├── utils/
│   │   └── flareCalculations.js ✓
│   ├── App.jsx ✓
│   ├── App.css ✓
│   └── main.jsx ✓
├── index.html (default from Vite)
├── package.json ✓
├── vite.config.js ✓
└── .gitignore (default)
```

---

## Ready?

1. ✅ All 12 files are prepared in your session folder
2. ✅ Just copy them to the proper structure
3. ✅ Run `npm install` and `npm run dev`
4. ✅ You're done!

**Next step: When admin approves npm install, follow the copy instructions above.**
