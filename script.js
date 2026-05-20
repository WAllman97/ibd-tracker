// ============================================================================
// IBD Tracker - localStorage-based symptom tracking with flare warning logic
// ============================================================================

// Configuration
const STORAGE_KEY = "ibd_entries";
const FLARE_THRESHOLD = 50; // Warning triggers at 50+ risk score
const DAYS_TO_ANALYZE = 7; // Analyze last 7 days for trends

// ============================================================================
// DATA MODEL
// ============================================================================

class SymptomEntry {
  constructor(data) {
    this.id = Date.now().toString(); // Simple unique ID
    this.date = data.date;
    this.bloating = parseInt(data.bloating) || 0;
    this.pain = parseInt(data.pain) || 0;
    this.stress = parseInt(data.stress) || 0;
    this.fatigue = parseInt(data.fatigue) || 0;
    this.stool = parseInt(data.stool) || 0;
    this.dayType = data.dayType || "";
    this.flareStatus = data.flareStatus || "";
    this.bloodMucus = data.bloodMucus || "";
    this.keyFoods = data.keyFoods || "";
    this.notes = data.notes || "";
    this.createdAt = new Date().toISOString();
  }
}

// ============================================================================
// STORAGE OPERATIONS
// ============================================================================

function getEntries() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveEntry(entry) {
  const entries = getEntries();
  entries.push(entry);
  // Keep most recent 365 entries (1 year)
  if (entries.length > 365) {
    entries.shift();
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function deleteEntry(entryId) {
  let entries = getEntries();
  entries = entries.filter(e => e.id !== entryId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function clearAllEntries() {
  if (confirm("⚠️ This will permanently delete ALL entries. Are you sure?")) {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  }
  return false;
}

// ============================================================================
// FLARE WARNING CALCULATION
// ============================================================================

function calculateFlareRiskScore(entry) {
  let score = 0;

  // Pain score (0-25 points)
  if (entry.pain >= 8) score += 25;
  else if (entry.pain >= 6) score += 15;
  else if (entry.pain >= 4) score += 8;

  // Bloating score (0-20 points)
  if (entry.bloating >= 8) score += 20;
  else if (entry.bloating >= 6) score += 12;
  else if (entry.bloating >= 4) score += 6;

  // Flare status (0-20 points)
  if (entry.flareStatus === "severe") score += 20;
  else if (entry.flareStatus === "moderate") score += 12;
  else if (entry.flareStatus === "mild") score += 5;

  // Blood/Mucus (0-15 points)
  if (entry.bloodMucus === "both") score += 15;
  else if (entry.bloodMucus === "blood" || entry.bloodMucus === "mucus") score += 10;

  // Fatigue score (0-10 points)
  if (entry.fatigue >= 8) score += 10;
  else if (entry.fatigue >= 6) score += 6;

  // Stool abnormality (0-10 points)
  if (entry.stool <= 2 || entry.stool >= 6) score += 8;
  else if (entry.stool === 3 || entry.stool === 5) score += 4;

  return Math.min(score, 100); // Cap at 100
}

function analyzeTrends() {
  const entries = getEntries();
  if (entries.length === 0) return null;

  // Get entries from last N days
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - DAYS_TO_ANALYZE);

  const recentEntries = entries.filter(e => new Date(e.date) >= cutoffDate);
  if (recentEntries.length === 0) return null;

  // Calculate averages
  const avgPain = recentEntries.reduce((sum, e) => sum + e.pain, 0) / recentEntries.length;
  const avgBloating = recentEntries.reduce((sum, e) => sum + e.bloating, 0) / recentEntries.length;
  const avgFatigue = recentEntries.reduce((sum, e) => sum + e.fatigue, 0) / recentEntries.length;
  const flareCount = recentEntries.filter(e => e.flareStatus !== "none" && e.flareStatus !== "").length;
  const bloodPresent = recentEntries.some(e => e.bloodMucus !== "none" && e.bloodMucus !== "");

  // Calculate trend (increasing/decreasing)
  const latestScores = recentEntries.slice(-3).map(calculateFlareRiskScore);
  const trend = latestScores.length >= 2 && latestScores[latestScores.length - 1] > latestScores[0] ? "rising" : "stable";

  return {
    avgPain,
    avgBloating,
    avgFatigue,
    flareCount,
    bloodPresent,
    trend,
    daysAnalyzed: recentEntries.length
  };
}

function getWarningMessage() {
  const entries = getEntries();
  if (entries.length === 0) return null;

  const latestEntry = entries[entries.length - 1];
  const score = calculateFlareRiskScore(latestEntry);
  const trends = analyzeTrends();

  if (score < FLARE_THRESHOLD && (!trends || trends.trend === "stable")) {
    return null; // No warning
  }

  const warnings = [];
  const details = [];

  // Check for severe symptoms
  if (latestEntry.pain >= 8) {
    warnings.push("High pain levels detected");
    details.push(`• Pain score: ${latestEntry.pain}/10`);
  }

  if (latestEntry.bloating >= 8) {
    warnings.push("Significant bloating");
    details.push(`• Bloating score: ${latestEntry.bloating}/10`);
  }

  if (latestEntry.flareStatus === "severe" || latestEntry.flareStatus === "moderate") {
    warnings.push(`${latestEntry.flareStatus.charAt(0).toUpperCase() + latestEntry.flareStatus.slice(1)} flare detected`);
    details.push(`• Flare status: ${latestEntry.flareStatus}`);
  }

  if (latestEntry.bloodMucus !== "none" && latestEntry.bloodMucus !== "") {
    warnings.push(`Blood/mucus present: ${latestEntry.bloodMucus}`);
    details.push(`• Blood/Mucus: ${latestEntry.bloodMucus}`);
  }

  if (trends) {
    if (trends.trend === "rising" && score >= 25) {
      warnings.push("Symptoms trending upward");
      details.push(`• Trend: Rising over last ${trends.daysAnalyzed} days`);
    }

    if (trends.flareCount >= 3) {
      warnings.push(`Multiple flare days (${trends.flareCount} in last ${DAYS_TO_ANALYZE} days)`);
      details.push(`• Flare days: ${trends.flareCount}/${trends.daysAnalyzed}`);
    }
  }

  return warnings.length > 0 ? { message: warnings.join(" + "), score, details } : null;
}

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const form = document.getElementById("symptom-form");
const dateInput = document.getElementById("date");
const entriesTable = document.getElementById("entries-table");
const entriesBody = document.getElementById("entries-body");
const noEntriesMsg = document.getElementById("no-entries");
const filterDaysSelect = document.getElementById("filter-days");
const successMessage = document.getElementById("success-message");
const warningSection = document.getElementById("warning-section");
const warningMessage = document.getElementById("warning-message");
const warningDetails = document.getElementById("warning-details");
const exportBtn = document.getElementById("export-btn");
const clearAllBtn = document.getElementById("clear-all-btn");

// ============================================================================
// AUTO-POPULATE LOGIC
// ============================================================================

function autoPopulateByDate(dateStr) {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday

  // Set Day Type to "Work" for weekdays, leave blank for weekends
  document.getElementById("day-type").value = isWeekday ? "work" : "";

  // Auto-populate Flare Status and Blood/Mucus as "none"
  document.getElementById("flare-status").value = "none";
  document.getElementById("blood-mucus").value = "none";
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Set today's date as default and auto-populate fields
window.addEventListener("load", () => {
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;
  autoPopulateByDate(today);
  displayEntries();
  updateWarningDisplay();
});

// Auto-populate when date changes
dateInput.addEventListener("change", (e) => {
  autoPopulateByDate(e.target.value);
});

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const entry = new SymptomEntry({
    date: document.getElementById("date").value,
    bloating: document.getElementById("bloating").value,
    pain: document.getElementById("pain").value,
    stress: document.getElementById("stress").value,
    fatigue: document.getElementById("fatigue").value,
    stool: document.getElementById("stool").value,
    dayType: document.getElementById("day-type").value,
    flareStatus: document.getElementById("flare-status").value,
    bloodMucus: document.getElementById("blood-mucus").value,
    keyFoods: document.getElementById("key-foods").value,
    notes: document.getElementById("notes").value,
  });

  // Check for duplicate date
  const existingEntry = getEntries().find(e => e.date === entry.date);
  if (existingEntry) {
    const confirmed = confirm("An entry already exists for this date. Replace it?");
    if (!confirmed) return;
    deleteEntry(existingEntry.id);
  }

  saveEntry(entry);
  form.reset();
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  showSuccessMessage("Entry saved successfully!");
  displayEntries();
  updateWarningDisplay();
});

// Filter entries by date range
filterDaysSelect.addEventListener("change", displayEntries);

// Export CSV
exportBtn.addEventListener("click", exportToCSV);

// Clear all entries
clearAllBtn.addEventListener("click", () => {
  if (clearAllEntries()) {
    displayEntries();
    updateWarningDisplay();
    showSuccessMessage("All entries cleared.");
  }
});

// ============================================================================
// UI FUNCTIONS
// ============================================================================

function showSuccessMessage(msg) {
  successMessage.textContent = msg;
  successMessage.classList.remove("hidden");
  setTimeout(() => {
    successMessage.classList.add("hidden");
  }, 3000);
}

function updateWarningDisplay() {
  const warning = getWarningMessage();
  if (warning) {
    warningMessage.textContent = `Risk Score: ${warning.score}/100 - ${warning.message}`;
    warningDetails.innerHTML = warning.details.map(d => `<div>${d}</div>`).join("");
    warningSection.classList.remove("hidden");
  } else {
    warningSection.classList.add("hidden");
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
}

function getFlareStatusClass(status) {
  return `flare-${status || "none"}`;
}

function getScoreClass(score) {
  if (score >= 60) return "score-high";
  if (score >= 40) return "score-medium";
  return "score-low";
}

function displayEntries() {
  const entries = getEntries();
  const filterDays = filterDaysSelect.value;

  let filteredEntries = entries;
  if (filterDays !== "all") {
    const days = parseInt(filterDays);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    filteredEntries = entries.filter(e => new Date(e.date) >= cutoffDate);
  }

  // Sort by date descending (newest first)
  filteredEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filteredEntries.length === 0) {
    noEntriesMsg.classList.remove("hidden");
    entriesTable.classList.add("hidden");
  } else {
    noEntriesMsg.classList.add("hidden");
    entriesTable.classList.remove("hidden");

    entriesBody.innerHTML = filteredEntries
      .map(entry => {
        const score = calculateFlareRiskScore(entry);
        const scoreClass = getScoreClass(score);
        const flareClass = getFlareStatusClass(entry.flareStatus);
        const foodsDisplay = entry.keyFoods ? entry.keyFoods.substring(0, 30) + (entry.keyFoods.length > 30 ? "..." : "") : "—";
        const notesDisplay = entry.notes ? entry.notes.substring(0, 30) + (entry.notes.length > 30 ? "..." : "") : "—";

        return `
          <tr>
            <td>${formatDate(entry.date)}</td>
            <td class="${scoreClass}">${entry.pain}/10</td>
            <td class="${scoreClass}">${entry.bloating}/10</td>
            <td><span class="${flareClass}">${entry.flareStatus || "—"}</span></td>
            <td>${entry.stool}/7</td>
            <td title="${entry.keyFoods}">${foodsDisplay}</td>
            <td title="${entry.notes}">${notesDisplay}</td>
            <td>
              <button class="btn-delete" onclick="handleDelete('${entry.id}')">Delete</button>
            </td>
          </tr>
        `;
      })
      .join("");
  }
}

function handleDelete(entryId) {
  if (confirm("Delete this entry?")) {
    deleteEntry(entryId);
    displayEntries();
    updateWarningDisplay();
    showSuccessMessage("Entry deleted.");
  }
}

function exportToCSV() {
  const entries = getEntries();
  if (entries.length === 0) {
    alert("No entries to export.");
    return;
  }

  // CSV header
  const headers = [
    "Date",
    "Pain (0-10)",
    "Bloating (0-10)",
    "Stress (0-10)",
    "Fatigue (0-10)",
    "Stool Score (1-7)",
    "Day Type",
    "Flare Status",
    "Blood/Mucus",
    "Key Foods",
    "Notes",
    "Risk Score"
  ];

  // CSV rows
  const rows = entries.map(e => [
    e.date,
    e.pain,
    e.bloating,
    e.stress,
    e.fatigue,
    e.stool,
    e.dayType,
    e.flareStatus,
    e.bloodMucus,
    `"${e.keyFoods}"`, // Quote to handle commas
    `"${e.notes}"`,
    calculateFlareRiskScore(e)
  ]);

  // Format CSV
  const csv =
    [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

  // Download
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `IBD-Tracker-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showSuccessMessage("CSV exported successfully!");
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// All initialization happens in the load event listener above
