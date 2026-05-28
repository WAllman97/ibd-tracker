import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

import { generateWeeklySummary } from '../src/utils/generateWeeklySummary.js'
import { generateWeeklySummaryEmail } from '../src/utils/generateWeeklySummaryEmail.js'

export default async function handler(req, res) {
  try {
    const requiredEnvVars = [
      'RESEND_API_KEY',
      'RESEND_FROM_EMAIL',
      'VITE_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'CRON_SECRET',
    ]

    const missingEnvVars = requiredEnvVars.filter(
      (name) => !process.env[name]
    )

    if (missingEnvVars.length > 0) {
      return res.status(500).json({
        success: false,
        error: 'Missing environment variables',
        missingEnvVars,
      })
    }

    const authHeader = req.headers.authorization
    const cronSecret = process.env.CRON_SECRET

    const isCron = req.headers['user-agent']?.includes('vercel-cron')
    const isManualTest = authHeader === `Bearer ${cronSecret}`

    if (!isCron && !isManualTest) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const supabaseAdmin = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, username, weekly_email_enabled, weekly_email_address')
      .eq('weekly_email_enabled', true)

    if (profilesError) throw profilesError

    const results = []

    for (const profile of profiles) {
      const email = profile.weekly_email_address

      if (!email) {
        results.push({
          userId: profile.id,
          status: 'skipped',
          reason: 'No weekly email address',
        })
        continue
      }

      const { data: entries, error: entriesError } = await supabaseAdmin
        .from('entries')
        .select('*')
        .eq('user_id', profile.id)
        .order('date', { ascending: false })
        .limit(30)

      if (entriesError) {
        results.push({
          userId: profile.id,
          status: 'failed',
          reason: entriesError.message,
        })
        continue
      }

      const appEntries = entries.map((entry) => ({
        id: entry.id,
        date: entry.date,
        pain: entry.pain,
        bloating: entry.bloating,
        fatigue: entry.fatigue,
        stress: entry.stress,
        stool: entry.stool,
        triggers: entry.triggers || [],
        dayType: entry.day_type,
        flareStatus: entry.flare_status,
        bloodMucus: entry.blood_mucus,
        keyFoods: entry.key_foods,
        notes: entry.notes,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
      }))

      const summary = generateWeeklySummary(appEntries)

      const html = generateWeeklySummaryEmail(summary, {
        userName: profile.username || 'there',
        appUrl: process.env.APP_URL || 'https://ibd-tracker-xi.vercel.app',
      })

      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: [email],
        subject: 'Your weekly IBD summary',
        html,
      })

      if (error) {
        results.push({
          userId: profile.id,
          email,
          status: 'failed',
          reason: error.message,
        })
      } else {
        results.push({
          userId: profile.id,
          email,
          status: 'sent',
          emailId: data?.id,
        })
      }
    }

    return res.status(200).json({
      success: true,
      sent: results.filter((item) => item.status === 'sent').length,
      results,
    })
  } catch (error) {
    console.error('Weekly summary email error:', error)

    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}