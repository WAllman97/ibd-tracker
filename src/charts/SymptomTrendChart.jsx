import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'

function SymptomTrendChart({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <section className="card">
        <h2>Symptom Trends</h2>
        <p>No symptom data yet. Complete a few daily check-ins to see trends.</p>
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
      pain: Number(entry.pain) || 0,
      bloating: Number(entry.bloating) || 0,
      stoolFrequency: Number(entry.stoolFrequency) || 0,
    }))

  return (
    <section className="card">
      <h2>Symptom Trends</h2>
      <p className="chart-subtitle">Last 14 entries</p>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="pain"
              name="Pain"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

            <Line
              type="monotone"
              dataKey="bloating"
              name="Bloating"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

            <Line
              type="monotone"
              dataKey="stoolFrequency"
              name="Stool Frequency"
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
