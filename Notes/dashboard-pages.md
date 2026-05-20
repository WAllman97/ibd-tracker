# IBD Tracker — Dashboard Pages Plan

## Core principle

The dashboard should turn daily symptom logs into clear, useful insight.

The user should be able to answer:

> “Am I getting better, worse, or staying the same?”

and later:

> “What might be driving my symptoms?”

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

# 1. Home Dashboard

## Purpose

Give the user a fast overview of their current gut health.

## Key sections

### Top Summary Cards

Cards should show:

| Metric | Example |
|---|---|
| Current Symptom Score | 6.2 / 10 |
| 7-Day Average | 5.4 / 10 |
| Flare Days This Month | 4 |
| Medication Adherence | 92% |
| Sleep Average | 6.8 hrs |
| Stress Average | 7.1 / 10 |

## Main chart

### Symptom Trend Chart

Shows:
- daily symptom score
- 7-day moving average
- flare markers

## Useful insight box

Example:

> Symptoms have been slightly worse this week, with higher stress and lower sleep than average.

---

# 2. Daily Entry Page

## Purpose

Allow fast daily logging.

## Sections

### Date selector

Default:
- today’s date

### Symptoms

Inputs:
- pain score
- urgency score
- fatigue score
- bloating score
- bowel movements
- stool type
- blood present
- mucus present
- flare status

### Lifestyle

Inputs:
- sleep hours
- sleep quality
- stress score
- exercise done
- alcohol consumed
- water intake

### Food

Inputs:
- meals notes
- possible trigger foods
- appetite score

### Medication

Inputs:
- medication taken
- medication notes
- supplements

### Notes

Inputs:
- free-text daily notes
- unusual events

## UX rule

The entry should take under 2 minutes.

---

# 3. Trends Page

## Purpose

Show how symptoms are changing over time.

## Filters

Possible filters:
- last 7 days
- last 30 days
- last 90 days
- custom date range

## Charts

### Overall Symptom Trend

Line chart showing symptom severity over time.

### Pain Trend

Line chart showing pain score over time.

### Urgency Trend

Line chart showing urgency score over time.

### Bowel Movements Trend

Bar chart showing daily bowel movement count.

### Fatigue Trend

Line chart showing fatigue score over time.

## Key question

> Are symptoms improving or worsening?

---

# 4. Correlations Page

## Purpose

Help identify possible symptom drivers.

## Initial correlations

Start with:

| Relationship | Chart Type |
|---|---|
| Stress vs Symptoms | Scatter chart |
| Sleep vs Symptoms | Scatter chart |
| Food Tags vs Symptoms | Bar chart |
| Exercise vs Symptoms | Comparison chart |
| Alcohol vs Symptoms | Comparison chart |

## Insight examples

- “Higher stress days appear linked to higher urgency.”
- “Symptoms are worse after nights below 6 hours of sleep.”
- “Coffee appears frequently before worse symptom days.”

## Warning

These should be shown as possible patterns, not medical conclusions.

---

# 5. Calendar Page

## Purpose

Show symptoms visually across time.

## Display

Monthly calendar view.

Each day coloured by:
- symptom severity
- flare status
- missed medication
- blood present

## Useful for

- spotting flare periods
- seeing good/bad streaks
- reviewing recent months
- preparing for doctor appointments

---

# 6. Weekly Summary Page

## Purpose

Give the user a simple weekly review.

## Summary metrics

| Metric | Example |
|---|---|
| Average Symptom Score | 5.8 |
| Worst Day | Wednesday |
| Best Day | Saturday |
| Flare Days | 2 |
| Average Sleep | 6.4 hrs |
| Average Stress | 7.2 |
| Medication Adherence | 86% |

## Weekly insight text

Example:

> This week symptoms were moderately elevated. Stress was above average and sleep was below target on three nights.

## Future AI version

AI could generate:
- weekly summary
- possible triggers
- things to discuss with doctor
- lifestyle observations

---

# 7. Doctor Report Page

## Purpose

Prepare a clear export for appointments.

## Sections

### Date range selector

Options:
- last 30 days
- last 90 days
- custom range

### Report contents

Include:
- symptom trend
- flare days
- bowel movement frequency
- blood/mucus days
- medication adherence
- food/lifestyle notes
- key user notes

## Export options

Future:
- PDF export
- email export
- printable version

---

# 8. Settings Page

## Purpose

Allow user personalisation.

## Settings

Possible settings:
- profile details
- condition type
- medication list
- common trigger foods
- notification preferences
- privacy settings
- data export
- delete account

---

# 9. MVP Dashboard Pages

Do not build all pages at once.

## V1 pages

For the first React version, build only:

1. Home Dashboard
2. Daily Entry Page
3. Trends Page

## V2 pages

Then add:

4. Calendar Page
5. Weekly Summary Page

## V3 pages

Then add:

6. Correlations Page
7. Doctor Report Page
8. Settings Page

---

# 10. Suggested Navigation

```txt
Home
Log Entry
Trends
Calendar
Insights
Reports
Settings
```

For MVP:

```txt
Home
Log Entry
Trends
```

---

# 11. Dashboard Design Notes

## Visual style

Aim for:
- clean
- calming
- mobile-first
- light medical/health feel
- not too clinical

## Layout

Use:
- cards
- charts
- simple colour coding
- short insight text
- clear headings

## Avoid

Avoid:
- overwhelming tables
- too many metrics at once
- complex clinical language
- fake certainty in insights

---

# 12. Key Dashboard Questions

Every page should help answer one of these:

## Home Dashboard
> How am I doing now?

## Daily Entry Page
> What happened today?

## Trends Page
> Am I improving or worsening?

## Correlations Page
> What might be affecting me?

## Calendar Page
> When were my good and bad days?

## Weekly Summary Page
> What happened this week?

## Doctor Report Page
> What should I show my doctor?

---

# 13. Build Priority

Build in this order:

1. Daily Entry Page
2. Home Dashboard
3. Trends Page
4. Calendar Page
5. Weekly Summary Page
6. Correlations Page
7. Doctor Report Page
8. Settings Page

Reason:

The app needs data before the dashboards become useful.