import { useState } from 'react'
import { useEntries } from './hooks/useEntries'

import NavigationTabs from './components/NavigationTabs'
import CheckInView from './views/CheckInView'
import DashboardView from './views/DashboardView'
import HistoryView from './views/HistoryView'

import './App.css'

function App() {
  const { entries, addEntry, removeEntry, clearAll } = useEntries()

  const [activeTab, setActiveTab] = useState('checkin')
  const [filterDays, setFilterDays] = useState(7)

  const handleAddEntry = (newEntry) => {
    addEntry(newEntry)
    setActiveTab('dashboard')
  }

  const handleDeleteEntry = (entryId) => {
    if (confirm('Delete this entry?')) {
      removeEntry(entryId)
    }
  }

  const handleClearAll = () => {
    if (confirm('⚠️ This will permanently delete ALL entries. Are you sure?')) {
      clearAll()
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>IBD Symptom Tracker</h1>
        <p>Track symptoms, flare status, and daily health in one place.</p>
      </header>

      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container">
        {activeTab === 'checkin' && (
          <CheckInView entries={entries} onAddEntry={handleAddEntry} />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView entries={entries} />
        )}

        {activeTab === 'history' && (
          <HistoryView
            entries={entries}
            filterDays={filterDays}
            setFilterDays={setFilterDays}
            onDeleteEntry={handleDeleteEntry}
            onClearAll={handleClearAll}
          />
        )}
      </main>

      <footer>
        Created as a learning project. Data stored locally in your browser.
      </footer>
    </div>
  )
}

export default App
