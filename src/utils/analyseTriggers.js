import { calculateFlareRiskScore } from './flareCalculations'

export function analyseTriggers(entries) {
  if (!Array.isArray(entries) || entries.length < 5) {
    return {
      topTrigger: 'More data needed',
      message: 'Log more check-ins to detect meaningful trigger patterns.',
      confidence: 'low',
    }
  }

  const triggerStats = {}

  entries.forEach((entry) => {
    if (!Array.isArray(entry.triggers)) return

    const score = calculateFlareRiskScore(entry)

    entry.triggers.forEach((trigger) => {
      if (!triggerStats[trigger]) {
        triggerStats[trigger] = {
          count: 0,
          elevatedDays: 0,
          totalScore: 0,
        }
      }

      triggerStats[trigger].count += 1
      triggerStats[trigger].totalScore += score

      if (score >= 4) {
        triggerStats[trigger].elevatedDays += 1
      }
    })
  })

  const rankedTriggers = Object.entries(triggerStats)
    .map(([trigger, stats]) => ({
      trigger,
      count: stats.count,
      elevatedDays: stats.elevatedDays,
      averageScore: stats.totalScore / stats.count,
    }))
    .filter((trigger) => trigger.count >= 2)
    .sort((a, b) => {
      if (b.elevatedDays !== a.elevatedDays) {
        return b.elevatedDays - a.elevatedDays
      }

      return b.averageScore - a.averageScore
    })

  if (rankedTriggers.length === 0) {
    return {
      topTrigger: 'No repeated triggers',
      message: 'No repeated symptom-linked trigger patterns detected yet.',
      confidence: 'low',
    }
  }

  const top = rankedTriggers[0]

  if (top.elevatedDays === 0) {
    return {
      topTrigger: top.trigger,
      message: `${top.trigger} appears repeatedly but has not coincided with elevated symptom days.`,
      confidence: 'low',
    }
  }

  if (top.elevatedDays >= 3) {
    return {
      topTrigger: top.trigger,
      message: `${top.trigger} has repeatedly appeared on elevated symptom days.`,
      confidence: 'high',
    }
  }

  return {
    topTrigger: top.trigger,
    message: `${top.trigger} may be associated with higher symptom days.`,
    confidence: 'medium',
  }
}
