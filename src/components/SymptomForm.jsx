import { useState, useEffect } from 'react'

/**
 * SymptomForm Component
 * 
 * Displays the form for entering daily symptoms.
 * 
 * Features:
 * - Auto-populate date with today
 * - Auto-set "Work" for weekdays, blank for weekends
 * - Auto-set Flare Status and Blood/Mucus to "none"
 * - Show success message after submit
 * - Reset form after submit
 * 
 * Props:
 * - onAddEntry: function called when form is submitted
 */

function SymptomForm({ onAddEntry }) {
  // Form state - each input field has its own state
  const [formData, setFormData] = useState({
    date: '',
    bloating: '',
    pain: '',
    stress: '',
    fatigue: '',
    stool: '',
    dayType: '',
    flareStatus: 'none',
    bloodMucus: 'none',
    keyFoods: '',
    notes: ''
  })

  const [showSuccess, setShowSuccess] = useState(false)

  /**
   * useEffect: Run once on component mount
   * Set today's date and auto-populate day type
   */
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setFormData(prev => ({
      ...prev,
      date: today,
      dayType: getDefaultDayType(today),
      flareStatus: 'none',
      bloodMucus: 'none'
    }))
  }, [])

  /**
   * Helper: Determine if date is a weekday
   * Returns "work" for Mon-Fri, empty string for weekends
   */
  function getDefaultDayType(dateStr) {
    const date = new Date(dateStr)
    const dayOfWeek = date.getDay() // 0=Sunday, 1=Monday, etc.
    return (dayOfWeek >= 1 && dayOfWeek <= 5) ? 'work' : ''
  }

  /**
   * Handle input changes
   * Updates state as user types/changes fields
   */
  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  /**
   * Handle date change
   * Also updates day type based on new date
   */
  function handleDateChange(e) {
    const newDate = e.target.value
    setFormData(prev => ({
      ...prev,
      date: newDate,
      dayType: getDefaultDayType(newDate)
    }))
  }

  /**
   * Handle form submission
   */
  function handleSubmit(e) {
    e.preventDefault() // Prevent page reload
    
    // Validate date is selected
    if (!formData.date) {
      alert('Please select a date')
      return
    }

    // Call parent component function with form data
    onAddEntry(formData)

    // Reset form
    const today = new Date().toISOString().split('T')[0]
    setFormData({
      date: today,
      bloating: '',
      pain: '',
      stress: '',
      fatigue: '',
      stool: '',
      dayType: getDefaultDayType(today),
      flareStatus: 'none',
      bloodMucus: 'none',
      keyFoods: '',
      notes: ''
    })

    // Show success message
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <>
      {/* Success message toast */}
      {showSuccess && (
        <div className="toast">
          ✓ Entry saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Date Input */}
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

          {/* Pain Input */}
          <div className="form-group">
            <label htmlFor="pain">Pain (0-10)</label>
            <input
              type="number"
              id="pain"
              name="pain"
              min="0"
              max="10"
              value={formData.pain}
              onChange={handleChange}
            />
          </div>

          {/* Bloating Input */}
          <div className="form-group">
            <label htmlFor="bloating">Bloating (0-10)</label>
            <input
              type="number"
              id="bloating"
              name="bloating"
              min="0"
              max="10"
              value={formData.bloating}
              onChange={handleChange}
            />
          </div>

          {/* Stress Input */}
          <div className="form-group">
            <label htmlFor="stress">Stress (0-10)</label>
            <input
              type="number"
              id="stress"
              name="stress"
              min="0"
              max="10"
              value={formData.stress}
              onChange={handleChange}
            />
          </div>

          {/* Fatigue Input */}
          <div className="form-group">
            <label htmlFor="fatigue">Fatigue (0-10)</label>
            <input
              type="number"
              id="fatigue"
              name="fatigue"
              min="0"
              max="10"
              value={formData.fatigue}
              onChange={handleChange}
            />
          </div>

          {/* Stool Score Input */}
          <div className="form-group">
            <label htmlFor="stool">Stool Score (1-7)</label>
            <input
              type="number"
              id="stool"
              name="stool"
              min="1"
              max="7"
              value={formData.stool}
              onChange={handleChange}
            />
          </div>

          {/* Day Type Select */}
          <div className="form-group">
            <label htmlFor="day-type">Day Type</label>
            <select
              id="day-type"
              name="dayType"
              value={formData.dayType}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="normal">Normal</option>
              <option value="work">Work</option>
              <option value="travel">Travel</option>
              <option value="social">Social</option>
              <option value="rest">Rest day</option>
            </select>
          </div>

          {/* Flare Status Select */}
          <div className="form-group">
            <label htmlFor="flare-status">Flare Status</label>
            <select
              id="flare-status"
              name="flareStatus"
              value={formData.flareStatus}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="none">None</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          {/* Blood/Mucus Select */}
          <div className="form-group">
            <label htmlFor="blood-mucus">Blood / Mucus</label>
            <select
              id="blood-mucus"
              name="bloodMucus"
              value={formData.bloodMucus}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="none">None</option>
              <option value="blood">Blood</option>
              <option value="mucus">Mucus</option>
              <option value="both">Blood and mucus</option>
            </select>
          </div>

          {/* Key Foods Textarea */}
          <div className="form-group full-width">
            <label htmlFor="key-foods">Key Foods Eaten</label>
            <textarea
              id="key-foods"
              name="keyFoods"
              rows="3"
              placeholder="e.g., oatmeal, banana, chicken"
              value={formData.keyFoods}
              onChange={handleChange}
            />
          </div>

          {/* Notes Textarea */}
          <div className="form-group full-width">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              placeholder="Any other observations..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Form Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Entry
          </button>
          <button type="reset" className="btn-secondary">
            Clear Form
          </button>
        </div>
      </form>
    </>
  )
}

export default SymptomForm
