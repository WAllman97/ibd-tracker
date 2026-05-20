import { getWarningMessage } from '../utils/flareCalculations'

/**
 * WarningAlert Component
 * 
 * Displays a warning box if flare risk is high
 * Shows:
 * - Risk score (0-100)
 * - Warning message
 * - Detailed breakdown of risk factors
 * 
 * Props:
 * - entries: array of entry objects
 */

function WarningAlert({ entries }) {
  const warning = getWarningMessage(entries)

  // If no warning, don't render anything
  if (!warning) {
    return null
  }

  return (
    <section className="card warning">
      <h2>⚠️ Flare Risk Alert</h2>
      <p>
        Risk Score: <strong>{warning.score}/100</strong> - {warning.message}
      </p>
      <div className="warning-details">
        {warning.details.map((detail, index) => (
          <div key={index}>{detail}</div>
        ))}
      </div>
    </section>
  )
}

export default WarningAlert
