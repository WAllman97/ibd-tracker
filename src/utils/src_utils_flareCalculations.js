/**
 * Flare Calculations Utility
 * 
 * This file contains all the logic for:
 * - Calculating individual flare risk scores
 * - Analyzing trends over time
 * - Generating warning messages
 */

const FLARE_THRESHOLD = 50
const DAYS_TO_ANALYZE = 7

/**
 * Calculate flare risk score for a single entry (0-100)
 * Based on symptom severity and combination of factors
 */
export function calculateFlareRiskScore(entry) {
  let score = 0

  // Pain score (0-25 points)
  if (entry.pain >= 8) score += 25
  else if (entry.pain >= 6) score += 15
  else if (entry.pain >= 4) score += 8

  // Bloating score (0-20 points)
  if (entry.bloating >= 8) score += 20
  else if (entry.bloating >= 6) score += 12
  else if (entry.bloating >= 4) score += 6

  // Flare status (0-20 points)
  if (entry.flareStatus === 'severe') score += 20
  else if (entry.flareStatus === 'moderate') score += 12
  else if (entry.flareStatus === 'mild') score += 5

  // Blood/Mucus (0-15 points)
  if (entry.bloodMucus === 'both') score += 15
  else if (entry.bloodMucus === 'blood' || entry.bloodMucus === 'mucus') score += 10

  // Fatigue score (0-10 points)
  if (entry.fatigue >= 8) score += 10
  else if (entry.fatigue >= 6) score += 6

  // Stool abnormality (0-10 points)
  if (entry.stool <= 2 || entry.stool >= 6) score += 8
  else if (entry.stool === 3 || entry.stool === 5) score += 4

  return Math.min(score, 100) // Cap at 100
}

/**
 * Analyze trends over last N days
 * Returns object with averages and trend direction
 */
export function analyzeTrends(entries) {
  if (entries.length === 0) return null

  // Get entries from last N days
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - DAYS_TO_ANALYZE)

  const recentEntries = entries.filter(e => new Date(e.date) >= cutoffDate)
  if (recentEntries.length === 0) return null

  // Calculate averages
  const avgPain = recentEntries.reduce((sum, e) => sum + e.pain, 0) / recentEntries.length
  const avgBloating = recentEntries.reduce((sum, e) => sum + e.bloating, 0) / recentEntries.length
  const avgFatigue = recentEntries.reduce((sum, e) => sum + e.fatigue, 0) / recentEntries.length
  
  // Count flare days
  const flareCount = recentEntries.filter(e => e.flareStatus !== 'none' && e.flareStatus !== '').length
  
  // Check for blood/mucus
  const bloodPresent = recentEntries.some(e => e.bloodMucus !== 'none' && e.bloodMucus !== '')

  // Calculate trend (increasing/decreasing)
  const latestScores = recentEntries.slice(-3).map(calculateFlareRiskScore)
  const trend = latestScores.length >= 2 && latestScores[latestScores.length - 1] > latestScores[0] 
    ? 'rising' 
    : 'stable'

  return {
    avgPain,
    avgBloating,
    avgFatigue,
    flareCount,
    bloodPresent,
    trend,
    daysAnalyzed: recentEntries.length
  }
}

/**
 * Generate warning message and details
 * Returns null if no warning, or object with message, score, and details
 */
export function getWarningMessage(entries) {
  if (entries.length === 0) return null

  const latestEntry = entries[entries.length - 1]
  const score = calculateFlareRiskScore(latestEntry)
  const trends = analyzeTrends(entries)

  if (score < FLARE_THRESHOLD && (!trends || trends.trend === 'stable')) {
    return null // No warning
  }

  const warnings = []
  const details = []

  // Check for severe symptoms
  if (latestEntry.pain >= 8) {
    warnings.push('High pain levels detected')
    details.push(`• Pain score: ${latestEntry.pain}/10`)
  }

  if (latestEntry.bloating >= 8) {
    warnings.push('Significant bloating')
    details.push(`• Bloating score: ${latestEntry.bloating}/10`)
  }

  if (latestEntry.flareStatus === 'severe' || latestEntry.flareStatus === 'moderate') {
    warnings.push(`${latestEntry.flareStatus.charAt(0).toUpperCase() + latestEntry.flareStatus.slice(1)} flare detected`)
    details.push(`• Flare status: ${latestEntry.flareStatus}`)
  }

  if (latestEntry.bloodMucus !== 'none' && latestEntry.bloodMucus !== '') {
    warnings.push(`Blood/mucus present: ${latestEntry.bloodMucus}`)
    details.push(`• Blood/Mucus: ${latestEntry.bloodMucus}`)
  }

  if (trends) {
    if (trends.trend === 'rising' && score >= 25) {
      warnings.push('Symptoms trending upward')
      details.push(`• Trend: Rising over last ${trends.daysAnalyzed} days`)
    }

    if (trends.flareCount >= 3) {
      warnings.push(`Multiple flare days (${trends.flareCount} in last ${DAYS_TO_ANALYZE} days)`)
      details.push(`• Flare days: ${trends.flareCount}/${trends.daysAnalyzed}`)
    }
  }

  return warnings.length > 0 ? { message: warnings.join(' + '), score, details } : null
}
