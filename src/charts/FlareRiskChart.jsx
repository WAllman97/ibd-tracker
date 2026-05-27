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
  const entryCount = entries?.length || 0
  const hasEnoughForTrend = entryCount >= 3

  if (entryCount === 0) {
    return (
      <section className="card empty-chart-card">
        <h2>Flare Risk Trend</h2>
        <p>
          No flare risk trend yet. Complete your first daily check-in to start
          tracking whether your symptoms are moving towards flare territory.
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
      flareRisk: calculateFlareRiskScore(entry),
    }))

  return (
    <section className="card">
      <h2>Flare Risk Trend</h2>
      <p className="chart-subtitle">
        {hasEnoughForTrend
          ? `Scores above ${FLARE_THRESHOLD} may indicate elevated flare risk.`
          : 'Trend accuracy improves once you have at least 3 daily check-ins.'}
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