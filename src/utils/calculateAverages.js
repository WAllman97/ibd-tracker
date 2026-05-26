export function calculateRollingAverage(entries, field, days = 7) {
  if (!Array.isArray(entries) || entries.length === 0) return 0

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days + 1)

  const recentEntries = entries.filter((entry) => {
    return new Date(entry.date) >= cutoffDate
  })

  if (recentEntries.length === 0) return 0

  const total = recentEntries.reduce((sum, entry) => {
    return sum + Number(entry[field] || 0)
  }, 0)

  return (total / recentEntries.length).toFixed(1)
}
