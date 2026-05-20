# IBD Tracker — React Component Plan

## Core principle

The app should be built from small, reusable components.

Each component should have one clear job.

Good components make the app easier to:
- build
- test
- redesign
- expand
- debug

# Core UX Rule — Under 1 Minute Daily Logging

The daily form must be fast enough to complete every day.

Target completion time:
> Under 1 minute

The app should prioritise consistency over detail.

A user who logs 5 simple fields every day is more valuable than a user who logs 25 fields once and gives up.

---

# Daily Form Design Principles

## 1. Use sliders and toggles first

Prefer:
- sliders
- yes/no toggles
- quick buttons
- dropdowns

Avoid:
- long typing
- too many required fields
- detailed meal breakdowns
- clinical-style questionnaires

---

## 2. Keep required fields minimal

Required MVP fields:

| Field | Input Type |
|---|---|
| Overall gut score | Slider 1–10 |
| Pain | Slider 1–10 |
| Urgency | Slider 1–10 |
| Bowel movements | Number stepper |
| Blood present | Yes/No toggle |
| Stress | Slider 1–10 |
| Sleep quality | Slider 1–10 |
| Medication taken | Yes/No toggle |
| Notes | Optional text |

Everything else should be optional or hidden behind “Add more detail”.

---

## 3. Use an “advanced details” section

The default form should be short.

Extra fields can sit inside:

> Add more detail

Optional fields:
- meals
- trigger foods
- mucus
- bloating
- fatigue
- exercise
- alcohol
- supplements
- stool type
- sleep hours

---

## 4. Use smart defaults

Default values:
- date = today
- medication taken = yes
- blood present = no
- flare status = no
- notes = blank

This reduces effort.

---

## 5. Allow “copy yesterday”

Add a future button:

> Copy yesterday’s entry

Useful for:
- medication
- common meals
- regular symptoms
- repeat routines

---

## 6. Daily form component structure

```txt
DailyEntryForm
│
├── QuickCheckInSection
│   ├── OverallGutScoreSlider
│   ├── PainSlider
│   ├── UrgencySlider
│   ├── BowelMovementStepper
│   ├── BloodToggle
│   ├── StressSlider
│   ├── SleepQualitySlider
│   └── MedicationToggle
│
├── OptionalNotesSection
│   └── DailyNotesTextArea
│
├── AdvancedDetailsSection
│   ├── FoodSection
│   ├── StoolTypeSelector
│   ├── FatigueSlider
│   ├── BloatingSlider
│   ├── ExerciseToggle
│   └── AlcoholToggle
│
└── SaveEntryButton
---

# 1. Suggested Folder Structure

```txt
src/
│
├── components/
│   ├── layout/
│   ├── forms/
│   ├── dashboard/
│   ├── charts/
│   ├── cards/
│   └── ui/
│
├── pages/
│
├── data/
│
├── hooks/
│
├── services/
│
├── styles/
│
└── App.jsx
```

---

# 2. App Structure

```txt
App
│
├── AppLayout
│   ├── Header
│   ├── Sidebar / BottomNav
│   └── MainContent
│
├── Pages
│   ├── HomeDashboardPage
│   ├── DailyEntryPage
│   ├── TrendsPage
│   ├── CalendarPage
│   ├── InsightsPage
│   ├── ReportsPage
│   └── SettingsPage
│
└── Shared Components
    ├── MetricCard
    ├── ChartCard
    ├── SymptomSlider
    ├── ToggleField
    ├── DateSelector
    └── EmptyState
