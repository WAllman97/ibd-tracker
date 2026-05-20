# React Notes — IBD Tracker

# Key Concepts

## Components

React apps are built from components.

Example:
- Header
- Dashboard
- DailyEntryForm
- TrendChart

Each component is a reusable UI section.

---

# JSX

React uses JSX.

JSX looks like HTML inside JavaScript.

Example:

```jsx
function Header() {
  return <h1>IBD Tracker</h1>
}
```

---

# Props

Props pass data between components.

Example:

```jsx
function Greeting(props) {
  return <h1>Hello {props.name}</h1>
}
```

Usage:

```jsx
<Greeting name="Will" />
```

---

# State

State stores changing data.

Example:

```jsx
const [painScore, setPainScore] = useState(5)
```

State changes update the UI automatically.

---

# Event Handling

Example:

```jsx
<button onClick={handleSubmit}>
  Save Entry
</button>
```

---

# Arrays & map()

Used heavily in React.

Example:

```jsx
const symptoms = ["Pain", "Stress", "Fatigue"]

symptoms.map(symptom => (
  <li>{symptom}</li>
))
```

---

# Conditional Rendering

Example:

```jsx
{flareStatus && <p>Flare Active</p>}
```

---

# useEffect

Used for:
- API calls
- loading data
- side effects

Example:

```jsx
useEffect(() => {
  fetchData()
}, [])
```

---

# Recommended Learning Order

## Phase 1
- JavaScript basics
- arrays
- objects
- functions

## Phase 2
- JSX
- components
- props
- state

## Phase 3
- forms
- API calls
- async/await

## Phase 4
- routing
- backend integration
- authentication

---

# Common React Structure

```txt
src/
│
├── components/
├── pages/
├── hooks/
├── services/
├── styles/
└── App.jsx
```

---

# Useful Packages Later

## Charts
- recharts
- chart.js

## Backend
- supabase

## Routing
- react-router-dom

---

# Key Principle

React is mainly:
- state
- components
- rendering UI from data

Once that clicks, everything becomes easier.

---

# Main Goal

Build small working components.

Do not try to understand everything at once.