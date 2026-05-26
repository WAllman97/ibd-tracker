export function analyseTriggers(entries) {
  if (!Array.isArray(entries) || entries.length < 3) {
    return {
      topTrigger: 'More data needed',
      count: 0,
      hasPattern: false,
      message: 'Log more check-ins to detect repeated trigger patterns.',
    }
  }

  const triggerCounts = {}

  entries.forEach((entry) => {
    if (!Array.isArray(entry.triggers)) return

    entry.triggers.forEach((trigger) => {
      triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1
    })
  })

  const sortedTriggers = Object.entries(triggerCounts).sort(
    (a, b) => b[1] - a[1]
  )

  if (sortedTriggers.length === 0) {
    return {
      topTrigger: 'None logged',
      count: 0,
      hasPattern: false,
      message: 'No repeated triggers logged yet.',
    }
  }

  const [topTrigger, count] = sortedTriggers[0]

  if (count < 2) {
    return {
      topTrigger,
      count,
      hasPattern: false,
      message: `${topTrigger} has appeared once. More data needed before treating it as a pattern.`,
    }
  }

  return {
    topTrigger,
    count,
    hasPattern: true,
    message: `${topTrigger} has appeared ${count} times. This may be worth monitoring as a repeated trigger.`,
  }
}
