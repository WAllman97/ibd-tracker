import { useEffect, useMemo, useState } from 'react'
import {
  fetchEntries,
  saveEntry,
  deleteEntry,
  clearEntries,
} from '../services/entriesService'

const MAX_ENTRIES = 365

function createId() {
  return crypto.randomUUID()
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
    stool: toNumber(data.stool, 4),
    dayType: data.dayType || '',
    flareStatus: data.flareStatus || 'none',
    bloodMucus: data.bloodMucus || 'none',
    keyFoods: data.keyFoods || '',
    notes: data.notes || '',
    triggers: Array.isArray(data.triggers) ? data.triggers : [],
    createdAt: data.createdAt || now,
    updatedAt: now,
  }
}

function sortEntries(entries) {
  return [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function useEntries(user) {
  const [entries, setEntries] = useState([])
  const [loadingEntries, setLoadingEntries] = useState(false)
  const [entriesError, setEntriesError] = useState('')

  useEffect(() => {
    async function loadEntries() {
      if (!user) {
        setEntries([])
        return
      }

      setLoadingEntries(true)
      setEntriesError('')

      try {
        const cloudEntries = await fetchEntries(user.id)
        setEntries(sortEntries(cloudEntries).slice(0, MAX_ENTRIES))
      } catch (error) {
        console.error('Failed to load entries:', error)
        setEntriesError('Could not load entries.')
      } finally {
        setLoadingEntries(false)
      }
    }

    loadEntries()
  }, [user])

  const addEntry = async (entryData) => {
    if (!user) {
      return { success: false, error: 'User not logged in' }
    }

    const newEntry = normaliseEntry(entryData)

    try {
      const savedEntry = await saveEntry(newEntry, user.id)

      const existingIndex = entries.findIndex(
        (entry) => entry.date === savedEntry.date
      )

      let updatedEntries

      if (existingIndex !== -1) {
        updatedEntries = [...entries]
        updatedEntries[existingIndex] = savedEntry
      } else {
        updatedEntries = [...entries, savedEntry]
      }

      const sortedEntries = sortEntries(updatedEntries).slice(0, MAX_ENTRIES)
      setEntries(sortedEntries)

      return { success: true, entry: savedEntry }
    } catch (error) {
      console.error('Failed to save entry:', error)
      return { success: false, error }
    }
  }

  const editEntry = async (entryId, updates) => {
    if (!user) {
      return { success: false, error: 'User not logged in' }
    }

    const existingEntry = entries.find((entry) => entry.id === entryId)

    if (!existingEntry) {
      return { success: false, error: 'Entry not found' }
    }

    const updatedEntry = normaliseEntry({
      ...existingEntry,
      ...updates,
      id: existingEntry.id,
      createdAt: existingEntry.createdAt,
    })

    try {
      const savedEntry = await saveEntry(updatedEntry, user.id)

      const updatedEntries = sortEntries(
        entries.map((entry) =>
          entry.id === entryId ? savedEntry : entry
        )
      )

      setEntries(updatedEntries)

      return { success: true }
    } catch (error) {
      console.error('Failed to edit entry:', error)
      return { success: false, error }
    }
  }

  const removeEntry = async (entryId) => {
    try {
      await deleteEntry(entryId)
      setEntries((prev) => prev.filter((entry) => entry.id !== entryId))
    } catch (error) {
      console.error('Failed to delete entry:', error)
    }
  }

  const clearAll = async () => {
    if (!user) return

    try {
      await clearEntries(user.id)
      setEntries([])
    } catch (error) {
      console.error('Failed to clear entries:', error)
    }
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
    addEntry,
    editEntry,
    removeEntry,
    clearAll,
    loadingEntries,
    entriesError,
  }
}