import { calculateFlareRiskScore } from '../utils/flareCalculations'

/**
 * EntryHistory Component
 * 
 * Displays all entries in a table format with:
 * - Date, Pain, Bloating, Flare Status, Stool, Foods, Notes
 * - Color-coded severity (red/orange/green)
 * - Delete button for each entry
 * - Filtered by date range
 * 
 * Props:
 * - entries: array of entry objects
 * - filterDays: number of days to show (7, 14, 30, 999)
 * - onDeleteEntry: function called when delete button is clicked
 */

function EntryHistory({ entries, filterDays, onDeleteEntry }) {
  /**
   * Filter entries based on date range
   */
  function getFilteredEntries() {
    if (filterDays === 999) {
      // Show all entries
      return entries
    }

    // Calculate cutoff date
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - filterDays)

    // Filter and sort
    return entries.filter(e => new Date(e.date) >= cutoffDate)
  }

  /**
   * Sort entries by date (newest first)
   */
  function getSortedEntries() {
    const filtered = getFilteredEntries()
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  /**
   * Format date as "20 May"
   */
  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  /**
   * Get CSS class for score severity
   */
  function getScoreClass(score) {
    if (score >= 60) return 'score-high'
    if (score >= 40) return 'score-medium'
    return 'score-low'
  }

  /**
   * Get CSS class for flare badge
   */
  function getFlareClass(status) {
    return `flare-${status || 'none'}`
  }

  /**
   * Truncate text with ellipsis
   */
  function truncateText(text, maxLength = 30) {
    if (!text) return '—'
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const sortedEntries = getSortedEntries()

  // Empty state
  if (sortedEntries.length === 0) {
    return (
      <div className="empty-state">
        <p>No entries yet. Start tracking by submitting your first check-in above!</p>
      </div>
    )
  }

  return (
    <table className="entries-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Pain</th>
          <th>Bloating</th>
          <th>Flare</th>
          <th>Stool</th>
          <th>Triggers</th>
          <th>Foods</th>
          <th>Notes</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {/* Map through entries and render a table row for each */}
        {sortedEntries.map(entry => {
          const score = calculateFlareRiskScore(entry)
          const scoreClass = getScoreClass(score)
          const flareClass = getFlareClass(entry.flareStatus)

          return (
            <tr key={entry.id}>
              <td>{formatDate(entry.date)}</td>
              <td className={scoreClass}>{entry.pain}/10</td>
              <td className={scoreClass}>{entry.bloating}/10</td>
              <td>
                <span className={flareClass}>
                  {entry.flareStatus || '—'}
                </span>
              </td>
              <td>
                <td>{entry.stool}/7</td>              
              <td>
                <div className="history-trigger-list">
                  {entry.triggers && entry.triggers.length > 0 ? (
                    entry.triggers.map((trigger) => (
                      <span key={trigger} className="history-trigger-chip">
                        {trigger}
                      </span>
                    ))
                  ) : (
                    <span>—</span>
                  )}
                </div>
              </td>
              <td title={entry.keyFoods}>
                {truncateText(entry.keyFoods)}
              </td>
              <td title={entry.notes}>
                {truncateText(entry.notes)}
              </td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => onDeleteEntry(entry.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default EntryHistory
