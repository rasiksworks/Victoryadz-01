"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS } from "@/lib/types";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 270,
        minWidth: 270,
        height: "100vh",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: "24px 20px 18px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg, #ffffff 0%, #d4d4d8 100%)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 10px rgba(255,255,255,0.15)",
              }}
            >
              <span style={{ color: "#09090b", fontSize: 15, fontWeight: 900, fontFamily: "JetBrains Mono" }}>V</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", color: "#fff" }}>VICTORYADZ</div>
              <div style={{ fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.12em", fontWeight: 600 }}>STUDIO CMS</div>
            </div>
          </div>

          {/* Live Sync Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 8px",
              borderRadius: 99,
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.25)",
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--green)",
                boxShadow: "0 0 6px var(--green)",
              }}
            />
            <span style={{ fontSize: 9, fontWeight: 700, color: "var(--green)", letterSpacing: "0.04em" }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.16em",
            color: "var(--text-dim)",
            padding: "4px 10px 8px",
            textTransform: "uppercase",
          }}
        >
          Visual Sections
        </div>

        {SECTIONS.map((s) => {
          const active = pathname === "/section/" + s.key;
          return (
            <Link
              key={s.key}
              href={"/section/" + s.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 8,
                background: active ? "rgba(255, 255, 255, 0.08)" : "transparent",
                border: active ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid transparent",
                textDecoration: "none",
                transition: "all 0.15s ease",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: active ? "rgba(255, 255, 255, 0.12)" : "var(--surface2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  color: active ? "#fff" : "var(--text-muted)",
                  flexShrink: 0,
                  transition: "all 0.15s",
                }}
              >
                {s.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    color: active ? "#fff" : "var(--text-muted)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.label}
                </div>
                <div style={{ fontSize: 10, color: active ? "var(--text-muted)" : "var(--text-dim)", marginTop: 1 }}>
                  {s.key === "exploreGallery" ? "50 items • 15 ⭐" : s.key === "testimonials" ? "Customer Reviews" : `${s.count} images`}
                </div>
              </div>

              {active && (
                <div
                  style={{
                    width: 4,
                    height: 14,
                    borderRadius: 99,
                    background: "#fff",
                    boxShadow: "0 0 8px rgba(255,255,255,0.6)",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status & Quick Link */}
      <div
        style={{
          padding: "16px 18px",
          borderTop: "1px solid var(--border)",
          background: "rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "JetBrains Mono" }}>Storage: Local JSON</span>
          <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "JetBrains Mono" }}>WebP Auto</span>
        </div>

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 11,
            fontWeight: 600,
            color: "var(--text)",
            textDecoration: "none",
            padding: "8px 12px",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            transition: "all 0.15s ease",
          }}
        >
          <span>↗</span>
          <span>View Live Website</span>
        </a>
      </div>
    </aside>
  );
}
