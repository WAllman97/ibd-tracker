import { useState, useEffect } from 'react'
import { useEntries } from './hooks/useEntries'

import NavigationTabs from './components/NavigationTabs'
import CheckInView from './views/CheckInView'
import DashboardView from './views/DashboardView'
import HistoryView from './views/HistoryView'
import { supabase } from './lib/supabaseClient'
import AuthForm from './components/AuthForm'
import ProfileSetup from './components/ProfileSetup'
import Settings from './views/Settings'
import EmailPreview from './views/EmailPreview'
import Onboarding from './views/Onboarding'

import './App.css'

function App() {
  const [session, setSession] = useState(null)

  const {
    entries,
    addEntry,
    removeEntry,
    clearAll,
    loadingEntries,
    entriesError,
  } = useEntries(session?.user)

  const [activeTab, setActiveTab] = useState('checkin')
  const [filterDays, setFilterDays] = useState(7)

  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const safeEntries = entries || []

  const fetchProfile = async (userId) => {
    setProfileLoading(true)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.log('PROFILE ERROR:', error)
      setProfile(null)
    } else {
      setProfile(data)
    }

    setProfileLoading(false)
  }

  async function handleOnboardingComplete() {
    if (!session?.user?.id) return

    const { error } = await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', session.user.id)

    if (error) {
      console.error('Error completing onboarding:', error)
      return
    }

    setProfile((currentProfile) => ({
      ...currentProfile,
      onboarding_completed: true,
    }))

    setActiveTab('checkin')
  }

  const handleAddEntry = async (newEntry) => {
    const result = await addEntry(newEntry)

    if (result?.success) {
      setActiveTab('dashboard')
    }
  }

  const handleDeleteEntry = async (entryId) => {
    if (confirm('Delete this entry?')) {
      await removeEntry(entryId)
    }
  }

  const handleClearAll = async () => {
    if (confirm('⚠️ This will permanently delete ALL entries. Are you sure?')) {
      await clearAll()
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

  const hasCompletedOnboarding = profile?.onboarding_completed === true

  // FULLSCREEN ONBOARDING
  if (session && profile && !hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

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

      {session && profile && hasCompletedOnboarding && (
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      <main className="container">
        {loadingEntries && (
          <p className="helper-text">Loading your entries...</p>
        )}

        {entriesError && (
          <p className="error-text">{entriesError}</p>
        )}

        {session &&
          profile &&
          hasCompletedOnboarding &&
          !loadingEntries &&
          activeTab === 'checkin' && (
            <CheckInView
              entries={safeEntries}
              onAddEntry={handleAddEntry}
            />
          )}

        {session &&
          profile &&
          hasCompletedOnboarding &&
          !loadingEntries &&
          activeTab === 'dashboard' && (
            <DashboardView entries={safeEntries} />
          )}

        {session &&
          profile &&
          hasCompletedOnboarding &&
          !loadingEntries &&
          activeTab === 'history' && (
            <HistoryView
              entries={safeEntries}
              filterDays={filterDays}
              setFilterDays={setFilterDays}
              onDeleteEntry={handleDeleteEntry}
              onClearAll={handleClearAll}
            />
          )}

        {session &&
          profile &&
          hasCompletedOnboarding &&
          !loadingEntries &&
          activeTab === 'settings' && (
            <Settings user={session.user} />
          )}

        {session &&
          profile &&
          hasCompletedOnboarding &&
          !loadingEntries &&
          activeTab === 'email-preview' && (
            <EmailPreview entries={safeEntries} />
          )}
      </main>

      <footer>
        Created as a learning project. Data securely stored in the cloud.
      </footer>
    </div>
  )
}

export default App