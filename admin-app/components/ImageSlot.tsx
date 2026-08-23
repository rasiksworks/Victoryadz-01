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
  const previewSrc = displayUrl.startsWith("http")
    ? displayUrl
    : displayUrl.startsWith("/")
    ? displayUrl
    : "/" + displayUrl;

  const itemLabel = galleryData?.label || galleryData?.firstName || "";
  const itemTitle = galleryData?.title || galleryData?.lastName || "";

  return (
    <div
      className="card-hover animate-fade-in"
      style={{
        background: "var(--surface)",
        border: isFavorite ? "1px solid rgba(234, 179, 8, 0.4)" : "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxShadow: isFavorite ? "0 4px 20px rgba(234, 179, 8, 0.08)" : "none",
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
          border: dragging ? "2px dashed #fff" : "2px dashed transparent",
          transition: "all 0.15s ease",
        }}
      >
        {displayUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewSrc}
            alt={label}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
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
              gap: 8,
              padding: 20,
              textAlign: "center",
              background: "radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "var(--surface3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                fontSize: 16,
              }}
            >
              ⊕
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>Upload Image</span>
            <span
              style={{
                fontSize: 10,
                color: "var(--text-dim)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                padding: "3px 8px",
                borderRadius: 4,
                fontFamily: "JetBrains Mono",
              }}
            >
              {ratioSpec} · {pixelSpec}
            </span>
          </div>
        )}

        {/* Top Floating Badges */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            right: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          {galleryData?.number ? (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 8px",
                background: "rgba(0,0,0,0.75)",
                color: "#fff",
                borderRadius: 5,
                fontFamily: "JetBrains Mono",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {galleryData.number}
            </span>
          ) : (
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                padding: "3px 7px",
                background: "rgba(0,0,0,0.75)",
                color: "var(--text-dim)",
                borderRadius: 5,
                fontFamily: "JetBrains Mono",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              #{index + 1}
            </span>
          )}

          {/* Star / Favorite Toggle Button */}
          {showFavoriteToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavorite) onToggleFavorite(index);
              }}
              title={isFavorite ? "Remove from Recent Works" : "Pin to Recent Works (Max 15)"}
              style={{
                pointerEvents: "auto",
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 9px",
                borderRadius: 99,
                cursor: "pointer",
                border: isFavorite ? "1px solid rgba(234,179,8,0.5)" : "1px solid rgba(255,255,255,0.12)",
                background: isFavorite ? "#eab308" : "rgba(0,0,0,0.75)",
                color: isFavorite ? "#000" : "rgba(255,255,255,0.75)",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.04em",
                boxShadow: isFavorite ? "0 2px 10px rgba(234,179,8,0.3)" : "0 2px 6px rgba(0,0,0,0.4)",
                transition: "all 0.15s ease",
                backdropFilter: "blur(6px)",
              }}
            >
              <span>{isFavorite ? "⭐" : "☆"}</span>
              <span>{isFavorite ? "RECENT WORK" : "PIN"}</span>
            </button>
          )}
        </div>

        {/* Dragging Overlay */}
        {dragging && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(4px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              zIndex: 20,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Drop to upload WebP</span>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Auto converts to optimized WebP</span>
          </div>
        )}

        {/* Uploading Spinner Overlay */}
        {uploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                border: "2px solid rgba(255,255,255,0.15)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
              }}
            />
          </div>
        )}
      </div>

      {/* Content Info & Actions */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {galleryData ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    color: "var(--text-dim)",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {itemLabel || "UNTITLED"}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.25,
                    marginTop: 2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {itemTitle || "NO TITLE"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {galleryData.date || "VictoryAdz Studio"}
                </div>
              </div>

              {onEditDetails && (
                <button
                  onClick={onEditDetails}
                  style={{
                    padding: "6px 10px",
                    background: "var(--surface2)",
                    color: "#fff",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                  }}
                >
                  ✎ Edit
                </button>
              )}
            </div>

            {galleryData.credits && (
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-dim)",
                  marginTop: 6,
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
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "var(--text-dim)",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.05em",
                padding: "5px 10px",
                background: "var(--surface2)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              Upload
            </button>
          </div>
        )}

        {/* URL Input & Delete Action */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
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
              borderRadius: 6,
              padding: "7px 10px",
              fontSize: 11,
              color: "var(--text-muted)",
              outline: "none",
              fontFamily: "JetBrains Mono",
              transition: "border-color 0.15s",
            }}
          />

          {onDelete && (
            <button
              onClick={onDelete}
              title="Delete this work"
              style={{
                padding: "6px 9px",
                background: "rgba(239, 68, 68, 0.1)",
                color: "var(--red)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                transition: "all 0.15s",
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
