import SymptomForm from '../components/SymptomForm'
import WarningAlert from '../components/WarningAlert'

function CheckInView({ entries, onAddEntry }) {
  return (
    <>
      <WarningAlert entries={entries} />

      <section className="card">
        <h2>Daily Check-In</h2>
        <SymptomForm onAddEntry={onAddEntry} entries={entries} />
      </section>
    </>
  )
}

export default CheckInView
