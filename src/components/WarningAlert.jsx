import { getWarningMessage } from '../utils/flareCalculations'

function WarningAlert({ entries }) {
  const safeEntries = Array.isArray(entries) ? entries : []

  if (safeEntries.length === 0) {
    return null
  }

  const latestEntry = [...safeEntries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )[0]

  const warning = getWarningMessage(latestEntry)

  if (!warning) {
    return null
  }

  return (
    <section className={`warning-alert warning-${warning.level}`}>
      <div className="warning-alert-content">
        <h3>{warning.title}</h3>
        <p>{warning.message}</p>
      </div>
    </section>
  )
}

export default WarningAlert
