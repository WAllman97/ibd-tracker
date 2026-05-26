import EntryHistory from '../components/EntryHistory'
import ExportButton from '../components/ExportButton'

function HistoryView({
  entries,
  filterDays,
  setFilterDays,
  onDeleteEntry,
  onClearAll,
}) {
  return (
    <>
      <section className="card">
        <div className="history-header">
          <div>
            <h2>Your Entry History</h2>
          </div>

          <div className="history-controls">
            <label htmlFor="filterDays">Show last:</label>
            <select
              id="filterDays"
              value={filterDays}
              onChange={(event) => setFilterDays(Number(event.target.value))}
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={365}>All entries</option>
            </select>
          </div>
        </div>

        <EntryHistory
          entries={entries}
          filterDays={filterDays}
          onDeleteEntry={onDeleteEntry}
        />
      </section>

      <section className="card">
        <h2>Data Management</h2>
        <div className="data-actions">
          <ExportButton entries={entries} />
          <button className="btn-danger" onClick={onClearAll}>
            Clear All Data
          </button>
        </div>
      </section>
    </>
  )
}

export default HistoryView
