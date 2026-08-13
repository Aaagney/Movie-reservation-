import React, { useState } from "react";
import Navbar from "../components/Navbar";

// Static placeholder stats — the real numbers come from the
// "Admin Dashboard & Analytics" module (Safrin's part) and
// "Movie Management (Admin CRUD)" module (Loga Shree's part).
const STATS = [
  { label: "Films", value: "18" },
  { label: "Theaters", value: "3" },
  { label: "Confirmed Bookings", value: "0" },
  { label: "Revenue", value: "$0.00" },
];

const TABS = ["Overview", "Movies", "Theaters", "Showtimes"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-vault-bg">
      <Navbar />

      <div className="px-8 pt-10 pb-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl text-white">Admin Dashboard</h1>
          <span className="text-xs font-semibold tracking-wide px-3 py-1.5 border border-vault-gold text-vault-gold rounded-full">
            Administrator
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-vault-panel border border-vault-border rounded-xl p-5"
            >
              <p className="label-eyebrow mb-2">{stat.label}</p>
              <p className="font-serif text-3xl text-vault-gold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6 border-b border-vault-border mb-6 text-sm">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 -mb-px border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-vault-gold text-vault-gold"
                  : "border-transparent text-vault-muted hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Overview" && (
          <div>
            <h2 className="text-white font-semibold text-lg mb-4">All Bookings</h2>
            <p className="text-vault-muted text-sm">No bookings yet.</p>
          </div>
        )}
        {activeTab !== "Overview" && (
          <p className="text-vault-muted text-sm">
            {activeTab} management belongs to another team module — coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
