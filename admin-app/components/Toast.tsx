"use client";
import { useEffect, useState } from "react";
interface ToastProps { message: string; type?: "success"|"error"|"info"; onDone: () => void; }
export function Toast({ message, type = "success", onDone }: ToastProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300); }, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  const color = type === "success" ? "var(--green)" : type === "error" ? "var(--red)" : "#fff";
  return (
    <div style={{
      position:"fixed", bottom:32, right:32, zIndex:9999,
      background:"var(--surface)", border:"1px solid " + color + "33",
      padding:"12px 20px", borderRadius:8, display:"flex", alignItems:"center", gap:10,
      boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
      transition:"opacity 0.25s, transform 0.25s", maxWidth:360,
    }}>
      <div style={{ width:6, height:6, borderRadius:"50%", background:color, flexShrink:0 }} />
      <span style={{ fontSize:13, color:"#fff", fontWeight:500 }}>{message}</span>
    </div>
  );
}
