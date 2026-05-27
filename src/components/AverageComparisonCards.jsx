function calculateAverage(entries, days) {
  if (!entries || entries.length === 0) return null

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const recentEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date)
    return entryDate >= cutoff
  })

  if (recentEntries.length === 0) return null

  const total = recentEntries.reduce((sum, entry) => {
    const pain = Number(entry.pain) || 0
    const bloating = Number(entry.bloating) || 0
    const fatigue = Number(entry.fatigue) || 0
    const stress = Number(entry.stress) || 0

    return sum + (pain + bloating + fatigue + stress) / 4
  }, 0)

  return Number((total / recentEntries.length).toFixed(1))
}

function getTrendLabel(sevenDayAvg, thirtyDayAvg) {
  if (sevenDayAvg === null || thirtyDayAvg === null) return 'Not enough data'

  const difference = Number((sevenDayAvg - thirtyDayAvg).toFixed(1))

  if (difference <= -0.5) return 'Improving'
  if (difference >= 0.5) return 'Worsening'

  return 'Stable'
}

function AverageComparisonCards({ entries }) {
  const sevenDayAvg = calculateAverage(entries, 7)
  const thirtyDayAvg = calculateAverage(entries, 30)
  const trendLabel = getTrendLabel(sevenDayAvg, thirtyDayAvg)

  return (
    <section className="average-comparison-card">
      <div className="average-comparison-header">
        <p className="summary-eyebrow">Recent Direction</p>
        <h3>7-Day vs 30-Day Symptom Average</h3>
        <p>
          Compares your recent symptom burden against your wider baseline.
        </p>
      </div>

      <div className="average-comparison-metrics">
        <div>
          <span>7-Day Avg</span>
          <strong>{sevenDayAvg !== null ? sevenDayAvg : '—'}</strong>
        </div>

        <div>
          <span>30-Day Avg</span>
          <strong>{thirtyDayAvg !== null ? thirtyDayAvg : '—'}</strong>
        </div>

        <div>
          <span>Direction</span>
          <strong
            className={`trend-${trendLabel
              .toLowerCase()
              .replaceAll(' ', '-')}`}
          >
            {trendLabel}
          </strong>
        </div>
      </div>
    </section>
  )
}

export default AverageComparisonCards