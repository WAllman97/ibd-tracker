# IBD Tracker React App - Setup Instructions

## Overview
You now have all the code files ready to create a React version of your IBD tracker using Vite. Once you get admin approval to install Node.js packages, follow these exact steps.

---

## File Structure

After setup, your project should look like this:

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
│   ├── main.jsx
│   └── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

## Step-by-Step Setup (After Admin Approval)

### Step 1: Create Vite Project
```bash
cd "c:\Users\wallman_cau\Caius Capital LLP\Team - Team\Will A\Python"
npm create vite@latest ibd-tracker-react -- --template react
```

### Step 2: Navigate to Project
```bash
cd ibd-tracker-react
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Create Folder Structure
```bash
mkdir src/components
mkdir src/hooks
mkdir src/utils
```

### Step 5: Copy Files

**Copy these files to their respective locations:**

- `package.json` → `ibd-tracker-react/package.json` (replace the default one)
- `vite.config.js` → `ibd-tracker-react/vite.config.js` (replace the default one)
- `src_main.jsx` → `ibd-tracker-react/src/main.jsx` (replace the default one)
- `src_App.jsx` → `ibd-tracker-react/src/App.jsx` (replace the default one)
- `src_App.css` → `ibd-tracker-react/src/App.css` (replace the default one)
- `src_hooks_useEntries.js` → `ibd-tracker-react/src/hooks/useEntries.js` (new file)
- `src_utils_flareCalculations.js` → `ibd-tracker-react/src/utils/flareCalculations.js` (new file)
- `src_components_SymptomForm.jsx` → `ibd-tracker-react/src/components/SymptomForm.jsx` (new file)
- `src_components_EntryHistory.jsx` → `ibd-tracker-react/src/components/EntryHistory.jsx` (new file)
- `src_components_DashboardSummary.jsx` → `ibd-tracker-react/src/components/DashboardSummary.jsx` (new file)
- `src_components_WarningAlert.jsx` → `ibd-tracker-react/src/components/WarningAlert.jsx` (new file)
- `src_components_ExportButton.jsx` → `ibd-tracker-react/src/components/ExportButton.jsx` (new file)

### Step 6: Start Development Server
```bash
npm run dev
```

You should see:
```
  VITE v4.4.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 7: Open in Browser
Navigate to `http://localhost:5173/`

---

## Testing the App

### Test 1: Add an Entry
1. Fill out the form (date should auto-populate with today)
2. Enter values for pain, bloating, etc.
3. Click "Save Entry"
4. ✅ Expected: Green success message, form clears, entry appears in table

### Test 2: View Dashboard
1. After adding 3+ entries, check the dashboard summary cards
2. ✅ Expected: Cards show average pain, bloating, latest flare status, trend

### Test 3: Flare Warning
1. Add entry with Pain=8, Bloating=8, Flare=Moderate
2. ✅ Expected: Yellow warning box appears with risk score

### Test 4: Filter History
1. Add entries on different dates (edit date field)
2. Use the "Show last" dropdown to filter
3. ✅ Expected: Table updates to show filtered entries

### Test 5: Delete Entry
1. Click delete button on any row
2. Confirm deletion
3. ✅ Expected: Entry removed from table

### Test 6: Export CSV
1. Click "Download as CSV" button
2. ✅ Expected: File downloads with all entries and risk scores

### Test 7: Mobile Responsive
1. Press F12 in browser (Developer Tools)
2. Click toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone SE or similar small screen
4. ✅ Expected: Layout adapts, all features still work

### Test 8: Persistence
1. Add an entry
2. Refresh page (F5)
3. ✅ Expected: Entry still there (saved in localStorage)

---

## Key React Concepts in This App

### 1. **Components**
Each .jsx file is a component (SymptomForm, EntryHistory, etc.)
Components are like LEGO blocks - reusable and composable

### 2. **Hooks (useState, useEffect)**
- `useState`: Remember data (like form inputs)
- `useEffect`: Run code after component renders (like page load)

### 3. **Props**
Data passed from parent to child components (like function arguments)

### 4. **Custom Hooks**
`useEntries` is a custom hook - it contains localStorage logic in one place

### 5. **Map Function**
```javascript
{entries.map(entry => (
  <tr key={entry.id}>{entry.date}</tr>
))}
```
Renders a table row for each entry

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "npm: command not found" | Node.js not installed - request admin approval |
| Port 5173 already in use | Run `npm run dev -- --port 5174` |
| CSS not loading | Check all CSS is in `src/App.css` |
| State not updating | Make sure you're using `setState` not direct assignment |
| Entries disappear on refresh | Check localStorage key: should be `ibd_entries` |

---

## What Happens When You Save Files

When you edit a .jsx file and save it:
1. Vite detects the change
2. Browser automatically refreshes (hot reload)
3. Your changes appear instantly
4. Form state is preserved!

This is React's superpower.

---

## Build for Production

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized `dist/` folder ready for hosting on:
- GitHub Pages
- Vercel (free)
- Netlify (free)
- Any static host

---

## File Mapping (Old → New)

Your old vanilla JS functions now live in React components:

| Old Function | New Location |
|---|---|
| `getEntries()` | `useEntries()` hook in `src/hooks/useEntries.js` |
| `saveEntry()` | `addEntry()` in hook |
| `deleteEntry()` | `removeEntry()` in hook |
| `calculateFlareRiskScore()` | `src/utils/flareCalculations.js` |
| HTML form | `src/components/SymptomForm.jsx` |
| History table | `src/components/EntryHistory.jsx` |
| Warning display | `src/components/WarningAlert.jsx` |
| CSS | `src/App.css` (organized by section) |

---

## Next Steps (After Testing)

1. **Deploy to GitHub Pages** - Make GitHub repo, deploy for free
2. **Add Backend** - Replace localStorage with database (PostgreSQL + Node)
3. **User Authentication** - Add login/signup
4. **Advanced Analytics** - Food trigger analysis, PDF reports
5. **Mobile App** - React Native version

---

## Questions While Learning?

Read these resources:
- React Docs: https://react.dev/learn
- Hooks Guide: https://react.dev/reference/react/hooks
- Vite Docs: https://vitejs.dev/guide/

Good luck! 🚀
