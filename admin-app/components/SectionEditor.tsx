"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { ImageSlot } from "./ImageSlot";
import { Toast } from "./Toast";
import type { SectionKey, SiteImages, GalleryItem, TestimonialItem } from "@/lib/types";
import { SECTIONS } from "@/lib/types";

interface ImageItem {
  originalIndex: number;
  url: string;
  label: string;
  isFavorite?: boolean;
  galleryData?: GalleryItem;
}

function extractItems(data: SiteImages, section: SectionKey): ImageItem[] {
  if (section === "brandVision") {
    return Object.entries(data.brandVision).map(([k, v], idx) => ({
      originalIndex: idx,
      url: String(v),
      label: k,
    }));
  }
  if (section === "heroTunnel") {
    return data.heroTunnel.map((item, i) => ({
      originalIndex: i,
      url: item.src,
      label: item.alt || ("Portrait " + (i + 1)),
    }));
  }
  if (section === "exploreGallery") {
    return (data.exploreGallery || []).map((item, i) => {
      const lbl = item.label || item.firstName || "";
      const ttl = item.title || item.lastName || "";
      return {
        originalIndex: i,
        url: item.image,
        label: lbl + " " + ttl,
        isFavorite: !!item.isFavorite,
        galleryData: item,
      };
    });
  }
  return [];
}

function applyImageUrlChange(data: SiteImages, section: SectionKey, originalIndex: number, newUrl: string): SiteImages {
  const d = JSON.parse(JSON.stringify(data)) as SiteImages;
  if (section === "brandVision") {
    const keys = Object.keys(d.brandVision);
    d.brandVision[keys[originalIndex]] = newUrl;
  } else if (section === "heroTunnel") {
    d.heroTunnel[originalIndex].src = newUrl;
  } else if (section === "exploreGallery") {
    d.exploreGallery[originalIndex].image = newUrl;
  }
  return d;
}

