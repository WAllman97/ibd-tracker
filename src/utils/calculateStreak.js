export function calculateCurrentStreak(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return 0

  const dates = new Set(entries.map((entry) => entry.date))

  let streak = 0
  const currentDate = new Date()

  while (true) {
    const dateString = currentDate.toISOString().slice(0, 10)

    if (dates.has(dateString)) {
      streak += 1
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
