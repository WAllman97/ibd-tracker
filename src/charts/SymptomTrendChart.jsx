import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

function calculateOverallScore(entry) {
  const pain = Number(entry.pain) || 0
  const bloating = Number(entry.bloating) || 0
  const fatigue = Number(entry.fatigue) || 0
  const stress = Number(entry.stress) || 0

  return Number(((pain + bloating + fatigue + stress) / 4).toFixed(1))
}

function SymptomTrendChart({ entries }) {
  const entryCount = entries?.length || 0
  const hasEnoughForTrend = entryCount >= 3

  if (entryCount === 0) {
    return (
      <section className="card empty-chart-card">
        <h2>Overall Symptom Trend</h2>
        <p>
          No symptom trend yet. Complete your first daily check-in to start building
          your personal health timeline.
        </p>
      </section>
    )
  }

  const chartData = [...entries]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14)
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      }),
      overallScore: calculateOverallScore(entry),
    }))

  return (
    <section className="card">
      <h2>Overall Symptom Trend</h2>
      <p className="chart-subtitle">
        {hasEnoughForTrend
          ? 'Average of pain, bloating, fatigue and stress — last 14 entries.'
          : 'Trend accuracy improves once you have at least 3 daily check-ins.'}
      </p>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="overallScore"
              name="Overall Score"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default SymptomTrendChart