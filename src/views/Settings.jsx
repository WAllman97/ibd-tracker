import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Settings({ user }) {
  const [settings, setSettings] = useState({
    weekly_email_enabled: false,
    weekly_email_day: "Sunday",
    weekly_email_address: "",
    weekly_email_detail_level: "standard",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    async function loadSettings() {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "weekly_email_enabled, weekly_email_day, weekly_email_address, weekly_email_detail_level"
        )
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading settings:", error);
      }

      if (data) {
        setSettings({
          weekly_email_enabled: data.weekly_email_enabled ?? false,
          weekly_email_day: data.weekly_email_day ?? "Sunday",
          weekly_email_address: data.weekly_email_address ?? user.email ?? "",
          weekly_email_detail_level:
            data.weekly_email_detail_level ?? "standard",
        });
      }

      setLoading(false);
    }

    loadSettings();
  }, [user]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSave(event) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({
        weekly_email_enabled: settings.weekly_email_enabled,
        weekly_email_day: settings.weekly_email_day,
        weekly_email_address: settings.weekly_email_address,
        weekly_email_detail_level: settings.weekly_email_detail_level,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error saving settings:", error);
      setMessage("Could not save settings. Please try again.");
    } else {
      setMessage("Settings saved.");
    }

    setSaving(false);
  }

  if (loading) {
    return <p className="muted-text">Loading settings...</p>;
  }

  return (
    <main className="page-container">
      <section className="card">
        <h1>Settings</h1>
        <p className="muted-text">
          Manage your weekly summary email and communication preferences.
        </p>

        <form onSubmit={handleSave} className="settings-form">
          <label className="checkbox-row">
            <input
              type="checkbox"
              name="weekly_email_enabled"
              checked={settings.weekly_email_enabled}
              onChange={handleChange}
            />
            Send me a weekly symptom summary email
          </label>

          <label>
            Email address
            <input
              type="email"
              name="weekly_email_address"
              value={settings.weekly_email_address}
              onChange={handleChange}
              placeholder={user?.email || "you@example.com"}
            />
          </label>

          <label>
            Summary day
            <select
              name="weekly_email_day"
              value={settings.weekly_email_day}
              onChange={handleChange}
            >
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
            </select>
          </label>

          <label>
            Summary detail level
            <select
              name="weekly_email_detail_level"
              value={settings.weekly_email_detail_level}
              onChange={handleChange}
            >
              <option value="standard">Standard</option>
              <option value="brief">Brief</option>
            </select>
          </label>

          <p className="privacy-note">
            Weekly emails may include health-related information. You can turn
            them off at any time.
          </p>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save settings"}
          </button>

          {message && <p className="form-message">{message}</p>}
        </form>
      </section>
    </main>
  );
}