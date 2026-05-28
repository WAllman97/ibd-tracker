import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
import { Resend } from 'resend'

import { generateWeeklySummary } from './src/utils/generateWeeklySummary.js'
import { generateWeeklySummaryEmail } from './src/utils/generateWeeklySummaryEmail.js'

const resend = new Resend(process.env.RESEND_API_KEY)

const testEntries = [
  { date: '2026-05-22', pain: 2, bloating: 3, fatigue: 2, stress: 1, stool: 4, triggers: ['Poor sleep'], flareStatus: 'none', bloodMucus: 'none' },
  { date: '2026-05-23', pain: 1, bloating: 2, fatigue: 1, stress: 1, stool: 4, triggers: [], flareStatus: 'none', bloodMucus: 'none' },
  { date: '2026-05-24', pain: 2, bloating: 3, fatigue: 2, stress: 2, stool: 5, triggers: ['Alcohol'], flareStatus: 'none', bloodMucus: 'none' },
  { date: '2026-05-25', pain: 1, bloating: 2, fatigue: 2, stress: 1, stool: 4, triggers: [], flareStatus: 'none', bloodMucus: 'none' },
  { date: '2026-05-26', pain: 2, bloating: 2, fatigue: 3, stress: 1, stool: 4, triggers: ['Poor sleep'], flareStatus: 'none', bloodMucus: 'none' },
  { date: '2026-05-27', pain: 1, bloating: 3, fatigue: 2, stress: 1, stool: 4, triggers: ['Alcohol'], flareStatus: 'none', bloodMucus: 'none' },
  { date: '2026-05-28', pain: 1, bloating: 2, fatigue: 2, stress: 0, stool: 4, triggers: [], flareStatus: 'none', bloodMucus: 'none' },
]

const summary = generateWeeklySummary(testEntries)

const html = generateWeeklySummaryEmail(summary, {
  userName: 'Will',
  appUrl: 'https://ibd-tracker-xi.vercel.app',
})

const result = await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL,
  to: ['will.allman97@gmail.com'],
  subject: 'Test weekly IBD summary',
  html,
})

console.log(result)