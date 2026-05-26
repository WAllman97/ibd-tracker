import { calculateFlareRiskScore } from '../utils/flareCalculations'
import { useState } from 'react'

/**
 * ExportButton Component
 * 
 * Button that downloads all entries as CSV file
 * CSV can be opened in Excel or Google Sheets
 * 
 * Props:
 * - entries: array of entry objects
 */

function ExportButton({ entries }) {
  const [showSuccess, setShowSuccess] = useState(false)

  /**
   * Convert entries to CSV format and download
   */
  function handleExport() {
    if (entries.length === 0) {
      alert('No entries to export.')
      return
    }

    // CSV header row
    const headers = [
      'Date',
      'Pain (0-10)',
      'Bloating (0-10)',
      'Stress (0-10)',
      'Fatigue (0-10)',
      'Stool Score (1-7)',
      'Day Type',
      'Flare Status',
      'Blood/Mucus',
      'Key Foods',
      'Triggers',
      'Notes',
      'Risk Score'
    ]

    // CSV data rows
    const rows = entries.map(e => [
      e.date,
      e.pain,
      e.bloating,
      e.stress,
      e.fatigue,
      e.stool,
      e.dayType,
      e.flareStatus,
      e.bloodMucus,
      `"${e.keyFoods}"`, // Quote to handle commas
      `"${Array.isArray(e.triggers) ? e.triggers.join('; ') : ''}"`,
      `"${e.notes}"`,
      calculateFlareRiskScore(e)
    ])

    // Combine headers and rows
    const csv = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `IBD-Tracker-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Show success message
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <>
      {showSuccess && (
        <div className="toast">
          ✓ CSV exported successfully!
        </div>
      )}
      <button className="btn-secondary" onClick={handleExport}>
        📥 Download as CSV
      </button>
    </>
  )
}

export default ExportButton
