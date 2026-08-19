"use client";
import { useRef, useState } from "react";
import type { GalleryItem } from "@/lib/types";

interface ImageSlotProps {
  url: string;
  label: string;
  index: number;
  onUrlChange: (index: number, url: string) => void;
  onUpload: (index: number, file: File) => Promise<void>;
  uploading?: boolean;
  isFavorite?: boolean;
  showFavoriteToggle?: boolean;
  onToggleFavorite?: (index: number) => void;
  galleryData?: GalleryItem;
  onEditDetails?: () => void;
  onDelete?: () => void;
  ratioSpec?: string;
  pixelSpec?: string;
}

export function ImageSlot({
  url,
  label,
  index,
  onUrlChange,
  onUpload,
  uploading,
  isFavorite,
  showFavoriteToggle,
  onToggleFavorite,
  galleryData,
  onEditDetails,
  onDelete,
  ratioSpec = "3:4 Portrait",
  pixelSpec = "1200 × 1600 px",
}: ImageSlotProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) await onUpload(index, file);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await onUpload(index, file);
    e.target.value = "";
  };

  const displayUrl = url || "";
  const previewSrc = displayUrl.startsWith("http") ? displayUrl : "http://localhost:3000" + displayUrl;

  const itemLabel = galleryData?.label || galleryData?.firstName || "";
  const itemTitle = galleryData?.title || galleryData?.lastName || "";

  return (
    <div
      style={{
        background: "var(--surface)",
        border: isFavorite ? "1px solid rgba(234, 179, 8, 0.45)" : "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s",
        position: "relative",
      }}
    >
      {/* Image Preview Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          position: "relative",
          aspectRatio: "3/4",
          overflow: "hidden",
          cursor: "pointer",
          background: "var(--surface2)",
          border: dragging ? "2px dashed rgba(255,255,255,0.4)" : "2px dashed transparent",
          transition: "border-color 0.15s",
        }}
      >
        {displayUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewSrc}
            alt={label}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              color: "var(--text-dim)",
              padding: 16,
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 28 }}>⊕</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>Drop image or click</span>
            <span
              style={{
                fontSize: 10,
                color: "var(--text-dim)",
                background: "rgba(255,255,255,0.06)",
                padding: "2px 8px",
                borderRadius: 4,
                fontFamily: "monospace",
              }}
            >
              {ratioSpec} · {pixelSpec}
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            right: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          {galleryData?.number ? (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 7px",
                background: "rgba(0,0,0,0.75)",
                color: "#fff",
                borderRadius: 4,
                fontFamily: "monospace",
                backdropFilter: "blur(4px)",
              }}
            >
              {galleryData.number}
            </span>
          ) : (
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                padding: "2px 6px",
                background: "rgba(0,0,0,0.65)",
                color: "var(--text-dim)",
                borderRadius: 4,
                fontFamily: "monospace",
              }}
            >
              {ratioSpec}
            </span>
          )}

          {/* Star / Favorite Badge on top-right */}
          {showFavoriteToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavorite) onToggleFavorite(index);
              }}
              title={isFavorite ? "Remove from Recent Works" : "Add to Recent Works (Max 15)"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 8px",
                borderRadius: 99,
                cursor: "pointer",
                border: "none",
                background: isFavorite ? "#eab308" : "rgba(0,0,0,0.75)",
                color: isFavorite ? "#000" : "rgba(255,255,255,0.7)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.05em",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                transition: "all 0.15s",
                backdropFilter: "blur(4px)",
              }}
            >
              <span>{isFavorite ? "⭐" : "☆"}</span>
              <span>{isFavorite ? "RECENT WORK" : "FAVORITE"}</span>
            </button>
          )}
        </div>

        {dragging && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Drop to upload</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Ratio: {ratioSpec} ({pixelSpec})</span>
          </div>
        )}

        {uploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                border: "2px solid rgba(255,255,255,0.15)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }}
            />
          </div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* Content & Metadata */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {galleryData ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
              <div>
                <div style={{ fontSize: 10, textTransform: "uppercase", color: "var(--text-dim)", fontWeight: 600, letterSpacing: "0.05em" }}>
                  {itemLabel || "Untitled"}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginTop: 1 }}>
                  {itemTitle || "NO TITLE"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {galleryData.date}
                </div>
              </div>

              {onEditDetails && (
                <button
                  onClick={onEditDetails}
                  style={{
                    padding: "5px 9px",
                    background: "var(--accent-dim)",
                    color: "#fff",
                    border: "1px solid var(--border-hover)",
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                  }}
                >
                  ✎ Edit Content
                </button>
              )}
            </div>

            {galleryData.credits && (
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-dim)",
                  marginTop: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {galleryData.credits}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "var(--text-dim)", textTransform: "uppercase" }}>
              {label}
            </span>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.08em",
                padding: "4px 10px",
                background: "var(--accent-dim)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              Upload
            </button>
          </div>
        )}

        {/* URL Input */}
        <div style={{ display: "flex", gap: 6 }}>
          <input
            type="text"
            value={displayUrl}
            onChange={(e) => {
              setImgError(false);
              onUrlChange(index, e.target.value);
            }}
            placeholder="Paste image URL..."
            style={{
              flex: 1,
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 5,
              padding: "7px 10px",
              fontSize: 11,
              color: "var(--text-muted)",
              outline: "none",
              fontFamily: "inherit",
            }}
          />

          {onDelete && (
            <button
              onClick={onDelete}
              title="Delete this work"
              style={{
                padding: "0 8px",
                background: "rgba(239, 68, 68, 0.12)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: 5,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              🗑
            </button>
          )}
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
}
