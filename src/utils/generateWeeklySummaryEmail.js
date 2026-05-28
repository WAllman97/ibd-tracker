function formatTriggerList(triggers) {
  if (!triggers || triggers.length === 0) {
    return '<p style="margin:0;color:#6b7280;">No recurring triggers logged this week.</p>'
  }

  return `
    <ul style="margin:0;padding-left:18px;color:#374151;">
      ${triggers
        .map(
          (item) =>
            `<li>${item.trigger} — ${item.count} time${
              item.count === 1 ? '' : 's'
            }</li>`
        )
        .join('')}
    </ul>
  `
}

function formatComparisonRows(comparisons) {
  return comparisons
    .map((item) => {
      const directionText =
        item.direction === 'improved'
          ? 'Improved'
          : item.direction === 'worsened'
            ? 'Higher'
            : 'Stable'

      return `
        <tr>
          <td style="padding:10px 0;text-transform:capitalize;color:#111827;font-weight:600;">
            ${item.field}
          </td>
          <td style="padding:10px 0;color:#374151;text-align:right;">
            ${item.sevenDayAverage}/10
          </td>
          <td style="padding:10px 0;color:#374151;text-align:right;">
            ${item.thirtyDayAverage}/10
          </td>
          <td style="padding:10px 0;color:#374151;text-align:right;">
            ${directionText}
          </td>
        </tr>
      `
    })
    .join('')
}

export function generateWeeklySummaryEmail(summary, options = {}) {
  const appUrl = options.appUrl || 'https://ibd-tracker-xi.vercel.app'
  const userName = options.userName || 'there'

  if (!summary || !summary.ready) {
    return `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827;">
        <h1 style="margin:0 0 12px;">Your weekly IBD summary</h1>
        <p style="line-height:1.5;color:#374151;">
          Hi ${userName}, we need a few more check-ins before we can generate a useful weekly summary.
        </p>
        <p style="line-height:1.5;color:#374151;">
          Log at least 3 days to start seeing weekly trends.
        </p>
        <a href="${appUrl}" style="display:inline-block;margin-top:16px;background:#2563eb;color:white;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;">
          Open IBD Tracker
        </a>
      </div>
    `
  }

  return `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">
        <div style="max-width:680px;margin:0 auto;padding:24px;">
          <div style="background:white;border-radius:18px;padding:28px;border:1px solid #e5e7eb;">
            
            <p style="margin:0 0 8px;color:#2563eb;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">
              Weekly insight
            </p>

            <h1 style="margin:0 0 12px;font-size:26px;line-height:1.2;">
              Your weekly IBD summary
            </h1>

            <p style="margin:0 0 22px;color:#374151;line-height:1.6;">
              Hi ${userName}, ${summary.message}
            </p>

            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;">
              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:14px;">
                <p style="margin:0;font-size:22px;font-weight:700;">${summary.daysLogged}/7</p>
                <p style="margin:4px 0 0;color:#6b7280;font-size:13px;">Days logged</p>
              </div>

              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:14px;">
                <p style="margin:0;font-size:22px;font-weight:700;">${summary.elevatedDays}</p>
                <p style="margin:4px 0 0;color:#6b7280;font-size:13px;">Elevated-risk days</p>
              </div>

              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:14px;">
                <p style="margin:0;font-size:22px;font-weight:700;">${summary.flareDays}</p>
                <p style="margin:4px 0 0;color:#6b7280;font-size:13px;">Flare days</p>
              </div>
            </div>

            <h2 style="font-size:18px;margin:0 0 10px;">7-day vs 30-day average</h2>

            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <thead>
                <tr>
                  <th style="text-align:left;padding-bottom:8px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;">Metric</th>
                  <th style="text-align:right;padding-bottom:8px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;">7-day</th>
                  <th style="text-align:right;padding-bottom:8px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;">30-day</th>
                  <th style="text-align:right;padding-bottom:8px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;">Change</th>
                </tr>
              </thead>

              <tbody>
                ${formatComparisonRows(summary.comparisons)}
              </tbody>
            </table>

            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin-bottom:22px;">
              <h2 style="font-size:18px;margin:0 0 10px;">Most common triggers</h2>
              ${formatTriggerList(summary.mostCommonTriggers)}
            </div>

            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:16px;margin-bottom:24px;">
              <h2 style="font-size:18px;margin:0 0 8px;color:#166534;">Doctor note</h2>
              <p style="margin:0;color:#166534;line-height:1.5;">
                ${summary.doctorNote}
              </p>
            </div>

            <a href="${appUrl}" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;">
              Open dashboard
            </a>

            <p style="margin:24px 0 0;color:#6b7280;font-size:12px;line-height:1.5;">
              This summary is based on your self-reported check-ins and is not medical advice.
              If symptoms are severe, worsening, or concerning, contact a healthcare professional.
            </p>
          </div>

          <p style="text-align:center;color:#9ca3af;font-size:12px;margin:18px 0 0;">
            You are receiving this because weekly summaries are enabled in your IBD Tracker settings.
          </p>
        </div>
      </body>
    </html>
  `
}