import { supabase } from '../lib/supabaseClient'

function toAppEntry(row) {
  return {
    id: row.id,
    date: row.date,
    bloating: row.bloating,
    pain: row.pain,
    stress: row.stress,
    fatigue: row.fatigue,
    stool: row.stool,
    dayType: row.day_type,
    flareStatus: row.flare_status,
    bloodMucus: row.blood_mucus,
    keyFoods: row.key_foods,
    notes: row.notes,
    triggers: row.triggers || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toDbEntry(entry, userId) {
  return {
    id: entry.id,
    user_id: userId,
    date: entry.date,
    bloating: entry.bloating,
    pain: entry.pain,
    stress: entry.stress,
    fatigue: entry.fatigue,
    stool: entry.stool,
    day_type: entry.dayType,
    flare_status: entry.flareStatus,
    blood_mucus: entry.bloodMucus,
    key_foods: entry.keyFoods,
    notes: entry.notes,
    triggers: entry.triggers || [],
    updated_at: new Date().toISOString(),
  }
}

export async function fetchEntries(userId) {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) throw error

  return data.map(toAppEntry)
}

export async function saveEntry(entry, userId) {
  const dbEntry = toDbEntry(entry, userId)

  const { data, error } = await supabase
    .from('entries')
    .upsert(dbEntry, {
      onConflict: 'user_id,date',
    })
    .select()
    .single()

  if (error) throw error

  return toAppEntry(data)
}

export async function deleteEntry(entryId) {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', entryId)

  if (error) throw error
}

export async function clearEntries(userId) {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('user_id', userId)

  if (error) throw error
}