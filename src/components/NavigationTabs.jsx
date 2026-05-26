function NavigationTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'checkin', label: 'Check-In' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'history', label: 'History' },
  ]

  return (
    <nav className="navigation-tabs" aria-label="Main navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export default NavigationTabs
