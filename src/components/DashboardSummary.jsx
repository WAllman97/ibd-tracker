import { calculateFlareRiskScore } from '../utils/flareCalculations'
import { calculateCurrentStreak } from '../utils/calculateStreak'
import { calculateRollingAverage } from '../utils/calculateAverages'
import { calculateDaysSinceFlare } from '../utils/daysSinceFlare'
import { detectTrend } from '../utils/detectTrend'
import { generateWeeklySummary } from '../utils/generateWeeklySummary'
import { analyseTriggers } from '../utils/analyseTriggers'

function DashboardSummary({ entries }) {
  const safeEntries = Array.isArray(entries) ? entries : []

  if (safeEntries.length === 0) {
    return (
      <section className="dashboard-summary">
        <div className="summary-card">
          <div className="summary-card-content">
            <h3>Getting Started</h3>
            <div className="summary-value">0</div>
            <p className="summary-label">
              Log your first check-in to unlock symptom trends.
            </p>
          </div>
        </div>
      </section>
    )
  }

  function getLatestEntry() {
    return [...safeEntries].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
  }

  function getLatestFlareStatus() {
    const latest = getLatestEntry()
    if (!latest) return 'None'

    const score = calculateFlareRiskScore(latest)

    if (score >= 7) return 'High'
    if (score >= 4) return 'Moderate'
    return 'Low'
  }

  function getRecentFlareDays() {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 7)

    return safeEntries
      .filter((entry) => new Date(entry.date) >= cutoffDate)
      .filter((entry) => calculateFlareRiskScore(entry) >= 4)
      .length
  }

  const avgPain = calculateRollingAverage(safeEntries, 'pain', 7)
  const avgBloating = calculateRollingAverage(safeEntries, 'bloating', 7)
  const latestFlare = getLatestFlareStatus()
  const trend = detectTrend(safeEntries)
  const weeklySummary = generateWeeklySummary(safeEntries)
  const recentFlares = getRecentFlareDays()
  const daysSinceFlare = calculateDaysSinceFlare(safeEntries)
  const currentStreak = calculateCurrentStreak(safeEntries)
  const triggerInsight = analyseTriggers(safeEntries)

  return (
    <section className="dashboard-summary">
      <div className="summary-card">
        <div className="summary-card-content">
          <h3>Current Flare Risk</h3>
          <div className={`summary-value flare-${latestFlare.toLowerCase()}`}>
            {latestFlare}
          </div>
        </div>
      </div>

      <div className={`summary-card trend-card trend-card-${trend.status}`}>
        <div className="summary-card-content">
          <h3>Trend</h3>
          <div className={`summary-value trend-${trend.status}`}>
            {trend.status === 'improving' && '↓ '}
            {trend.status === 'stable' && '→ '}
            {trend.status === 'worsening' && '↑ '}
            {trend.label}
          </div>
          <p className="summary-label">recent vs previous</p>
        </div>
      </div>

      <div className="summary-card summary-card-wide weekly-summary-card">
        <div className="summary-card-content">
          <p className="summary-eyebrow">Weekly Insight</p>
          <h3>Health Summary</h3>
          <p className="weekly-summary-text">{weeklySummary}</p>
        </div>
      </div>

      <div className="summary-card summary-card-wide trigger-insight-card">
        <div className="summary-card-content">
          <p className="summary-eyebrow">Trigger Pattern</p>
          <h3>Most Common Trigger</h3>
      
          <div className="summary-value">
            {triggerInsight.topTrigger}
          </div>
      
          <p className="summary-label">
            {triggerInsight.message}
          </p>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-content">
          <h3>7-Day Avg Pain</h3>
          <div className="summary-value">{avgPain}</div>
          <p className="summary-label">out of 10</p>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-content">
          <h3>7-Day Avg Bloating</h3>
          <div className="summary-value">{avgBloating}</div>
          <p className="summary-label">out of 10</p>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-content">
          <h3>Risk Days</h3>
          <div className="summary-value">{recentFlares}</div>
          <p className="summary-label">in past 7 days</p>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-content">
          <h3>Days Since Flare</h3>
          <div className="summary-value">
            {daysSinceFlare === null ? '—' : daysSinceFlare}
          </div>
          <p className="summary-label">
            {daysSinceFlare === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-content">
          <h3>Current Streak</h3>
          <div className="summary-value">{currentStreak}</div>
          <p className="summary-label">
            {currentStreak === 1 ? 'day logged' : 'days logged'}
          </p>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-content">
          <h3>Total Entries</h3>
          <div className="summary-value">{safeEntries.length}</div>
          <p className="summary-label">tracked</p>
        </div>
      </div>
    </section>
  )
}

export default DashboardSummary