```

---

# 3. Layout Components

## `AppLayout.jsx`

Purpose:
- wraps the whole app
- controls page layout
- contains navigation and main content area

Contains:
- `Header`
- `Sidebar` or `BottomNav`
- `MainContent`

---

## `Header.jsx`

Purpose:
- show app name
- show current page title
- later show user profile/settings button

Example content:
- Guts 2 Brain / IBD Tracker
- Today’s date
- profile icon

---

## `BottomNav.jsx`

Purpose:
- mobile-first navigation

Links:
- Home
- Log
- Trends
- Calendar
- Settings

For desktop, this could later become a sidebar.

---

## `PageContainer.jsx`

Purpose:
- consistent spacing and page width
- prevents repeated layout styling

Used by every page.

---

# 4. Page Components

## `HomeDashboardPage.jsx`

Purpose:
- main overview page

Contains:
- `MetricCard`
- `SymptomTrendChart`
- `WeeklyInsightCard`
- `RecentEntriesList`

---

## `DailyEntryPage.jsx`

Purpose:
- daily symptom logging form

Contains:
- `DailyEntryForm`

---

## `TrendsPage.jsx`

Purpose:
- show symptom trends over time

Contains:
- `DateRangeFilter`
- `SymptomTrendChart`
- `PainTrendChart`
- `StressSleepChart`

---

## `CalendarPage.jsx`

Purpose:
- monthly symptom calendar

Contains:
- `SymptomCalendar`
- `CalendarLegend`

---

## `InsightsPage.jsx`

Purpose:
- future AI/correlation insights

Contains:
- `InsightCard`
- `CorrelationChart`
- `TriggerFoodList`

---

## `ReportsPage.jsx`

Purpose:
- future doctor exports

Contains:
- `ReportPreview`
- `DateRangeFilter`
- `ExportButton`

---

## `SettingsPage.jsx`

Purpose:
- user preferences and profile

Contains:
- `MedicationList`
- `TriggerFoodSettings`
- `NotificationSettings`

---

# 5. Form Components

## `DailyEntryForm.jsx`

Purpose:
- main form for logging the day

Contains:
- `DateSelector`
- `SymptomSection`
- `LifestyleSection`
- `FoodSection`
- `MedicationSection`
- `NotesSection`
- `SubmitButton`

---

## `SymptomSection.jsx`

Fields:
- pain score
- urgency score
- fatigue score
- bloating score
- bowel movements
- stool type
- blood present
- mucus present
- flare status

Components used:
- `SymptomSlider`
- `NumberInput`
- `ToggleField`
- `SelectField`

---

## `LifestyleSection.jsx`

Fields:
- stress score
- sleep hours
- sleep quality
- exercise done
- alcohol consumed
- water intake

---

## `FoodSection.jsx`

Fields:
- meals notes
- possible trigger foods
- appetite score

---

## `MedicationSection.jsx`

Fields:
- medication taken
- missed medication
- medication notes
- supplements

---

## `NotesSection.jsx`

Fields:
- daily notes
- unusual events

---

# 6. Reusable UI Components

## `MetricCard.jsx`

Purpose:
- display one key number

Examples:
- 7-day symptom average
- flare days this month
- medication adherence
- sleep average

Props:
```jsx
<MetricCard
  title="7-Day Average"
  value="5.4"
  subtitle="Slightly higher than last week"
/>
```

---

## `ChartCard.jsx`

Purpose:
- wraps charts in a consistent card layout

Props:
```jsx
<ChartCard title="Symptom Trend">
  <SymptomTrendChart />
</ChartCard>
```

---

## `SymptomSlider.jsx`

Purpose:
- reusable 1–10 score input

Used for:
- pain
- urgency
- stress
- fatigue
- bloating
- sleep quality

Props:
```jsx
<SymptomSlider
  label="Pain"
  value={painScore}
  onChange={setPainScore}
