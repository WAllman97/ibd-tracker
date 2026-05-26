import DashboardSummary from '../components/DashboardSummary'

function DashboardView({ entries }) {
  return (
    <>
      <DashboardSummary entries={entries} />

      <section className="card">
        <h2>When to Seek Help</h2>
        <p>
          Seek immediate medical advice if you experience severe pain, heavy bleeding,
          fever, dehydration, or a significant change in symptoms.
        </p>
      </section>
    </>
  )
}

export default DashboardView
