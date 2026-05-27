import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'

import { calculateFlareRiskScore } from '../utils/flareCalculations'

const FLARE_THRESHOLD = 6

function FlareRiskChart({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <section className="card">
        <h2>Flare Risk Trend</h2>
        <p>No flare risk data yet. Complete a few check-ins to see your trend.</p>
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
      flareRisk: calculateFlareRiskScore(entry),
    }))

  return (
    <section className="card">
      <h2>Flare Risk Trend</h2>
      <p className="chart-subtitle">
        Scores above {FLARE_THRESHOLD} may indicate elevated flare risk.
      </p>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <ReferenceLine
              y={FLARE_THRESHOLD}
              label="Flare threshold"
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="8 8"
            />
            <Line
              type="monotone"
              dataKey="flareRisk"
              name="Flare Risk"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default FlareRiskChart