export function calculateFlareRiskScore(entry) {
  if (!entry) return 0

  let score = 0

  score += Number(entry.pain || 0) * 0.3
  score += Number(entry.bloating || 0) * 0.2
  score += Number(entry.fatigue || 0) * 0.2
  score += Number(entry.stress || 0) * 0.1

  const stool = Number(entry.stool || 4)
  const stoolDeviation = Math.abs(stool - 4)
  score += stoolDeviation * 0.5

  if (entry.bloodMucus === 'blood') score += 1.5
  if (entry.bloodMucus === 'mucus') score += 1
  if (entry.bloodMucus === 'both') score += 2

  if (entry.flareStatus === 'mild') score += 1
  if (entry.flareStatus === 'moderate') score += 2
  if (entry.flareStatus === 'severe') score += 3

  return Number(Math.min(score, 10).toFixed(1))
}

export function getFlareRiskLevel(score) {
  const numericScore = Number(score)

  if (numericScore >= 7) return 'high'
  if (numericScore >= 4) return 'moderate'

  return 'low'
}

export function getFlareRiskLabel(score) {
  const level = getFlareRiskLevel(score)

  if (level === 'high') return 'Heightened flare risk'
  if (level === 'moderate') return 'Elevated symptoms'

  return 'Symptoms stable'
}

export function getFlareRiskExplanation(entry) {
  if (!entry) return ''

  const reasons = []

  if (Number(entry.pain || 0) >= 7) reasons.push('pain is elevated')
  if (Number(entry.bloating || 0) >= 7) reasons.push('bloating is elevated')
  if (Number(entry.fatigue || 0) >= 7) reasons.push('fatigue is elevated')
  if (Number(entry.stress || 0) >= 7) reasons.push('stress is elevated')

  if (entry.bloodMucus === 'blood') reasons.push('blood was recorded')
  if (entry.bloodMucus === 'mucus') reasons.push('mucus was recorded')
  if (entry.bloodMucus === 'both') reasons.push('blood and mucus were recorded')

  if (entry.flareStatus === 'moderate') reasons.push('flare status is marked moderate')
  if (entry.flareStatus === 'severe') reasons.push('flare status is marked severe')

  if (reasons.length === 0) {
    return 'No major warning signs recorded today.'
  }

  return `Main factors: ${reasons.join(', ')}.`
}

export function getWarningMessage(entry) {
  if (!entry) return null

  const score = calculateFlareRiskScore(entry)
  const level = getFlareRiskLevel(score)
  const label = getFlareRiskLabel(score)
  const explanation = getFlareRiskExplanation(entry)

  if (level === 'high') {
    return {
      level,
      title: label,
      message: `${explanation} Monitor symptoms closely and consider contacting your clinician if symptoms worsen.`,
    }
  }

  if (level === 'moderate') {
    return {
      level,
      title: label,
      message: `${explanation} Continue tracking over the next few days.`,
    }
  }

  return {
    level,
    title: label,
    message: explanation,
  }
}
