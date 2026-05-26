import { calculateFlareRiskScore } from './flareCalculations'
import { detectTrend } from './detectTrend'

export function generateWeeklySummary(entries) {
  if (!Array.isArray(entries) || entries.length < 3) {
    return 'More check-ins needed to generate insights.'
  }

  const trend = detectTrend(entries)

  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7)

  const elevatedDays = recentEntries.filter(
    (entry) => calculateFlareRiskScore(entry) >= 4
  ).length

  let summary = ''

  if (trend.label === 'Improving') {
    summary += 'Symptoms appear to be improving. '
  } else if (trend.label === 'Worsening') {
    summary += 'Symptoms appear elevated recently. '
  } else {
    summary += 'Symptoms appear relatively stable. '
  }

  summary += `${elevatedDays} elevated-risk day`

  if (elevatedDays !== 1) {
    summary += 's'
  }

  summary += ' recorded this week.'

  return summary
}
