import DashboardSummary from '../components/DashboardSummary'
import SymptomTrendChart from '../charts/SymptomTrendChart'
import FlareRiskChart from '../charts/FlareRiskChart'
import AverageComparisonCards from '../components/AverageComparisonCards'

function DashboardView({ entries }) {
  return (
    <div className="dashboard-view">
      <section className="dashboard-section">
        <div className="section-header">
          <p className="eyebrow">Overview</p>
          <h2>Your Health Dashboard</h2>
          <p>
            A quick snapshot of your recent symptoms, flare risk and logging consistency.
          </p>
        </div>

        <DashboardSummary entries={entries} />

        <AverageComparisonCards entries={entries} />
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <p className="eyebrow">Trends</p>
          <h2>Recent Patterns</h2>
          <p>
            These charts show your recent symptom burden and whether your flare risk
            is moving towards the warning threshold.
          </p>
        </div>

        <div className="chart-grid">
          <SymptomTrendChart entries={entries} />
          <FlareRiskChart entries={entries} />
        </div>
      </section>

      <section className="card clinical-card">
        <p className="eyebrow">Safety guidance</p>
        <h2>When to Seek Help</h2>
        <p>
          Seek immediate medical advice if you experience severe pain, heavy bleeding,
          fever, dehydration, or a significant change in symptoms.
        </p>
      </section>
    </div>
  )
}

export default DashboardView