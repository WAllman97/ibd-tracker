import { useState, useEffect } from 'react'
import { useEntries } from './hooks/useEntries'

import NavigationTabs from './components/NavigationTabs'
import CheckInView from './views/CheckInView'
import DashboardView from './views/DashboardView'
import HistoryView from './views/HistoryView'
import { supabase } from "./lib/supabaseClient";
import AuthForm from './components/AuthForm'
import ProfileSetup from './components/ProfileSetup'

import './App.css'

function App() {
  const { entries, addEntry, removeEntry, clearAll } = useEntries()

  const [activeTab, setActiveTab] = useState('checkin')
  const [filterDays, setFilterDays] = useState(7)
  const [session, setSession] = useState(null)

  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const fetchProfile = async (userId) => {
    setProfileLoading(true)

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) {
      console.log("PROFILE ERROR:", error)
      setProfile(null)
    } else {
      setProfile(data)
    }

    setProfileLoading(false)
  }

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)

      if (session) {
        fetchProfile(session.user.id)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)

      if (session) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

return (
  <div className="app">
    <header className="hero">
      <h1>IBD Symptom Tracker</h1>
      <p>Track symptoms, flare status, and daily health in one place.</p>

      {session && profile && (
        <div className="user-bar">
          <span>Welcome back, {profile.username}</span>

          <button
            className="logout-button"
            onClick={() => supabase.auth.signOut()}
          >
            Log out
          </button>
        </div>
      )}
    </header>

    {!session && <AuthForm />}

    {session && !profileLoading && !profile && (
      <ProfileSetup
        session={session}
        onProfileSaved={() => fetchProfile(session.user.id)}
      />
    )}

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

