import { calculateFlareRiskScore } from './flareCalculations.js'
import { detectTrend } from './detectTrend.js'

function average(entries, field) {
  if (!entries.length) return 0

  const total = entries.reduce((sum, entry) => {
    return sum + Number(entry[field] || 0)
  }, 0)

  return Number((total / entries.length).toFixed(1))
}

function getMostCommonTriggers(entries) {
  const counts = {}

  entries.forEach((entry) => {
    if (!Array.isArray(entry.triggers)) return

    entry.triggers.forEach((trigger) => {
      counts[trigger] = (counts[trigger] || 0) + 1
    })
  })

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([trigger, count]) => ({ trigger, count }))
}

function getEntrySymptomTotal(entry) {
  return (
    Number(entry.pain || 0) +
    Number(entry.bloating || 0) +
    Number(entry.fatigue || 0) +
    Number(entry.stress || 0)
  )
}

function buildComparison(sevenDayEntries, thirtyDayEntries, field) {
  const sevenDayAverage = average(sevenDayEntries, field)
  const thirtyDayAverage = average(thirtyDayEntries, field)
  const difference = Number((sevenDayAverage - thirtyDayAverage).toFixed(1))

  return {
    field,
    sevenDayAverage,
    thirtyDayAverage,
    difference,
    direction:
      difference < 0 ? 'improved' : difference > 0 ? 'worsened' : 'stable',
  }
}

export function generateWeeklySummary(entries) {
  if (!Array.isArray(entries) || entries.length < 3) {
    return {
      ready: false,
      message: 'More check-ins needed to generate insights.',
    }
  }

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  const recentEntries = sortedEntries.slice(0, 7)
  const thirtyDayEntries = sortedEntries.slice(0, 30)

  const trend = detectTrend(recentEntries)

  const elevatedDays = recentEntries.filter(
    (entry) => calculateFlareRiskScore(entry) >= 4
  ).length

  const flareDays = recentEntries.filter(
    (entry) =>
      entry.flareStatus === 'moderate' ||
      entry.flareStatus === 'severe' ||
      entry.bloodMucus !== 'none'
  ).length

  const sortedBySymptoms = [...recentEntries].sort(
    (a, b) => getEntrySymptomTotal(b) - getEntrySymptomTotal(a)
  )

  const worstDay = sortedBySymptoms[0]
  const bestDay = sortedBySymptoms[sortedBySymptoms.length - 1]

  const mostCommonTriggers = getMostCommonTriggers(recentEntries)

  const comparisons = [
    buildComparison(recentEntries, thirtyDayEntries, 'pain'),
    buildComparison(recentEntries, thirtyDayEntries, 'bloating'),
    buildComparison(recentEntries, thirtyDayEntries, 'fatigue'),
    buildComparison(recentEntries, thirtyDayEntries, 'stress'),
  ]

  const chartData = [...recentEntries]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString('en-GB', {
        weekday: 'short',
      }),
      pain: Number(entry.pain || 0),
      bloating: Number(entry.bloating || 0),
      fatigue: Number(entry.fatigue || 0),
      stress: Number(entry.stress || 0),
    }))

  let headline = ''

  if (trend.label === 'Improving') {
    headline = 'Symptoms appear to be improving this week.'
  } else if (trend.label === 'Worsening') {
    headline = 'Symptoms appear elevated compared with recent check-ins.'
  } else {
    headline = 'Symptoms appear relatively stable this week.'
  }

  const improvedCount = comparisons.filter(
    (item) => item.direction === 'improved'
  ).length

  const doctorNote =
    flareDays === 0 && elevatedDays === 0
      ? 'This week shows stable symptoms with no elevated-risk or flare days recorded.'
      : `This week included ${elevatedDays} elevated-risk day${
          elevatedDays === 1 ? '' : 's'
        } and ${flareDays} flare-related day${flareDays === 1 ? '' : 's'}.`

  return {
    ready: true,
    daysLogged: recentEntries.length,
    averagePain: average(recentEntries, 'pain'),
    averageBloating: average(recentEntries, 'bloating'),
    averageFatigue: average(recentEntries, 'fatigue'),
    averageStress: average(recentEntries, 'stress'),
    elevatedDays,
    flareDays,
    mostCommonTriggers,
    worstDay,
    bestDay,
    headline,
    comparisons,
    chartData,
    doctorNote,
    message: `${headline} ${elevatedDays} elevated-risk day${
      elevatedDays === 1 ? '' : 's'
    } recorded. ${improvedCount} symptom area${
      improvedCount === 1 ? '' : 's'
    } improved versus the 30-day average.`,
  }
}
