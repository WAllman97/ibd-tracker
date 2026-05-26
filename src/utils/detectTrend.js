import { calculateFlareRiskScore } from './flareCalculations'

function averageScore(entries) {
  if (!entries.length) return 0

  const total = entries.reduce((sum, entry) => {
    return sum + calculateFlareRiskScore(entry)
  }, 0)

  return total / entries.length
}

export function detectTrend(entries) {
  if (!Array.isArray(entries) || entries.length < 4) {
    return {
      label: 'Not enough data',
      status: 'neutral',
    }
  }

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )

  const recentEntries = sortedEntries.slice(-3)
  const previousEntries = sortedEntries.slice(-6, -3)

  if (previousEntries.length < 3) {
    return {
      label: 'More data needed',
      status: 'neutral',
    }
  }

  const recentAverage = averageScore(recentEntries)
  const previousAverage = averageScore(previousEntries)
  const difference = recentAverage - previousAverage

  if (difference >= 1) {
    return {
      label: 'Worsening',
      status: 'worsening',
    }
  }

  if (difference <= -1) {
    return {
      label: 'Improving',
      status: 'improving',
    }
  }

  return {
    label: 'Stable',
    status: 'stable',
  }
}
