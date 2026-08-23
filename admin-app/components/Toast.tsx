"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onDone: () => void;
}

export function Toast({ message, type = "success", onDone }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  const config = {
    success: {
      color: "var(--green)",
      bg: "rgba(34, 197, 94, 0.12)",
      border: "rgba(34, 197, 94, 0.35)",
      icon: "✓",
    },
    error: {
      color: "var(--red)",
      bg: "rgba(239, 68, 68, 0.12)",
      border: "rgba(239, 68, 68, 0.35)",
      icon: "✕",
    },
    info: {
      color: "#60a5fa",
      bg: "rgba(59, 130, 246, 0.12)",
      border: "rgba(59, 130, 246, 0.35)",
      icon: "ℹ",
    },
  }[type];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        background: "var(--surface)",
        border: `1px solid ${config.border}`,
        padding: "12px 18px",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 12px 36px rgba(0,0,0,0.7)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.96)",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        maxWidth: 380,
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: config.bg,
          border: `1px solid ${config.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 800,
          color: config.color,
          flexShrink: 0,
        }}
      >
        {config.icon}
      </div>
      <span style={{ fontSize: 12, color: "#fff", fontWeight: 600, lineHeight: 1.4 }}>{message}</span>
    </div>
  );
}
