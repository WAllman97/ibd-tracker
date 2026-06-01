import { useEffect, useState } from 'react'
import { calculateFlareRiskScore, getFlareRiskLabel } from '../utils/flareCalculations'

const initialForm = {
  date: '',
  pain: 0,
  bloating: 0,
  fatigue: 0,
  stress: 0,
  stool: 4,
  triggers: [],
  dayType: '',
  flareStatus: 'none',
  bloodMucus: 'none',
  keyFoods: '',
  notes: '',
}

const triggerOptions = [
  'Stress',
  'Poor sleep',
  'Alcohol',
  'Dairy',
  'Spicy food',
  'Travel',
  'Antibiotics',
  'High fibre',
  'Period',
]

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function getDefaultDayType(dateStr) {
  const date = new Date(dateStr)
  const day = date.getDay()

  return day >= 1 && day <= 5 ? 'work' : 'normal'
}

function ScoreSlider({
  label,
  name,
  value,
  onChange,
  leftLabel,
  rightLabel,
}) {
  return (
    <div className="quick-metric">
      <div className="metric-topline">
        <label htmlFor={name}>{label}</label>
        <strong>{value}/10</strong>
      </div>

      <input
        id={name}
        name={name}
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={onChange}
      />

      <div className="metric-scale">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}

function StoolSelector({ value, onChange }) {
  const scores = [1, 2, 3, 4, 5, 6, 7]

  return (
    <div className="quick-metric">
      <div className="metric-topline">
        <label>Stool score</label>
        <strong>{value}/7</strong>
      </div>

      <div className="stool-selector">
        {scores.map((score) => (
          <button
            key={score}
            type="button"
            className={Number(value) === score ? 'selected' : ''}
            onClick={() =>
              onChange({
                target: {
                  name: 'stool',
                  value: score,
                },
              })
            }
          >
            {score}
          </button>
        ))}
      </div>

      <div className="metric-scale">
        <span>Hard</span>
        <span>Loose</span>
      </div>
    </div>
  )
}

function SymptomForm({ entries, onAddEntry }) {
  const [formData, setFormData] = useState(initialForm)
  const [successMessage, setSuccessMessage] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const today = getToday()

    setFormData((prev) => ({
      ...prev,
      date: today,
      dayType: getDefaultDayType(today),
    }))
  }, [])

  function handleChange(e) {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleTriggerToggle(trigger) {
  setFormData((prev) => {
    const alreadySelected = prev.triggers.includes(trigger)

    return {
      ...prev,
      triggers: alreadySelected
        ? prev.triggers.filter((item) => item !== trigger)
        : [...prev.triggers, trigger],
    }
  })
}
  
  function handleDateChange(e) {
    const date = e.target.value

    setFormData((prev) => ({
      ...prev,
      date,
      dayType: getDefaultDayType(date),
    }))
  }

function getYesterday() {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date.toISOString().split('T')[0]
}

function duplicateYesterday() {
  if (!entries.length) {
    alert('No previous entries found')
    return
  }

  const yesterday = getYesterday()

  const yesterdayEntry = entries.find((entry) => entry.date === yesterday)

  if (!yesterdayEntry) {
    alert('No entry found for yesterday')
    return
  }

  const today = getToday()

  const {
    id,
    createdAt,
    updatedAt,
    ...entryWithoutMeta
  } = yesterdayEntry

  setFormData({
    ...entryWithoutMeta,
    date: today,
  })

  setShowDetails(true)
}
 
  function getQuickRead() {
    const total =
      Number(formData.pain) +
      Number(formData.bloating) +
      Number(formData.fatigue) +
      Number(formData.stress)

    if (
      formData.bloodMucus !== 'none' ||
      formData.flareStatus === 'severe'
    ) {
      return {
        label: 'Heightened flare risk',
        className: 'read-bad',
      }
    }

    if (total >= 22 || formData.flareStatus === 'moderate') {
      return {
        label: 'Elevated symptoms',
        className: 'read-amber',
      }
    }

    return {
      label: 'Symptoms stable',
      className: 'read-good',
    }
  }

  function resetForm() {
    const today = getToday()

    setFormData({
      ...initialForm,
      date: today,
      dayType: getDefaultDayType(today),
    })

    setShowDetails(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!formData.date) {
      alert('Please select a date')
      return
    }

    const existingEntryForDate = entries.find(
      (entry) => entry.date === formData.date
    )
    
    if (existingEntryForDate) {
      const shouldOverwrite = confirm(
        'An entry already exists for this date. Do you want to overwrite it?'
      )
    
      if (!shouldOverwrite) {
        return
      }
    }
    
    const result = await onAddEntry(formData)

    if (result && result.success === false) {
      alert('Please check the form before saving.')
      return
    }

    const score = calculateFlareRiskScore(formData)
    const label = getFlareRiskLabel(score)
    
    resetForm()
    
    setSuccessMessage(`✓ Entry saved — ${label}`)
    
    setTimeout(() => {
      setSuccessMessage('')
    }, 3000)
  }

  const quickRead = getQuickRead()

  return (
    <>
      {successMessage && (
        <div className="toast">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="symptom-form">
        <div className="form-intro">
          <div>
            <p className="eyebrow">Daily check-in</p>
            <h3>How are you feeling today?</h3>
          </div>

          <div className={`quick-read ${quickRead.className}`}>
            {quickRead.label}
          </div>
        </div>

        <div className="quick-action-card">
          <div>
            <p className="eyebrow">Quick action</p>
            <p>Copy yesterday's entry and make any changes.</p>
          </div>

          <button
            type="button"
            className="btn-secondary duplicate-yesterday-button"
            onClick={duplicateYesterday}
          >
            Duplicate Yesterday
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>

          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleDateChange}
            required
          />
        </div>
      <div className="section-heading">
        <h4>Quick check-in</h4>
        <p>Core daily symptoms — should take under a minute.</p>
      </div>
        
        <div className="quick-grid">
          <ScoreSlider
            label="Pain"
            name="pain"
            value={formData.pain}
            onChange={handleChange}
            leftLabel="None"
            rightLabel="Severe"
          />

          <ScoreSlider
            label="Bloating"
            name="bloating"
            value={formData.bloating}
            onChange={handleChange}
            leftLabel="None"
            rightLabel="Severe"
          />

          <ScoreSlider
            label="Fatigue"
            name="fatigue"
            value={formData.fatigue}
            onChange={handleChange}
            leftLabel="Fresh"
            rightLabel="Exhausted"
          />

          <ScoreSlider
            label="Stress"
            name="stress"
            value={formData.stress}
            onChange={handleChange}
            leftLabel="Calm"
            rightLabel="High"
          />

          <StoolSelector
            value={formData.stool}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label>Possible triggers</label>
        
          <div className="trigger-grid">
            {triggerOptions.map((trigger) => (
              <button
                key={trigger}
                type="button"
                className={
                  formData.triggers.includes(trigger)
                    ? 'trigger-chip selected'
                    : 'trigger-chip'
                }
                onClick={() => handleTriggerToggle(trigger)}
              >
                {trigger}
              </button>
            ))}
          </div>
        </div>
        
        <button
          type="button"
          className="details-toggle"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          {showDetails ? 'Hide details' : '+ Add more details'}
        </button>

        {showDetails && (
          <div className="details-panel">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="day-type">Day type</label>

                <select
                  id="day-type"
                  name="dayType"
                  value={formData.dayType}
                  onChange={handleChange}
                >
                  <option value="normal">Normal</option>
                  <option value="work">Work</option>
                  <option value="travel">Travel</option>
                  <option value="social">Social</option>
                  <option value="rest">Rest day</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="flare-status">Flare status</label>

                <select
                  id="flare-status"
                  name="flareStatus"
                  value={formData.flareStatus}
                  onChange={handleChange}
                >
                  <option value="none">None</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="blood-mucus">Blood / mucus</label>

                <select
                  id="blood-mucus"
                  name="bloodMucus"
                  value={formData.bloodMucus}
                  onChange={handleChange}
                >
                  <option value="none">None</option>
                  <option value="blood">Blood</option>
                  <option value="mucus">Mucus</option>
                  <option value="both">Blood and mucus</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="key-foods">Key foods</label>

                <textarea
                  id="key-foods"
                  name="keyFoods"
                  rows="2"
                  placeholder="e.g. oats, coffee, chicken, pasta"
                  value={formData.keyFoods}
                  onChange={handleChange}
                />
              </div>

              
              <div className="form-group full-width">
                <label htmlFor="notes">Notes</label>

                <textarea
                  id="notes"
                  name="notes"
                  rows="2"
                  placeholder="Anything unusual today?"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
        
          <button type="submit" className="btn-primary">
            Save form
          </button>
        
          <button
            type="button"
            className="btn-secondary"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </form>
    </>
  )
}

export default SymptomForm