export function SectionEditor({ sectionKey }: { sectionKey: SectionKey }) {
  const [data, setData] = useState<SiteImages | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [dirty, setDirty] = useState(false);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [galleryFilter, setGalleryFilter] = useState<"all" | "favorites" | "uploads">("all");
  
  // Work Item Editing Modal State
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editingItemData, setEditingItemData] = useState<GalleryItem | null>(null);
  const [modalUploading, setModalUploading] = useState(false);

  // Testimonial Item Editing Modal State
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null);
  const [editingTestimonialData, setEditingTestimonialData] = useState<TestimonialItem | null>(null);

  const config = SECTIONS.find((s) => s.key === sectionKey)!;

  useEffect(() => {
    setData(null);
    setDirty(false);
    setSearchQuery("");
    setGalleryFilter("all");
    setEditingItemIndex(null);
    setEditingItemData(null);
    setEditingTestimonialIndex(null);
    setEditingTestimonialData(null);
    fetch("/api/images")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
      })
      .catch(() => {
        setToast({ msg: "Failed to load site data", type: "error" });
      });
  }, [sectionKey]);

  const handleUrlChange = (originalIndex: number, newUrl: string) => {
    if (!data) return;
    setData(applyImageUrlChange(data, sectionKey, originalIndex, newUrl));
    setDirty(true);
  };

  const handleToggleFavorite = (originalIndex: number) => {
    if (!data || !data.exploreGallery) return;
    const currentFavs = data.exploreGallery.filter((item) => item.isFavorite).length;
    const targetItem = data.exploreGallery[originalIndex];
    if (!targetItem.isFavorite && currentFavs >= 15) {
      setToast({ msg: "Maximum 15 favorites reached for Recent Works. Deselect one first.", type: "error" });
      return;
    }
    const d = JSON.parse(JSON.stringify(data)) as SiteImages;
    d.exploreGallery[originalIndex].isFavorite = !d.exploreGallery[originalIndex].isFavorite;
    setData(d);
    setDirty(true);
    const newCount = d.exploreGallery.filter((i) => i.isFavorite).length;
    setToast({ msg: `${newCount} / 15 Recent Works selected.`, type: "success" });
  };

  const handleUpload = useCallback(async (originalIndex: number, file: File) => {
    setUploadingIdx(originalIndex);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const result = await res.json();
      if (result.url && data) {
        setData(applyImageUrlChange(data, sectionKey, originalIndex, result.url));
        setDirty(true);
        setToast({ msg: "Image uploaded as WebP! Hit Save to apply live.", type: "success" });
      } else {
        setToast({ msg: "Upload failed: " + (result.error || "Unknown"), type: "error" });
      }
    } catch {
      setToast({ msg: "Upload failed.", type: "error" });
    }
    setUploadingIdx(null);
  }, [data, sectionKey]);

  // Open Edit Details Modal for a Work
  const handleOpenEditModal = (originalIndex: number) => {
    if (!data || !data.exploreGallery) return;
    const item = data.exploreGallery[originalIndex];
    setEditingItemIndex(originalIndex);
    const cloned = JSON.parse(JSON.stringify(item));
    if (!cloned.label && cloned.firstName) cloned.label = cloned.firstName;
    if (!cloned.title && cloned.lastName) cloned.title = cloned.lastName;
    setEditingItemData(cloned);
  };

  // Save Work Modal Changes
  const handleSaveModalChanges = () => {
    if (editingItemIndex === null || !editingItemData || !data) return;
    const d = JSON.parse(JSON.stringify(data)) as SiteImages;
    
    const finalItem: GalleryItem = {
      ...editingItemData,
      firstName: editingItemData.label || editingItemData.firstName || "",
      lastName: editingItemData.title || editingItemData.lastName || "",
      label: editingItemData.label || editingItemData.firstName || "",
      title: editingItemData.title || editingItemData.lastName || "",
    };

    d.exploreGallery[editingItemIndex] = finalItem;
    setData(d);
    setDirty(true);
    setEditingItemIndex(null);
    setEditingItemData(null);
    setToast({ msg: "Work content updated! Hit SAVE CHANGES to apply live.", type: "success" });
  };

  // Add New Work
  const handleAddNewWork = () => {
    if (!data) return;
    const d = JSON.parse(JSON.stringify(data)) as SiteImages;
    if (!Array.isArray(d.exploreGallery)) d.exploreGallery = [];
    
    const newId = String(Date.now());
    const nextNumber = "[" + String(d.exploreGallery.length + 1).padStart(2, "0") + "]";
    const newWork: GalleryItem = {
      id: newId,
      number: nextNumber,
      label: "Custom",
      title: "FRAME PROJECT",
      firstName: "Custom",
      lastName: "FRAME PROJECT",
      date: "August 2026",
      credits: "CUSTOM HANDCRAFTED FRAME",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
      isFavorite: false,
    };

    // Prepend to top of gallery
    d.exploreGallery.unshift(newWork);
    setData(d);
    setDirty(true);
    setEditingItemIndex(0);
    setEditingItemData(JSON.parse(JSON.stringify(newWork)));
    setToast({ msg: "New work created! Edit details below and save.", type: "success" });
  };

  // Delete Work
  const handleDeleteWork = (originalIndex: number) => {
    if (!data || !data.exploreGallery) return;
    if (!window.confirm("Are you sure you want to remove this work?")) return;
    const d = JSON.parse(JSON.stringify(data)) as SiteImages;
    d.exploreGallery.splice(originalIndex, 1);
    setData(d);
    setDirty(true);
    setToast({ msg: "Work deleted. Hit SAVE CHANGES to apply.", type: "success" });
  };

  // Upload directly from within the modal
  const handleModalImageUpload = async (file: File) => {
    if (!editingItemData) return;
    setModalUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const result = await res.json();
      if (result.url) {
        setEditingItemData({ ...editingItemData, image: result.url });
        setToast({ msg: "Image uploaded and converted to WebP!", type: "success" });
      } else {
        setToast({ msg: "Upload failed: " + (result.error || "Unknown"), type: "error" });
      }
    } catch {
      setToast({ msg: "Upload failed.", type: "error" });
    }
    setModalUploading(false);
  };

  // -------------------------------------------------------------
  // TESTIMONIAL HANDLERS
  // -------------------------------------------------------------
  const handleAddNewTestimonial = () => {
    if (!data) return;
    const d = JSON.parse(JSON.stringify(data)) as SiteImages;
    if (!Array.isArray(d.testimonials)) d.testimonials = [];

    const newTestimonial: TestimonialItem = {
      id: String(Date.now()),
      quote: "VictoryAdz provided outstanding handcrafted frame quality and safe delivery. Highly recommended!",
      name: "Customer Name",
      role: "Chennai, Tamil Nadu",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      initials: "CN",
      featured: false,
    };

    d.testimonials.unshift(newTestimonial);
    setData(d);
    setDirty(true);
    setEditingTestimonialIndex(0);
    setEditingTestimonialData(JSON.parse(JSON.stringify(newTestimonial)));
    setToast({ msg: "New review added! Edit details below and save.", type: "success" });
  };

  const handleOpenEditTestimonial = (index: number) => {
    if (!data || !data.testimonials) return;
    setEditingTestimonialIndex(index);
    setEditingTestimonialData(JSON.parse(JSON.stringify(data.testimonials[index])));
  };

  const handleSaveTestimonialModal = () => {
    if (editingTestimonialIndex === null || !editingTestimonialData || !data) return;
    const d = JSON.parse(JSON.stringify(data)) as SiteImages;
    if (!Array.isArray(d.testimonials)) d.testimonials = [];

    // If setting this as featured, unset other featured
    if (editingTestimonialData.featured) {
      d.testimonials.forEach((t, i) => {
        if (i !== editingTestimonialIndex) t.featured = false;
      });
    }

    d.testimonials[editingTestimonialIndex] = editingTestimonialData;
    setData(d);
    setDirty(true);
    setEditingTestimonialIndex(null);
    setEditingTestimonialData(null);
    setToast({ msg: "Review updated! Hit SAVE CHANGES to apply live.", type: "success" });
  };

  const handleDeleteTestimonial = (index: number) => {
    if (!data || !data.testimonials) return;
    if (!window.confirm("Are you sure you want to delete this customer review?")) return;
    const d = JSON.parse(JSON.stringify(data)) as SiteImages;
    if (d.testimonials) {
      d.testimonials.splice(index, 1);
    }
    setData(d);
    setDirty(true);
    setToast({ msg: "Review deleted. Hit SAVE CHANGES to apply.", type: "success" });
  };

  const handleTestimonialAvatarUpload = async (file: File) => {
    if (!editingTestimonialData) return;
    setModalUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const result = await res.json();
      if (result.url) {
        setEditingTestimonialData({ ...editingTestimonialData, avatar: result.url });
        setToast({ msg: "Avatar uploaded and converted to WebP!", type: "success" });
      } else {
        setToast({ msg: "Upload failed: " + (result.error || "Unknown"), type: "error" });
      }
    } catch {
      setToast({ msg: "Upload failed.", type: "error" });
    }
    setModalUploading(false);
  };

  const handleToggleFeaturedTestimonial = (index: number) => {
    if (!data || !data.testimonials) return;
    const d = JSON.parse(JSON.stringify(data)) as SiteImages;
    if (!d.testimonials) return;
    const isNowFeatured = !d.testimonials[index]?.featured;
    
    // Ensure single featured
    d.testimonials.forEach((t, i) => {
      t.featured = i === index ? isNowFeatured : false;
    });

    setData(d);
    setDirty(true);
    setToast({
      msg: isNowFeatured ? "Set as main spotlight review." : "Unset from spotlight.",
      type: "success",
    });
  };

  // -------------------------------------------------------------
  // SAVE CHANGES TO /api/images
  // -------------------------------------------------------------
  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setToast({ msg: "✓ Saved! Live website updated instantly.", type: "success" });
        setDirty(false);
      } else {
        const errData = await res.json().catch(() => null);
        setToast({
          msg: errData?.error ? `Save failed: ${errData.error}` : "Save failed. Check server logs.",
          type: "error",
        });
      }
    } catch (e: any) {
      setToast({ msg: `Network error: ${e.message || "Unable to reach server"}`, type: "error" });
    }
    setSaving(false);
  };

  const allItems = useMemo(() => (data ? extractItems(data, sectionKey) : []), [data, sectionKey]);
  
  const favoritesCount = useMemo(() => {
    return sectionKey === "exploreGallery" && data?.exploreGallery
      ? data.exploreGallery.filter((i) => i.isFavorite).length
      : 0;
  }, [sectionKey, data]);

  // Filter & Search for Explore Gallery
  const visibleItems = useMemo(() => {
    let items = allItems;
    if (sectionKey === "exploreGallery") {
      if (galleryFilter === "favorites") {
        items = items.filter((i) => i.isFavorite);
      } else if (galleryFilter === "uploads") {
        items = items.filter((i) => i.url.startsWith("/uploads/"));
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        items = items.filter(
          (i) =>
            i.label.toLowerCase().includes(q) ||
            i.url.toLowerCase().includes(q) ||
            i.galleryData?.number?.toLowerCase().includes(q) ||
            i.galleryData?.date?.toLowerCase().includes(q) ||
            i.galleryData?.credits?.toLowerCase().includes(q)
        );
      }
    }
    return items;
  }, [allItems, sectionKey, galleryFilter, searchQuery]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>
      {/* Top Header Bar */}
      <div
        style={{
          padding: "16px 28px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--surface)",
          flexShrink: 0,
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20, color: "var(--text-muted)" }}>{config.icon}</span>
            <h1 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>{config.label}</h1>
          </div>

          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "3px 8px",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 99,
              color: "var(--text-muted)",
              fontFamily: "JetBrains Mono",
            }}
          >
            {sectionKey === "testimonials"
              ? `${data?.testimonials?.length || 0} REVIEWS`
              : `${allItems.length} ITEMS`}
          </span>

          {/* Specifications Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 10px",
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              color: "#93c5fd",
            }}
          >
            <span>📐 Ratio: <strong>{config.ratio}</strong></span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>📏 Optimal: <strong>{config.resolution}</strong></span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span style={{ fontSize: 10, color: "rgba(147, 197, 253, 0.75)" }}>Min: {config.minResolution}</span>
          </div>

          {sectionKey === "exploreGallery" && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 99,
                background: favoritesCount === 15 ? "rgba(234, 179, 8, 0.15)" : "var(--surface2)",
                color: favoritesCount === 15 ? "#eab308" : "var(--text)",
                border: favoritesCount === 15 ? "1px solid rgba(234, 179, 8, 0.4)" : "1px solid var(--border)",
              }}
            >
              ⭐ {favoritesCount} / 15 Recent Works
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {sectionKey === "exploreGallery" && (
            <button
              onClick={handleAddNewWork}
              style={{
                padding: "8px 14px",
                background: "rgba(34, 197, 94, 0.12)",
                color: "var(--green)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              + ADD NEW WORK
            </button>
          )}

          {sectionKey === "testimonials" && (
            <button
              onClick={handleAddNewTestimonial}
              style={{
                padding: "8px 14px",
                background: "rgba(34, 197, 94, 0.12)",
                color: "var(--green)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              + ADD REVIEW
            </button>
          )}

          {dirty && (
            <span style={{ fontSize: 11, color: "#fbbf24", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} />
              Unsaved changes
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            style={{
              padding: "9px 20px",
              background: dirty ? "#ffffff" : "var(--surface2)",
              color: dirty ? "#000000" : "var(--text-dim)",
              border: "1px solid " + (dirty ? "#ffffff" : "var(--border)"),
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.05em",
              cursor: dirty ? "pointer" : "default",
              transition: "all 0.15s ease",
              opacity: saving ? 0.6 : 1,
              boxShadow: dirty ? "0 2px 12px rgba(255,255,255,0.2)" : "none",
            }}
          >
            {saving ? "SAVING…" : "SAVE CHANGES"}
          </button>
        </div>
      </div>

      {/* Explore Gallery Filter & Search Toolbar */}
      {sectionKey === "exploreGallery" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 28px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface2)",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              onClick={() => setGalleryFilter("all")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                background: galleryFilter === "all" ? "#fff" : "transparent",
                color: galleryFilter === "all" ? "#000" : "var(--text-muted)",
                transition: "all 0.15s",
              }}
            >
              All Works ({allItems.length})
            </button>
            <button
              onClick={() => setGalleryFilter("favorites")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                background: galleryFilter === "favorites" ? "#fff" : "transparent",
                color: galleryFilter === "favorites" ? "#000" : "var(--text-muted)",
                transition: "all 0.15s",
              }}
            >
              ⭐ Recent Works ({favoritesCount} / 15)
            </button>
            <button
              onClick={() => setGalleryFilter("uploads")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                background: galleryFilter === "uploads" ? "#fff" : "transparent",
                color: galleryFilter === "uploads" ? "#000" : "var(--text-muted)",
                transition: "all 0.15s",
              }}
            >
              📁 Local Uploads ({allItems.filter((i) => i.url.startsWith("/uploads/")).length})
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search works by title, number, date..."
              style={{
                width: 260,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 11,
                color: "#fff",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-dim)",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
        {!data ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "60%",
              color: "var(--text-dim)",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                border: "2px solid var(--border)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 500 }}>Loading data…</span>
          </div>
        ) : sectionKey === "testimonials" ? (
          /* ------------------------------------------------------------- */
          /* TESTIMONIALS MANAGER VIEW                                     */
          /* ------------------------------------------------------------- */
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
            <div
              style={{
                padding: "16px 20px",
                background: "rgba(59, 130, 246, 0.08)",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 12,
                color: "#93c5fd",
              }}
            >
              <span>
                💡 The review marked as <strong>⭐ Spotlight</strong> appears as the large featured card in the testimonials section.
              </span>
              <button
                onClick={handleAddNewTestimonial}
                style={{
                  padding: "6px 12px",
                  background: "rgba(34, 197, 94, 0.15)",
                  color: "#4ade80",
                  border: "1px solid rgba(34, 197, 94, 0.35)",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + Add Customer Review
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 18,
              }}
            >
              {(data.testimonials || []).map((t, idx) => (
                <div
                  key={t.id || idx}
                  className="card-hover animate-fade-in"
                  style={{
                    background: "var(--surface)",
                    border: t.featured ? "1px solid rgba(234, 179, 8, 0.5)" : "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 16,
                    position: "relative",
                    boxShadow: t.featured ? "0 4px 24px rgba(234, 179, 8, 0.1)" : "none",
                  }}
                >
                  {/* Top Bar with Star Rating and Spotlight Button */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#f59e0b", fontSize: 13, letterSpacing: 2 }}>★★★★★</span>
                      <span style={{ fontSize: 10, fontFamily: "JetBrains Mono", color: "var(--text-dim)" }}>
                        #{idx + 1}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleFeaturedTestimonial(idx)}
                      title="Set as Main Spotlight Card"
                      style={{
                        padding: "3px 8px",
                        borderRadius: 99,
                        border: t.featured ? "1px solid rgba(234,179,8,0.5)" : "1px solid var(--border)",
                        background: t.featured ? "#eab308" : "var(--surface2)",
                        color: t.featured ? "#000" : "var(--text-muted)",
                        fontSize: 10,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span>{t.featured ? "⭐" : "☆"}</span>
                      <span>{t.featured ? "SPOTLIGHT" : "SET SPOTLIGHT"}</span>
                    </button>
                  </div>

                  {/* Review Text */}
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, fontStyle: "italic" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author Meta & Action Buttons */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: 12,
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          overflow: "hidden",
                          background: "var(--surface3)",
                          border: "1px solid var(--border)",
                          flexShrink: 0,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            t.avatar?.startsWith("http")
                              ? t.avatar
                              : t.avatar?.startsWith("/")
                              ? t.avatar
                              : "/" + (t.avatar || "")
                          }
                          alt={t.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {t.name}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text-dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {t.role}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => handleOpenEditTestimonial(idx)}
                        style={{
                          padding: "5px 9px",
                          background: "var(--surface2)",
                          color: "#fff",
                          border: "1px solid var(--border)",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        ✎ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(idx)}
                        title="Delete Review"
                        style={{
                          padding: "5px 8px",
                          background: "rgba(239, 68, 68, 0.1)",
                          color: "var(--red)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          borderRadius: 6,
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : visibleItems.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "50%",
              gap: 10,
              color: "var(--text-dim)",
            }}
          >
            <span style={{ fontSize: 24 }}>🔍</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>No items match your filter or search</span>
            <button
              onClick={() => {
                setSearchQuery("");
                setGalleryFilter("all");
              }}
              style={{
                padding: "6px 12px",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                color: "#fff",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {visibleItems.map((item) => (
              <ImageSlot
                key={sectionKey + "-" + item.originalIndex}
                url={item.url}
                label={item.label}
                index={item.originalIndex}
                onUrlChange={handleUrlChange}
                onUpload={handleUpload}
                uploading={uploadingIdx === item.originalIndex}
                isFavorite={item.isFavorite}
                showFavoriteToggle={sectionKey === "exploreGallery"}
                onToggleFavorite={handleToggleFavorite}
                galleryData={item.galleryData}
                onEditDetails={sectionKey === "exploreGallery" ? () => handleOpenEditModal(item.originalIndex) : undefined}
                onDelete={sectionKey === "exploreGallery" ? () => handleDeleteWork(item.originalIndex) : undefined}
                ratioSpec={config.ratio}
                pixelSpec={config.resolution}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Work Detail Modal */}
      {editingItemIndex !== null && editingItemData && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9990,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={() => {
            setEditingItemIndex(null);
            setEditingItemData(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-fade-in"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-hover)",
              borderRadius: 14,
              width: "100%",
              maxWidth: 680,
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.9)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--surface2)",
              }}
            >
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
                  Edit Work Details & Metadata
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "JetBrains Mono" }}>
                    ID: {editingItemData.id}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      background: "rgba(59,130,246,0.15)",
                      color: "#60a5fa",
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontWeight: 600,
                    }}
                  >
                    📐 {config.ratio} · {config.resolution}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingItemIndex(null);
                  setEditingItemData(null);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: 18,
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              
              {/* Image Preview & URL Zone */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  padding: 14,
                  background: "var(--surface2)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: 100,
                    aspectRatio: "3/4",
                    background: "var(--surface3)",
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      editingItemData.image?.startsWith("http")
                        ? editingItemData.image
                        : editingItemData.image?.startsWith("/")
                        ? editingItemData.image
                        : "/" + (editingItemData.image || "")
                    }
                    alt={editingItemData.title || ""}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Image Path or URL ({config.ratio})
                  </label>
                  <input
                    type="text"
                    value={editingItemData.image || ""}
                    onChange={(e) => setEditingItemData({ ...editingItemData, image: e.target.value })}
                    placeholder="https://... or /uploads/..."
                    style={{
                      width: "100%",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "8px 12px",
                      fontSize: 11,
                      color: "#fff",
                      outline: "none",
                      fontFamily: "JetBrains Mono",
                    }}
                  />
                  <div>
                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 14px",
                        background: "var(--surface3)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                        cursor: modalUploading ? "default" : "pointer",
                        opacity: modalUploading ? 0.6 : 1,
                      }}
                    >
                      <span>📁 {modalUploading ? "Uploading & Converting…" : "Upload New File (WebP Auto)"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={modalUploading}
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleModalImageUpload(f);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {/* Label */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Label (Category / Subtitle)
                  </label>
                  <input
                    type="text"
                    value={editingItemData.label !== undefined ? editingItemData.label : (editingItemData.firstName || "")}
                    onChange={(e) =>
                      setEditingItemData({
                        ...editingItemData,
                        label: e.target.value,
                        firstName: e.target.value,
                      })
                    }
                    placeholder="e.g. Scarlett or PORTRAIT FRAME"
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "9px 12px",
                      fontSize: 13,
                      color: "#fff",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                {/* Title */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Title (Main Heading)
                  </label>
                  <input
                    type="text"
                    value={editingItemData.title !== undefined ? editingItemData.title : (editingItemData.lastName || "")}
                    onChange={(e) =>
                      setEditingItemData({
                        ...editingItemData,
                        title: e.target.value,
                        lastName: e.target.value,
                      })
                    }
                    placeholder="e.g. JOHANSSON or PREMIUM OAK"
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "9px 12px",
                      fontSize: 13,
                      color: "#fff",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                {/* Number Badge */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Number / Index Badge
                  </label>
                  <input
                    type="text"
                    value={editingItemData.number || ""}
                    onChange={(e) => setEditingItemData({ ...editingItemData, number: e.target.value })}
                    placeholder="e.g. [ 18 ]"
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "9px 12px",
                      fontSize: 13,
                      color: "#fff",
                      outline: "none",
                      fontFamily: "JetBrains Mono",
                    }}
                  />
                </div>

                {/* Date */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Date / Year
                  </label>
                  <input
                    type="text"
                    value={editingItemData.date || ""}
                    onChange={(e) => setEditingItemData({ ...editingItemData, date: e.target.value })}
                    placeholder="e.g. November 2019"
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "9px 12px",
                      fontSize: 13,
                      color: "#fff",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>

              {/* Credits */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                  Credits / Frame Description
                </label>
                <input
                  type="text"
                  value={editingItemData.credits || ""}
                  onChange={(e) => setEditingItemData({ ...editingItemData, credits: e.target.value })}
                  placeholder="e.g. PHOTOGRAPH BY ZOEY GROSSMAN or Handmade Teak Finish"
                  style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    padding: "9px 12px",
                    fontSize: 13,
                    color: "#fff",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Is Favorite Checkbox */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  background: editingItemData.isFavorite ? "rgba(234, 179, 8, 0.1)" : "var(--surface2)",
                  border: editingItemData.isFavorite ? "1px solid rgba(234, 179, 8, 0.4)" : "1px solid var(--border)",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
                onClick={() => setEditingItemData({ ...editingItemData, isFavorite: !editingItemData.isFavorite })}
              >
                <input
                  type="checkbox"
                  checked={!!editingItemData.isFavorite}
                  onChange={(e) => setEditingItemData({ ...editingItemData, isFavorite: e.target.checked })}
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: editingItemData.isFavorite ? "#eab308" : "#fff" }}>
                    ⭐ Pin to 15 Recent Works on Homepage
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 1 }}>
                    If checked, this item will appear in the "We Most Proud Of" showcase grid on the home page.
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 10,
                background: "var(--surface2)",
              }}
            >
              <button
                onClick={() => {
                  setEditingItemIndex(null);
                  setEditingItemData(null);
                }}
                style={{
                  padding: "8px 16px",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  color: "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModalChanges}
                style={{
                  padding: "8px 22px",
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Testimonial Detail Modal */}
      {editingTestimonialIndex !== null && editingTestimonialData && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9990,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={() => {
            setEditingTestimonialIndex(null);
            setEditingTestimonialData(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-fade-in"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-hover)",
              borderRadius: 14,
              width: "100%",
              maxWidth: 640,
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.9)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--surface2)",
              }}
            >
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>
                  Edit Customer Review
                </h2>
                <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                  Review ID: {editingTestimonialData.id}
                </span>
              </div>
              <button
                onClick={() => {
                  setEditingTestimonialIndex(null);
                  setEditingTestimonialData(null);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              
              {/* Quote / Feedback */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                  Customer Review Quote
                </label>
                <textarea
                  rows={4}
                  value={editingTestimonialData.quote || ""}
                  onChange={(e) => setEditingTestimonialData({ ...editingTestimonialData, quote: e.target.value })}
                  placeholder="Enter the customer review text..."
                  style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    padding: "10px 12px",
                    fontSize: 13,
                    color: "#fff",
                    outline: "none",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Author & Location */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={editingTestimonialData.name || ""}
                    onChange={(e) => setEditingTestimonialData({ ...editingTestimonialData, name: e.target.value })}
                    placeholder="e.g. Karthik Raja"
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "9px 12px",
                      fontSize: 13,
                      color: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                    City / State / Role
                  </label>
                  <input
                    type="text"
                    value={editingTestimonialData.role || ""}
                    onChange={(e) => setEditingTestimonialData({ ...editingTestimonialData, role: e.target.value })}
                    placeholder="e.g. Chennai, Tamil Nadu"
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "9px 12px",
                      fontSize: 13,
                      color: "#fff",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Avatar Upload / URL */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  padding: 14,
                  background: "var(--surface2)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "var(--surface3)",
                    border: "1px solid var(--border)",
                    flexShrink: 0,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      editingTestimonialData.avatar?.startsWith("http")
                        ? editingTestimonialData.avatar
                        : editingTestimonialData.avatar?.startsWith("/")
                        ? editingTestimonialData.avatar
                        : "/" + (editingTestimonialData.avatar || "")
                    }
                    alt={editingTestimonialData.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Avatar Image URL (1:1 Square)
                  </label>
                  <input
                    type="text"
                    value={editingTestimonialData.avatar || ""}
                    onChange={(e) => setEditingTestimonialData({ ...editingTestimonialData, avatar: e.target.value })}
                    placeholder="https://... or /uploads/..."
                    style={{
                      width: "100%",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "7px 10px",
                      fontSize: 11,
                      color: "#fff",
                      outline: "none",
                      fontFamily: "JetBrains Mono",
                    }}
                  />
                  <div>
                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        background: "var(--surface3)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                        cursor: modalUploading ? "default" : "pointer",
                        opacity: modalUploading ? 0.6 : 1,
                      }}
                    >
                      <span>📁 {modalUploading ? "Uploading…" : "Upload Avatar Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={modalUploading}
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleTestimonialAvatarUpload(f);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Spotlight / Featured Checkbox */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  background: editingTestimonialData.featured ? "rgba(234, 179, 8, 0.1)" : "var(--surface2)",
                  border: editingTestimonialData.featured ? "1px solid rgba(234, 179, 8, 0.4)" : "1px solid var(--border)",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
                onClick={() =>
                  setEditingTestimonialData({
                    ...editingTestimonialData,
                    featured: !editingTestimonialData.featured,
                  })
                }
              >
                <input
                  type="checkbox"
                  checked={!!editingTestimonialData.featured}
                  onChange={(e) =>
                    setEditingTestimonialData({
                      ...editingTestimonialData,
                      featured: e.target.checked,
                    })
                  }
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: editingTestimonialData.featured ? "#eab308" : "#fff" }}>
                    ⭐ Spotlight Review (Large Card on Desktop)
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 1 }}>
                    If enabled, this review will be displayed in the 2-row spotlight card slot.
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 10,
                background: "var(--surface2)",
              }}
            >
              <button
                onClick={() => {
                  setEditingTestimonialIndex(null);
                  setEditingTestimonialData(null);
                }}
                style={{
                  padding: "8px 16px",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  color: "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTestimonialModal}
                style={{
                  padding: "8px 22px",
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
