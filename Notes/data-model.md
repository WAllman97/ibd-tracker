# IBD Tracker — Data Model & Core Fields

## Core principle

The data structure should be:

- simple enough for fast daily input
- flexible enough for future analytics
- structured enough for charts, correlations and AI insights later

Each day should represent one main “Daily Entry”.

---

# 1. Daily Entry Table

## Table Name
`daily_entries`

## Primary Key
`entry_id`

---

# Core Fields

| Field Name | Type | Example | Notes |
|---|---|---|---|
| entry_id | UUID / ID | 1001 | Unique entry ID |
| user_id | UUID | user_01 | Future multi-user support |
| entry_date | Date | 2026-05-20 | Main tracking date |
| created_at | Timestamp | 2026-05-20 20:30 | Auto generated |
| updated_at | Timestamp | 2026-05-20 20:40 | Auto generated |

---

# 2. Symptom Tracking Fields

| Field Name | Type | Example | Notes |
|---|---|---|---|
| pain_score | Integer (1–10) | 6 | Abdominal pain |
| urgency_score | Integer (1–10) | 7 | Toilet urgency |
| fatigue_score | Integer (1–10) | 5 | Energy/fatigue |
| bloating_score | Integer (1–10) | 4 | Bloating severity |
| nausea_score | Integer (1–10) | 2 | Optional |
| symptom_severity | Integer (1–10) | 6 | Overall day score |
| flare_status | Boolean | true | Flare day yes/no |
| blood_present | Boolean | false | Blood present |
| mucus_present | Boolean | true | Mucus present |
| accidents | Integer | 0 | Loss of control |
| bowel_movements | Integer | 5 | Daily count |
| stool_type | Integer (1–7) | 6 | Bristol stool chart |

---

# 3. Lifestyle Tracking Fields

| Field Name | Type | Example | Notes |
|---|---|---|---|
| stress_score | Integer (1–10) | 8 | Stress level |
| sleep_hours | Decimal | 6.5 | Hours slept |
| sleep_quality | Integer (1–10) | 5 | Sleep quality |
| exercise_done | Boolean | true | Did user exercise |
| exercise_type | Text | Run | Gym/run/walk/etc |
| alcohol_consumed | Boolean | false | Alcohol yes/no |
| smoking | Boolean | false | Smoking/vaping |
| water_intake_litres | Decimal | 2.4 | Hydration |

---

# 4. Food Tracking Fields

## Simplified MVP approach

Initially:
- free text
- optional tags

Later:
- structured meal system

| Field Name | Type | Example | Notes |
|---|---|---|---|
| meals_notes | Long Text | Pasta, coffee, spicy chicken | Daily food log |
| trigger_foods | Text Array | Coffee, dairy | User-selected triggers |
| appetite_score | Integer (1–10) | 4 | Appetite level |

---

# 5. Medication Tracking

| Field Name | Type | Example | Notes |
|---|---|---|---|
| medication_taken | Boolean | true | Main adherence |
| medications | Long Text | Mesalazine 2g | Current meds |
| supplements | Long Text | Vitamin D | Optional |
| missed_medication | Boolean | false | Missed dose |

---

# 6. Mental Health / Wellness

| Field Name | Type | Example | Notes |
|---|---|---|---|
| mood_score | Integer (1–10) | 6 | Mental wellbeing |
| anxiety_score | Integer (1–10) | 7 | Anxiety level |
| confidence_score | Integer (1–10) | 5 | Confidence/social comfort |

---

# 7. Notes & Context

| Field Name | Type | Example | Notes |
|---|---|---|---|
| daily_notes | Long Text | Felt worse after lunch | Freeform notes |
| unusual_events | Text | Travel/work stress | Context |
| period_tracking | Boolean | false | Future female support |

---

# 8. Derived / Calculated Fields

These may not be manually entered.

| Field Name | Type | Purpose |
|---|---|---|
| symptom_average_7d | Decimal | Rolling symptom average |
| flare_risk_score | Decimal | Future AI scoring |
| symptom_trend | Text | Improving/stable/worsening |
| stress_correlation | Decimal | Future analytics |
| trigger_confidence | Decimal | Food correlation |

---

# 9. Future Tables

## Users
`users`

## Medications
`medications`

## Food database
`foods`

## Weekly summaries
`weekly_summaries`

## AI insights
`insights`

## Doctor exports
`reports`

---

# 10. MVP Fields Only

For V1 keep it lean.

## Recommended V1 fields

| Category | Fields |
|---|---|
| Date | entry_date |
| Symptoms | pain_score, urgency_score, bowel_movements, blood_present |
| Lifestyle | stress_score, sleep_hours |
| Food | meals_notes |
| Medication | medication_taken |
| Notes | daily_notes |

---

# 11. Dashboard Metrics Later

This structure allows future dashboards such as:

## Trends
- symptom trend over time
- stress vs pain
- sleep vs flare severity

## Correlations
- possible food triggers
- stress correlation
- exercise impact

## Medical summaries
- weekly flare summaries
- doctor exports
- symptom calendars

---

# 12. Technical Notes

Recommended types later:

- PostgreSQL (Supabase)
- UUID primary keys
- timestamps
- nullable optional fields
- indexed date field
- separate user authentication table

---

# 13. Product philosophy

The app should prioritise:
- consistency over complexity
- fast logging over excessive detail
- trend visibility over raw data overload

The user should feel:
> “I can actually keep using this every day.”