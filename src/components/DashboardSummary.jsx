import { calculateFlareRiskScore } from '../utils/flareCalculations'
import { calculateCurrentStreak } from '../utils/calculateStreak'
import { calculateRollingAverage } from '../utils/calculateAverages'
import { calculateDaysSinceFlare } from '../utils/daysSinceFlare'
import { detectTrend } from '../utils/detectTrend'

function DashboardSummary({ entries }) {
  const safeEntries = Array.isArray(entries) ? entries : []

  function getLatestEntry() {
    if (safeEntries.length === 0) return null
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

  function getTrend() {
    if (safeEntries.length < 2) return 'stable'

    const sorted = [...safeEntries].sort((a, b) => new Date(a.date) - new Date(b.date))
    const recent = sorted.slice(-7)

    if (recent.length < 2) return 'stable'

    const firstScore = calculateFlareRiskScore(recent[0])
    const lastScore = calculateFlareRiskScore(recent[recent.length - 1])

    return lastScore > firstScore + 1 ? 'rising' : 'stable'
  }

  function getRecentFlareDays() {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 7)

    return safeEntries
      .filter((e) => new Date(e.date) >= cutoffDate)
      .filter((e) => calculateFlareRiskScore(e) >= 4)
      .length
  }

  const avgPain = calculateRollingAverage(safeEntries, 'pain', 7)
  const avgBloating = calculateRollingAverage(safeEntries, 'bloating', 7)
  const latestFlare = getLatestFlareStatus()
  const trend = detectTrend(safeEntries)
  const recentFlares = getRecentFlareDays()
  const currentStreak = calculateCurrentStreak(safeEntries)
  const daysSinceFlare = calculateDaysSinceFlare(safeEntries)

  return (
    <section className="dashboard-summary">
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
          <h3>Current Flare Risk</h3>
          <div className={`summary-value flare-${latestFlare.toLowerCase()}`}>
            {latestFlare}
          </div>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-content">
          <h3>Trend</h3>
          <div className={`summary-value trend-${trend.status}`}>
            {trend.label}
          </div>
          <p className="summary-label">recent vs previous</p>
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
          <h3>Current Streak</h3>
          <div className="summary-value">{currentStreak}</div>
          <p className="summary-label">
            {currentStreak === 1 ? 'day logged' : 'days logged'}
          </p>
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
          <h3>Total Entries</h3>
          <div className="summary-value">{safeEntries.length}</div>
          <p className="summary-label">tracked</p>
        </div>
      </div>
    </section>
  )
}

export default DashboardSummary
