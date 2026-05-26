import { calculateFlareRiskScore } from './flareCalculations'

export function analyseTriggers(entries) {
  if (!Array.isArray(entries) || entries.length < 3) {
    return {
      topTrigger: 'More data needed',
      count: 0,
      hasPattern: false,
      message: 'Log more check-ins to detect repeated trigger patterns.',
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
          elevatedCount: 0,
          totalScore: 0,
        }
      }

      triggerStats[trigger].count += 1
      triggerStats[trigger].totalScore += score

      if (score >= 4) {
        triggerStats[trigger].elevatedCount += 1
      }
    })
  })

  const analysedTriggers = Object.entries(triggerStats)
    .map(([trigger, stats]) => ({
      trigger,
      count: stats.count,
      elevatedCount: stats.elevatedCount,
      averageScore: stats.totalScore / stats.count,
    }))
    .sort((a, b) => {
      if (b.elevatedCount !== a.elevatedCount) {
        return b.elevatedCount - a.elevatedCount
      }

      return b.averageScore - a.averageScore
    })

  if (analysedTriggers.length === 0) {
    return {
      topTrigger: 'None logged',
      count: 0,
      hasPattern: false,
      message: 'No triggers logged yet.',
    }
  }

  const top = analysedTriggers[0]

  if (top.count < 2) {
    return {
      topTrigger: top.trigger,
      count: top.count,
      hasPattern: false,
      message: `${top.trigger} has only appeared once. More data needed before treating it as a pattern.`,
    }
  }

  if (top.elevatedCount === 0) {
    return {
      topTrigger: top.trigger,
      count: top.count,
      hasPattern: false,
      message: `${top.trigger} has appeared ${top.count} times, but not on elevated-risk days so far.`,
    }
  }

  return {
    topTrigger: top.trigger,
    count: top.count,
    hasPattern: true,
    message: `${top.trigger} has appeared ${top.count} times, including ${top.elevatedCount} elevated-risk day${top.elevatedCount === 1 ? '' : 's'}. Worth monitoring.`,
  }
}
