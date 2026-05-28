import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

import { generateWeeklySummary } from '../utils/generateWeeklySummary'

function formatDifference(value) {
  if (value === 0) return 'No change'
  return value > 0 ? `+${value}` : `${value}`
}

function WeeklySummaryPreview({ entries }) {
  const summary = generateWeeklySummary(entries)

  if (!summary.ready) {
    return (
      <section className="card">
        <h2>Weekly Summary</h2>
        <p className="muted-text">{summary.message}</p>
      </section>
    )
  }

  return (
    <section className="card weekly-summary-preview">
      <div className="weekly-summary-header">
        <div>
          <p className="summary-eyebrow">Weekly Insight</p>
          <h2>Weekly Summary</h2>
        </div>
      </div>

      <p className="weekly-summary-headline">{summary.headline}</p>

      <div className="summary-grid">
        <div className="summary-mini-card">
          <strong>{summary.daysLogged}/7</strong>
          <span>Days logged</span>
        </div>

        <div className="summary-mini-card">
          <strong>{summary.elevatedDays}</strong>
          <span>Elevated-risk days</span>
        </div>

        <div className="summary-mini-card">
          <strong>{summary.flareDays}</strong>
          <span>Flare days</span>
        </div>
      </div>

      <div className="weekly-chart-card">
        <h3>7-day symptom trend</h3>

        <div className="weekly-chart">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={summary.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="pain" stroke="#ef4444" />
              <Line type="monotone" dataKey="bloating" stroke="#f97316" />
              <Line type="monotone" dataKey="fatigue" stroke="#6366f1" />
              <Line type="monotone" dataKey="stress" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="comparison-section">
        <h3>7-day vs 30-day average</h3>

        <div className="comparison-list">
          {summary.comparisons.map((item) => (
            <div className="comparison-row" key={item.field}>
              <span className="comparison-label">{item.field}</span>

              <span>
                {item.sevenDayAverage}/10 vs {item.thirtyDayAverage}/10
              </span>

              <strong className={`comparison-${item.direction}`}>
                {formatDifference(item.difference)}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {summary.mostCommonTriggers.length > 0 && (
        <div className="trigger-summary-section">
          <h3>Most common triggers</h3>

          <div className="trigger-pill-row">
            {summary.mostCommonTriggers.map((item) => (
              <span className="trigger-pill" key={item.trigger}>
                {item.trigger} · {item.count}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="doctor-note-card">
        <h3>Doctor note</h3>
        <p>{summary.doctorNote}</p>
      </div>
    </section>
  )
}

export default WeeklySummaryPreview