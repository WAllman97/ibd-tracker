import { calculateFlareRiskScore } from './flareCalculations'

export function calculateDaysSinceFlare(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return null

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  const lastFlare = sortedEntries.find((entry) => {
    return calculateFlareRiskScore(entry) >= 4
  })

  if (!lastFlare) return null

  const today = new Date()
  const flareDate = new Date(lastFlare.date)

  today.setHours(0, 0, 0, 0)
  flareDate.setHours(0, 0, 0, 0)

  const diffMs = today - flareDate
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}
