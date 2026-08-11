"use client";

import React, { useState, useEffect } from "react";
import siteData from "@/data/site-images.json";

export default function AdminPanel() {
  const [formData, setFormData] = useState(siteData);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Handle nested changes
  const handleChange = (section: string, field: string, value: string, index?: number) => {
    setFormData((prev: any) => {
      const updated = { ...prev };
      if (index !== undefined) {
        updated[section][index][field] = value;
      } else {
        updated[section][field] = value;
      }
      return updated;
    });
  };

  const handleSave = async () => {
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch("/api/admin/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save changes.");

      setStatus("success");
      setMessage("Images updated successfully! Go check the live site.");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-4">
          <h1 className="text-2xl font-bold tracking-widest uppercase">VictoryAdz Image Admin</h1>
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 uppercase tracking-widest text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {status === "saving" ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {status === "success" && (
          <div className="bg-emerald-900/30 border border-emerald-500/50 text-emerald-400 p-4 mb-8 text-sm tracking-widest">
            {message}
          </div>
        )}
        {status === "error" && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 mb-8 text-sm tracking-widest">
            {message}
          </div>
        )}

        <div className="space-y-12">
          {/* Hero Section */}
          <section>
            <h2 className="text-xl font-bold tracking-widest border-b border-white/20 pb-2 mb-4 text-emerald-400 uppercase">Hero Section</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs tracking-widest text-white/60">Background Image URL</label>
                <input
                  type="text"
                  value={formData.hero.background}
                  onChange={(e) => handleChange("hero", "background", e.target.value)}
                  className="bg-[#1c1c1c] border border-white/10 p-3 text-sm focus:outline-none focus:border-emerald-500 text-white w-full"
                />
                <img src={formData.hero.background} alt="Preview" className="h-32 object-cover rounded mt-2 border border-white/10" />
              </div>
            </div>
          </section>

          {/* Brand Vision Section */}
          <section>
            <h2 className="text-xl font-bold tracking-widest border-b border-white/20 pb-2 mb-4 text-emerald-400 uppercase">Brand Vision (6 Images)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(formData.brandVision).map((key) => (
                <div key={key} className="flex flex-col gap-2 bg-[#1c1c1c] p-4 border border-white/5">
                  <label className="text-xs tracking-widest text-white/60 uppercase">{key} URL</label>
                  <input
                    type="text"
                    value={(formData.brandVision as any)[key]}
                    onChange={(e) => handleChange("brandVision", key, e.target.value)}
                    className="bg-black border border-white/10 p-3 text-sm focus:outline-none focus:border-emerald-500 text-white w-full"
                  />
                  <img src={(formData.brandVision as any)[key]} alt="Preview" className="h-24 w-full object-cover rounded mt-2 opacity-80" />
                </div>
              ))}
            </div>
          </section>

          {/* Explore Grid Section */}
          <section>
            <h2 className="text-xl font-bold tracking-widest border-b border-white/20 pb-2 mb-4 text-emerald-400 uppercase">Explore Grid (We Are Most Proud Of)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formData.exploreGrid.map((item: any, index: number) => (
                <div key={item.id} className="flex flex-col gap-3 bg-[#1c1c1c] p-4 border border-white/5 relative">
                  <span className="absolute top-2 right-2 text-[10px] text-white/30">{item.number}</span>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] tracking-widest text-white/60 uppercase">Name</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.firstName}
                        onChange={(e) => handleChange("exploreGrid", "firstName", e.target.value, index)}
                        className="bg-black border border-white/10 p-2 text-xs focus:outline-none focus:border-emerald-500 text-white w-full"
                      />
                      <input
                        type="text"
                        value={item.lastName}
                        onChange={(e) => handleChange("exploreGrid", "lastName", e.target.value, index)}
                        className="bg-black border border-white/10 p-2 text-xs focus:outline-none focus:border-emerald-500 text-white w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] tracking-widest text-white/60 uppercase">Image URL</label>
                    <input
                      type="text"
                      value={item.image}
                      onChange={(e) => handleChange("exploreGrid", "image", e.target.value, index)}
                      className="bg-black border border-white/10 p-2 text-xs focus:outline-none focus:border-emerald-500 text-white w-full"
                    />
                  </div>
                  <img src={item.image} alt="Preview" className="h-32 w-full object-cover mt-2 opacity-80 rounded" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-12 text-center text-white/30 text-xs">
          VictoryAdz Admin Panel © 2026
        </div>
      </div>
    </div>
  );
}
