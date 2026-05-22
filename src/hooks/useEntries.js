import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'ibd_entries'
const MAX_ENTRIES = 365

function createId() {
  return `${Date.now()}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`
}

function toNumber(value, fallback = 0) {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

function normaliseEntry(data) {
  const now = new Date().toISOString()

  return {
    id: data.id || createId(),
    date: data.date || new Date().toISOString().slice(0, 10),

    bloating: toNumber(data.bloating),
    pain: toNumber(data.pain),
    stress: toNumber(data.stress),
    fatigue: toNumber(data.fatigue),
    stool: toNumber(data.stool),

    dayType: data.dayType || '',
    flareStatus: data.flareStatus || '',
    bloodMucus: data.bloodMucus || '',
    keyFoods: data.keyFoods || '',
    notes: data.notes || '',

    createdAt: data.createdAt || now,
    updatedAt: now,
  }
}

function validateEntry(entry) {
  const errors = {}

  if (!entry.date) {
    errors.date = 'Date is required'
  }

  const scoreFields = ['bloating', 'pain', 'stress', 'fatigue']

  scoreFields.forEach((field) => {
    if (entry[field] < 0 || entry[field] > 10) {
      errors[field] = `${field} must be between 0 and 10`
    }
  })

  if (entry.stool < 1 || entry.stool > 7) {
    errors.stool = 'Stool score must be between 1 and 7'
  }

  return errors
}

function sortEntries(entries) {
  return [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
}

function getEntriesFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []

    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed)) return []

    return sortEntries(parsed.map(normaliseEntry))
  } catch (error) {
    console.error('Failed to load entries from localStorage:', error)
    return []
  }
}

function saveEntriesToStorage(entries) {
  try {
    const entriesToSave = sortEntries(entries).slice(0, MAX_ENTRIES)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entriesToSave))
  } catch (error) {
    console.error('Failed to save entries to localStorage:', error)
  }
}

export function useEntries() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    setEntries(getEntriesFromStorage())
  }, [])

  const addEntry = (entryData) => {
    const newEntry = normaliseEntry(entryData)
    const validationErrors = validateEntry(newEntry)

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors)
      return { success: false, errors: validationErrors }
    }

    const existingIndex = entries.findIndex((entry) => entry.date === newEntry.date)

    let updatedEntries

    if (existingIndex !== -1) {
      updatedEntries = [...entries]
      updatedEntries[existingIndex] = {
        ...newEntry,
        id: entries[existingIndex].id,
        createdAt: entries[existingIndex].createdAt,
        updatedAt: new Date().toISOString(),
      }
    } else {
      updatedEntries = [...entries, newEntry]
    }

    const sorted = sortEntries(updatedEntries)

    setEntries(sorted)
    saveEntriesToStorage(sorted)
    setError(null)

    return { success: true, entry: newEntry }
  }

  const editEntry = (entryId, updates) => {
    const existingEntry = entries.find((entry) => entry.id === entryId)

    if (!existingEntry) {
      const errors = { id: 'Entry not found' }
      setError(errors)
      return { success: false, errors }
    }

    const updatedEntry = normaliseEntry({
      ...existingEntry,
      ...updates,
      id: existingEntry.id,
      createdAt: existingEntry.createdAt,
    })

    const validationErrors = validateEntry(updatedEntry)

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors)
      return { success: false, errors: validationErrors }
    }

    const updatedEntries = sortEntries(
      entries.map((entry) => (entry.id === entryId ? updatedEntry : entry))
    )

    setEntries(updatedEntries)
    saveEntriesToStorage(updatedEntries)
    setError(null)

    return { success: true, entry: updatedEntry }
  }

  const removeEntry = (entryId) => {
    const updatedEntries = entries.filter((entry) => entry.id !== entryId)

    setEntries(updatedEntries)
    saveEntriesToStorage(updatedEntries)
  }

  const clearAll = () => {
    setEntries([])
    localStorage.removeItem(STORAGE_KEY)
    setError(null)
  }

  const entriesByDate = useMemo(() => {
    return entries.reduce((acc, entry) => {
      acc[entry.date] = entry
      return acc
    }, {})
  }, [entries])

  return {
    entries,
    entriesByDate,
    error,
    addEntry,
    editEntry,
    removeEntry,
    clearAll,
  }
}