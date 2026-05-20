import { useState, useEffect } from 'react'

/**
 * Custom Hook: useEntries
 * 
 * This hook manages all localStorage operations for your entries.
 * Think of it like the old JavaScript functions but as a React hook.
 * 
 * It handles:
 * - Reading entries from localStorage
 * - Adding new entries
 * - Deleting entries
 * - Clearing all entries
 * 
 * Hooks always start with "use" prefix (React convention)
 */

const STORAGE_KEY = 'ibd_entries'

// Class definition for creating new entry objects
class SymptomEntry {
  constructor(data) {
    this.id = Date.now().toString() // Unique ID based on timestamp
    this.date = data.date
    this.bloating = parseInt(data.bloating) || 0
    this.pain = parseInt(data.pain) || 0
    this.stress = parseInt(data.stress) || 0
    this.fatigue = parseInt(data.fatigue) || 0
    this.stool = parseInt(data.stool) || 0
    this.dayType = data.dayType || ''
    this.flareStatus = data.flareStatus || ''
    this.bloodMucus = data.bloodMucus || ''
    this.keyFoods = data.keyFoods || ''
    this.notes = data.notes || ''
    this.createdAt = new Date().toISOString()
  }
}

/**
 * Helper functions for localStorage operations
 */

function getEntriesFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

function saveEntriesToStorage(entries) {
  // Keep only last 365 entries
  const entriesToSave = entries.slice(-365)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entriesToSave))
}

/**
 * Main hook function
 * Returns: object with entries array and functions to modify it
 */
export function useEntries() {
  // State: array of entries currently in memory
  const [entries, setEntries] = useState([])

  // useEffect: Run once when component mounts (loads page)
  // Load entries from localStorage into React state
  useEffect(() => {
    const storedEntries = getEntriesFromStorage()
    setEntries(storedEntries)
  }, []) // Empty dependency array = run only once on mount

  /**
   * Add new entry
   * - Create entry object
   * - Check for duplicate date
   * - Update state and localStorage
   */
  const addEntry = (entryData) => {
    const newEntry = new SymptomEntry(entryData)
    
    // Check if entry already exists for this date
    const existingIndex = entries.findIndex(e => e.date === newEntry.date)
    
    let updatedEntries
    if (existingIndex !== -1) {
      // Replace existing entry
      updatedEntries = [...entries]
      updatedEntries[existingIndex] = newEntry
    } else {
      // Add new entry
      updatedEntries = [...entries, newEntry]
    }
    
    setEntries(updatedEntries)
    saveEntriesToStorage(updatedEntries)
  }

  /**
   * Remove entry by ID
   */
  const removeEntry = (entryId) => {
    const updatedEntries = entries.filter(e => e.id !== entryId)
    setEntries(updatedEntries)
    saveEntriesToStorage(updatedEntries)
  }

  /**
   * Clear all entries
   */
  const clearAll = () => {
    setEntries([])
    localStorage.removeItem(STORAGE_KEY)
  }

  // Return object with state and functions
  return {
    entries,
    addEntry,
    removeEntry,
    clearAll
  }
}
