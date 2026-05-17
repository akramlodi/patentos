"use client";
import { useState } from "react";
import { sampleUser } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? "bg-indigo-500" : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(sampleUser);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    lowStock: true,
    paymentReminders: true,
    patentDeadlines: true,
  });

  const handleDarkMode = (v: boolean) => {
    setDarkMode(v);
    if (v) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const saveProfile = () => {
    toast.success("Profile updated!");
  };

  const resetData = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Section 1: Business Profile */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-5">Business Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Business Name", field: "businessName" },
            { label: "Owner Name", field: "ownerName" },
            { label: "Email", field: "email" },
            { label: "Phone", field: "phone" },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
              <input
                type="text"
                value={profile[field as keyof typeof profile]}
                onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">GST Number</label>
            <input
              type="text"
              value={profile.gst}
              onChange={(e) => setProfile({ ...profile, gst: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
            />
          </div>
        </div>
        <button
          onClick={saveProfile}
          className="mt-5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
        >
          Save Changes
        </button>
      </section>

      {/* Section 2: Appearance */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-5">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">Dark Mode</p>
            <p className="text-xs text-slate-500 mt-0.5">Switch to a darker color scheme</p>
          </div>
          <Toggle checked={darkMode} onChange={handleDarkMode} />
        </div>
      </section>

      {/* Section 3: Notifications */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-5">Notifications</h3>
        <div className="space-y-4">
          {[
            { key: "lowStock" as const, label: "Low stock alerts", desc: "Get notified when products run low" },
            { key: "paymentReminders" as const, label: "Payment due reminders", desc: "Reminders for pending payments" },
            { key: "patentDeadlines" as const, label: "Patent deadline reminders", desc: "Alerts for patent filing deadlines" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-900">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
              <Toggle
                checked={notifications[key]}
                onChange={(v) => setNotifications({ ...notifications, [key]: v })}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Demo */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Demo</h3>
        <p className="text-sm text-slate-500 mb-4">Reset all data back to the original sample data.</p>
        <button
          onClick={resetData}
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          Reset Sample Data
        </button>
      </section>

      {/* Section 5: Account */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Account</h3>
        <p className="text-sm text-slate-500 mb-4">Sign out of your Patentos account.</p>
        <button
          onClick={logout}
          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </section>
    </div>
  );
}
