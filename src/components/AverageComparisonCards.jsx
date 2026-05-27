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

    const overallScore = (pain + bloating + fatigue + stress) / 4

    return sum + overallScore
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
    <section className="average-comparison-grid">
      <div className="comparison-card">
        <p className="comparison-label">7-Day Average</p>
        <p className="comparison-value">
          {sevenDayAvg !== null ? sevenDayAvg : '—'}
        </p>
      </div>

      <div className="comparison-card">
        <p className="comparison-label">30-Day Average</p>
        <p className="comparison-value">
          {thirtyDayAvg !== null ? thirtyDayAvg : '—'}
        </p>
      </div>

      <div className="comparison-card">
        <p className="comparison-label">Recent Direction</p>
        <p
          className={`comparison-value trend-${trendLabel
            .toLowerCase()
            .replaceAll(' ', '-')}`}
        >
          {trendLabel}
        </p>
      </div>
    </section>
  )
}

export default AverageComparisonCards