/>
```

---

## `ToggleField.jsx`

Purpose:
- yes/no input

Used for:
- blood present
- mucus present
- flare day
- medication taken
- exercise done
- alcohol consumed

---

## `DateSelector.jsx`

Purpose:
- select entry date

Default:
- today

---

## `TextAreaField.jsx`

Purpose:
- notes and meal logging

Used for:
- meals notes
- daily notes
- medication notes

---

## `SelectField.jsx`

Purpose:
- dropdown input

Used for:
- stool type
- exercise type
- date range filters

---

## `NumberInput.jsx`

Purpose:
- numeric values

Used for:
- bowel movements
- sleep hours
- water intake

---

## `EmptyState.jsx`

Purpose:
- show helpful message when no data exists

Example:
> No entries yet. Log your first day to see trends.

---

## `LoadingState.jsx`

Purpose:
- future loading indicator while data loads

---

## `ErrorState.jsx`

Purpose:
- show friendly error messages

---

# 7. Chart Components

## `SymptomTrendChart.jsx`

Purpose:
- show overall symptom score over time

Data:
- entry_date
- symptom_severity
- 7-day average

---

## `PainTrendChart.jsx`

Purpose:
- show pain score over time

Data:
- entry_date
- pain_score

---

## `UrgencyTrendChart.jsx`

Purpose:
- show urgency over time

Data:
- entry_date
- urgency_score

---

## `BowelMovementChart.jsx`

Purpose:
- show daily bowel movement count

Data:
- entry_date
- bowel_movements

---

## `StressSleepChart.jsx`

Purpose:
- compare stress, sleep and symptoms

Data:
- stress_score
- sleep_hours
- symptom_severity

---

## `CorrelationChart.jsx`

Purpose:
- future analytics chart

Examples:
- stress vs symptoms
- sleep vs symptoms
- alcohol vs symptoms

---

# 8. Dashboard Components

## `WeeklyInsightCard.jsx`

Purpose:
- show short weekly summary

Example:
> Symptoms were slightly worse this week. Stress was elevated on three days.

---

## `RecentEntriesList.jsx`

Purpose:
- show latest daily logs

Shows:
- date
- symptom score
- notes preview

---

## `FlareStatusCard.jsx`

Purpose:
- show flare-related summary

Shows:
- flare days this month
- current flare status
- longest flare streak

---

## `MedicationAdherenceCard.jsx`

Purpose:
- show medication consistency

Shows:
- percentage taken
- missed days

---

# 9. Data Components / Helpers

## `mockEntries.js`

Purpose:
- temporary test data before backend

Use this to build charts before Supabase exists.

Example fields:
- entry_date
- pain_score
- stress_score
- sleep_hours
- symptom_severity

---

## `calculateAverages.js`

Purpose:
- helper functions for dashboard metrics

Examples:
- 7-day average
- monthly average
- medication adherence
- flare day count

---

## `formatDates.js`

Purpose:
- date formatting helpers

---

# 10. MVP Component Build Order

Build in this order:

## Step 1 — Layout
1. `AppLayout`
2. `Header`
3. `BottomNav`
4. `PageContainer`

## Step 2 — Form
5. `DailyEntryPage`
6. `DailyEntryForm`
7. `SymptomSection`
8. `SymptomSlider`
9. `ToggleField`
10. `TextAreaField`

## Step 3 — Data
11. `mockEntries.js`
12. `calculateAverages.js`

## Step 4 — Dashboard
13. `HomeDashboardPage`
14. `MetricCard`
15. `SymptomTrendChart`
16. `WeeklyInsightCard`

## Step 5 — Trends
17. `TrendsPage`
18. `DateRangeFilter`
19. `PainTrendChart`
20. `BowelMovementChart`

---

# 11. MVP Components Only

For the first working version, build only:

```txt
App
├── AppLayout
├── Header
├── BottomNav
├── HomeDashboardPage
├── DailyEntryPage
├── TrendsPage
├── DailyEntryForm
├── SymptomSection
├── LifestyleSection
├── FoodSection
├── MedicationSection
├── NotesSection
├── MetricCard
├── SymptomSlider
├── ToggleField
├── TextAreaField
├── NumberInput
├── SymptomTrendChart
└── EmptyState
```

Do not build everything at once.

---

# 12. Example First Component Tree

```txt
HomeDashboardPage
│
├── PageContainer
│
├── MetricGrid
│   ├── MetricCard: Current Symptom Score
│   ├── MetricCard: 7-Day Average
│   ├── MetricCard: Flare Days
│   └── MetricCard: Medication Adherence
│
├── ChartCard
│   └── SymptomTrendChart
│
├── WeeklyInsightCard
│
└── RecentEntriesList
```

---

# 13. Component Philosophy

Each component should be:

- small
- named clearly
- reusable where possible
- focused on one job
- easy to understand six months later

Bad:
```jsx
<DashboardEverything />
```

Good:
```jsx
<MetricCard />
<SymptomTrendChart />
<WeeklyInsightCard />
```

---

# 14. Later Refactor Ideas

Later, split components into:

```txt
components/
├── layout/
├── forms/
├── charts/
├── dashboard/
├── ui/
└── reports/
```

Do not worry about perfect structure at the start.

---

# 15. Main Reminder

React becomes easier when you think in building blocks.

The app is not one big thing.

It is lots of small components connected together.