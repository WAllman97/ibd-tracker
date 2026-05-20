# IBD Tracker: Static HTML → React + Vite Conversion Plan

## What We're Building
Converting your working localStorage-based tracker from plain HTML/CSS/JS into a modern React app using Vite (fast build tool).

**Why React?**
- Reusable components (DRY principle)
- State management with hooks (easier than vanilla JS)
- Faster development experience
- Easier to scale later (add routing, backend integration)
- Industry standard for learning web dev

---

## Project Structure (After Conversion)

```
ibd-tracker-react/
├── src/
│   ├── components/
│   │   ├── SymptomForm.jsx          # Form for entering symptoms
│   │   ├── EntryHistory.jsx         # Table showing past entries
│   │   ├── DashboardSummary.jsx     # Summary cards (avg pain, flares, etc)
│   │   ├── WarningAlert.jsx         # Flare risk warning display
│   │   └── ExportButton.jsx         # CSV export
│   ├── hooks/
│   │   └── useEntries.js            # Custom hook for localStorage logic
│   ├── utils/
│   │   └── flareCalculations.js     # Flare score and trend logic
│   ├── App.jsx                       # Main app component (ties everything)
│   ├── App.css                       # Styling
│   ├── main.jsx                      # Entry point
│   └── index.html                    # HTML template
├── package.json                      # Dependencies
├── vite.config.js                    # Vite configuration
└── .gitignore
```

---

## Learning Concepts You'll Master

1. **Components**: Reusable, self-contained UI pieces
2. **JSX**: HTML-like syntax inside JavaScript
3. **Hooks**:
   - `useState`: Store and update component state (like form data)
   - `useEffect`: Run code after component renders (like page load)
   - Custom hooks: Organize logic in reusable functions
4. **Props**: Pass data from parent to child components
5. **Key prop**: Help React identify which items have changed in lists
6. **Map function**: Render lists in React

---

## Implementation Phases

### Phase 1: Setup (30 mins)
- Install Node.js
- Create Vite project
- Install dependencies
- Verify dev server runs

### Phase 2: Component Structure (1-2 hours)
- Create `useEntries` custom hook (replaces localStorage JS)
- Create `flareCalculations` utility (reuses your logic)
- Build SymptomForm component
- Build EntryHistory component
- Build DashboardSummary component
- Build WarningAlert component

### Phase 3: Styling (30 mins)
- Convert CSS to modern responsive design
- Test mobile responsiveness

### Phase 4: Testing (30 mins)
- Add entries
- View history
- Delete entries
- Export CSV
- Verify localStorage persistence
- Test mobile view

### Phase 5: Deployment (optional)
- Deploy to Vercel/Netlify for free
- Set up GitHub Pages with build process

---

## Files You'll Create

| File | Lines | Purpose |
|------|-------|---------|
| `src/main.jsx` | 6 | React entry point |
| `src/App.jsx` | 40 | Main component structure |
| `src/App.css` | 300+ | All styling |
| `src/components/SymptomForm.jsx` | 80 | Form input |
| `src/components/EntryHistory.jsx` | 100 | Table display |
| `src/components/DashboardSummary.jsx` | 60 | Summary cards |
| `src/components/WarningAlert.jsx` | 50 | Warning display |
| `src/components/ExportButton.jsx` | 40 | CSV export |
| `src/hooks/useEntries.js` | 50 | Custom hook |
| `src/utils/flareCalculations.js` | 120 | Flare logic |
| `vite.config.js` | 10 | Build config |
| `package.json` | 25 | Dependencies |

**Total: ~900 lines of code**

---

## Key React Concepts Explained (Simple)

### Component = Function
```javascript
// This is a React component
function HelloWorld() {
  return <h1>Hello!</h1>;  // JSX: looks like HTML
}
```

### State = Component Memory
```javascript
function Counter() {
  const [count, setCount] = useState(0);  // Remember count value
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

### Props = Component Arguments
```javascript
function UserCard({ name, age }) {
  return <div>{name} is {age} years old</div>;
}

<UserCard name="Alice" age={30} />  // Passing props
```

### UseEffect = Run After Render
```javascript
useEffect(() => {
  // This runs after component appears on screen
  const entries = localStorage.getItem("ibd_entries");
  console.log(entries);
}, []);  // Empty [] = run once on mount
```

### Map = Render Lists
```javascript
function EntryList({ entries }) {
  return (
    <ul>
      {entries.map(entry => (
        <li key={entry.id}>{entry.date}: Pain {entry.pain}</li>
      ))}
    </ul>
  );
}
```

---

## Timeline & Difficulty

- **Setup**: Easy, just terminal commands
- **Components**: Moderate, mostly copy/adapt existing JS logic
- **Styling**: Easy, same CSS as before
- **Integration**: Moderate, connecting components together
- **Testing**: Easy, same test cases as vanilla version

**Total time**: 3-4 hours first time, 30 mins if you redo it

---

## Your Current Code → React Mapping

| Your Current | Becomes |
|---|---|
| `getEntries()` | `useEntries()` hook |
| `saveEntry()` | `addEntry()` from hook |
| `deleteEntry()` | `removeEntry()` from hook |
| `calculateFlareRiskScore()` | `utils/flareCalculations.js` |
| Form HTML + form listeners | `<SymptomForm />` component |
| History table HTML | `<EntryHistory />` component |
| Warning display HTML | `<WarningAlert />` component |

---

## Ready?

This plan covers:
- ✅ Full setup instructions
- ✅ Complete code for each file
- ✅ Learning explanations
- ✅ Testing guide
- ✅ Deployment options (optional)

Proceeding will give you:
1. **src/** folder structure with all components
2. **Complete code** for each file with comments
3. **Step-by-step terminal commands**
4. **Testing checklist**
5. **Common errors and fixes**
