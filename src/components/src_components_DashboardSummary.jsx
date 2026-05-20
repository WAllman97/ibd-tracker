import { calculateFlareRiskScore, analyzeTrends } from '../utils/flareCalculations'

/**
 * DashboardSummary Component
 * 
 * Displays summary cards with key statistics:
 * - Average pain and bloating
 * - Current flare status
 * - Number of entries
 * - Trend indicator
 * 
 * Props:
 * - entries: array of entry objects
 */

function DashboardSummary({ entries }) {
  /**
   * Calculate average pain over all entries
   */
  function getAveragePain() {
    if (entries.length === 0) return 0
    const total = entries.reduce((sum, e) => sum + e.pain, 0)
    return (total / entries.length).toFixed(1)
  }

  /**
   * Calculate average bloating over all entries
   */
  function getAverageBloating() {
    if (entries.length === 0) return 0
    const total = entries.reduce((sum, e) => sum + e.bloating, 0)
    return (total / entries.length).toFixed(1)
  }

  /**
   * Get latest flare status
   */
  function getLatestFlareStatus() {
    if (entries.length === 0) return 'None'
    return entries[entries.length - 1].flareStatus || 'None'
  }

  /**
   * Get current trend
   */
  function getTrend() {
    const trends = analyzeTrends(entries)
    if (!trends) return 'stable'
    return trends.trend
  }

  /**
   * Count flare days in past 7 days
   */
  function getRecentFlareDays() {
    if (entries.length === 0) return 0
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 7)
    
    return entries
      .filter(e => new Date(e.date) >= cutoffDate)
      .filter(e => e.flareStatus !== 'none' && e.flareStatus !== '')
      .length
  }

  const avgPain = getAveragePain()
  const avgBloating = getAverageBloating()
  const latestFlare = getLatestFlareStatus()
  const trend = getTrend()
  const recentFlares = getRecentFlareDays()

  return (
    <section className="dashboard-summary">
      {/* Summary Card: Average Pain */}
      <div className="summary-card">
        <div className="summary-card-content">
          <h3>Avg Pain</h3>
          <div className="summary-value">{avgPain}</div>
          <p className="summary-label">out of 10</p>
        </div>
      </div>

      {/* Summary Card: Average Bloating */}
      <div className="summary-card">
        <div className="summary-card-content">
          <h3>Avg Bloating</h3>
          <div className="summary-value">{avgBloating}</div>
          <p className="summary-label">out of 10</p>
        </div>
      </div>

      {/* Summary Card: Latest Flare */}
      <div className="summary-card">
        <div className="summary-card-content">
          <h3>Current Flare</h3>
          <div className={`summary-value flare-${latestFlare.toLowerCase()}`}>
            {latestFlare}
          </div>
        </div>
      </div>

      {/* Summary Card: Trend */}
      <div className="summary-card">
        <div className="summary-card-content">
          <h3>Trend (7d)</h3>
          <div className={`summary-value trend-${trend}`}>
            {trend === 'rising' ? '📈 Rising' : '📊 Stable'}
          </div>
        </div>
      </div>

      {/* Summary Card: Flare Days */}
      <div className="summary-card">
        <div className="summary-card-content">
          <h3>Flare Days</h3>
          <div className="summary-value">{recentFlares}</div>
          <p className="summary-label">in past 7 days</p>
        </div>
      </div>

      {/* Summary Card: Total Entries */}
      <div className="summary-card">
        <div className="summary-card-content">
          <h3>Total Entries</h3>
          <div className="summary-value">{entries.length}</div>
          <p className="summary-label">tracked</p>
        </div>
      </div>
    </section>
  )
}

export default DashboardSummary
