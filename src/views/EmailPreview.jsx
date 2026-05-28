import { generateWeeklySummary } from '../utils/generateWeeklySummary'
import { generateWeeklySummaryEmail } from '../utils/generateWeeklySummaryEmail'

function EmailPreview({ entries }) {
  const summary = generateWeeklySummary(entries)

  const html = generateWeeklySummaryEmail(summary, {
    userName: 'Will',
    appUrl: 'https://ibd-tracker-xi.vercel.app',
  })

  return (
    <main className="page-container">
      <section className="card">
        <div className="email-preview-header">
          <div>
            <p className="summary-eyebrow">Development Preview</p>
            <h1>Weekly Summary Email</h1>
          </div>
        </div>

        <div className="email-preview-frame">
          <iframe
            title="Weekly Summary Email Preview"
            srcDoc={html}
            style={{
              width: '100%',
              height: '900px',
              border: 'none',
              borderRadius: '14px',
              background: 'white',
            }}
          />
        </div>
      </section>
    </main>
  )
}

export default EmailPreview