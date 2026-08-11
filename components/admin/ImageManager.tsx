"use client";

import React, { useState, useEffect } from 'react';

type SectionKey = 'heroTunnel' | 'brandVision' | 'exploreGallery';

export default function ImageManager() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<SectionKey>('heroTunnel');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/content')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage('Changes saved successfully! The live site has been updated.');
      } else {
        setMessage('Failed to save changes.');
      }
    } catch (error) {
      setMessage('An error occurred while saving.');
    }
    setIsSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImageChange = (index: number, newUrl: string) => {
    setData((prev: any) => {
      const newData = { ...prev };
      if (activeTab === 'brandVision') {
        // brandVision is an object in JSON: { image1: "url", image2: "url", ... }
        const keys = Object.keys(newData[activeTab]);
        newData[activeTab][keys[index]] = newUrl;
      } else if (Array.isArray(newData[activeTab])) {
        // array-based (heroTunnel, recentWorks, exploreGallery)
        if (newData[activeTab][index].image !== undefined) {
          newData[activeTab][index].image = newUrl;
        } else if (newData[activeTab][index].src !== undefined) {
          newData[activeTab][index].src = newUrl;
        } else {
           newData[activeTab][index] = newUrl; // fallback if it's just strings
        }
      }
      return newData;
    });
  };

  if (!data) return <div className="p-8 text-white">Loading data...</div>;

  // Determine items based on activeTab
  let items: { url: string; label: string }[] = [];
  if (activeTab === 'brandVision') {
    items = Object.keys(data.brandVision).map(key => ({
      url: data.brandVision[key],
      label: key
    }));
  } else if (Array.isArray(data[activeTab])) {
    items = data[activeTab].map((item: any, idx: number) => ({
      url: item.image || item.src || item,
      label: item.alt || item.lastName || `Image ${idx + 1}`
    }));
  }

  return (
    <div className="flex flex-col h-full bg-[#1c1c1c] text-white">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 p-6">
        {(['heroTunnel', 'brandVision', 'exploreGallery'] as SectionKey[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 uppercase tracking-widest text-xs font-semibold rounded-md transition-colors ${
              activeTab === tab ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            {tab.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wide">
              {activeTab.replace(/([A-Z])/g, ' $1').trim()} Images
            </h2>
            <p className="text-white/50 text-sm mt-1">
              Paste a new image URL below to replace the existing image. Do not add or remove items to maintain layout integrity.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {message && <span className="text-green-400 text-sm font-semibold">{message}</span>}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-white text-black px-6 py-2 rounded-md font-semibold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'SAVE CHANGES'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div key={index} className="bg-black/50 p-4 rounded-lg border border-white/10 flex flex-col gap-4">
              <div className="relative aspect-[4/3] w-full bg-neutral-900 rounded overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.label} className="object-cover w-full h-full" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-1">{item.label}</label>
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="w-full bg-[#2C2C2C] border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/50"
                  placeholder="Paste image URL here..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
