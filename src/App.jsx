import { useState, useEffect } from 'react'
import SymptomForm from './components/SymptomForm'
import DashboardSummary from './components/DashboardSummary'
import WarningAlert from './components/WarningAlert'
import EntryHistory from './components/EntryHistory'
import ExportButton from './components/ExportButton'
import { useEntries } from './hooks/useEntries'

/**
 * App Component - Main container for the entire app
 * 
 * This component:
 * - Manages all entry data using the useEntries hook
 * - Passes data and functions to child components via props
 * - Handles the overall layout (header, sections, footer)
 */
function App() {
  // useEntries hook manages all localStorage operations
  // Returns: entries (array), addEntry, removeEntry, clearAll functions
  const { entries, addEntry, removeEntry, clearAll } = useEntries()

  // Local state for filtering entries by date range
  const [filterDays, setFilterDays] = useState(7)

  /**
   * Handle new entry submission from form
   * Called when SymptomForm is submitted
   */
  const handleAddEntry = (newEntry) => {
    addEntry(newEntry)
  }

  /**
   * Handle delete from history table
   */
  const handleDeleteEntry = (entryId) => {
    if (confirm('Delete this entry?')) {
      removeEntry(entryId)
    }
  }

  /**
   * Handle clear all data
   */
  const handleClearAll = () => {
    if (confirm('⚠️ This will permanently delete ALL entries. Are you sure?')) {
      clearAll()
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="hero">
        <h1>IBD Symptom Tracker</h1>
        <p>Track symptoms, flare status, and daily health in one place.</p>
      </header>

      {/* Main content area */}
      <main className="container">
        {/* Flare warning alert - shows if risk score is high */}
        <WarningAlert entries={entries} />

        {/* Daily symptom entry form */}
        <section className="card">
          <h2>Daily Check-In</h2>
          <SymptomForm entries={entries} onAddEntry={handleAddEntry} />
        </section>

        {/* Summary dashboard cards - shows stats at a glance */}
        <DashboardSummary entries={entries} />

        {/* Medical advice card */}
        <section className="card warning-info">
          <h2>When to Seek Help</h2>
          <p>
            Seek immediate medical advice if: severe pain, heavy bleeding, fever, or
            significant changes in symptoms occur.
          </p>
        </section>

        {/* Entry history table and export controls */}
        <section className="card">
          <div className="history-header">
            <h2>Your Entry History</h2>
            <div className="history-controls">
              <label htmlFor="filter-days">Show last:</label>
              <select 
                id="filter-days"
                value={filterDays} 
                onChange={(e) => setFilterDays(parseInt(e.target.value))}
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={999}>All entries</option>
              </select>
            </div>
          </div>
          <EntryHistory 
            entries={entries} 
            filterDays={filterDays}
            onDeleteEntry={handleDeleteEntry}
          />
        </section>

        {/* Data management controls */}
        <section className="card">
          <h2>Data Management</h2>
          <div className="data-actions">
            <ExportButton entries={entries} />
            <button 
              className="btn-danger"
              onClick={handleClearAll}
            >
              🗑️ Clear All Data
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <p>Created as a learning project. Data stored locally in your browser.</p>
      </footer>
    </div>
  )
}

export default App
