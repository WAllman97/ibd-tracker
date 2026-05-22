/**
 * Calculate flare risk score
 * 
 * Higher score = higher likelihood of flare activity
 */

export function calculateFlareRiskScore(entry) {
  if (!entry) return 0

  let score = 0

  // Pain weighting
  score += Number(entry.pain || 0) * 0.35

  // Bloating weighting
  score += Number(entry.bloating || 0) * 0.2

  // Fatigue weighting
  score += Number(entry.fatigue || 0) * 0.2

  // Stool frequency weighting
  score += Number(entry.stoolCount || 0) * 0.15

  // Blood in stool weighting
  if (entry.blood === true) {
    score += 2
  }

  // Urgency weighting
  if (entry.urgency === true) {
    score += 1.5
  }

  // Normalize to roughly 0–10 scale
  return Math.min(score, 10).toFixed(1)
}

/**
 * Convert numeric score into risk level
 */

export function getFlareRiskLevel(score) {
  const numericScore = Number(score)

  if (numericScore >= 7) return 'high'
  if (numericScore >= 4) return 'moderate'

  return 'low'
}

/**
 * Warning alert helper
 */

export function getWarningMessage(entry) {
  if (!entry) return null

  const score = calculateFlareRiskScore(entry)
  const level = getFlareRiskLevel(score)

  if (level === 'high') {
    return {
      level: 'high',
      title: 'High flare risk',
      message:
        'Your symptoms appear elevated today. Monitor closely and consider contacting your clinician if symptoms worsen.'
    }
  }

  if (level === 'moderate') {
    return {
      level: 'moderate',
      title: 'Moderate flare risk',
      message:
        'Some symptoms are elevated. Continue monitoring over the next few days.'
    }
  }

  return {
    level: 'low',
    title: 'Stable day',
    message:
      'Your symptoms appear relatively stable today.'
  }
}
