"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS } from "@/lib/types";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside style={{ width:260, minWidth:260, height:"100vh", background:"var(--surface)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"28px 24px 20px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#000", fontSize:14, fontWeight:800 }}>V</span>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, letterSpacing:"0.06em", color:"#fff" }}>VICTORYADZ</div>
            <div style={{ fontSize:10, color:"var(--text-muted)", letterSpacing:"0.12em", marginTop:1 }}>ADMIN PANEL</div>
          </div>
        </div>
      </div>
      <nav style={{ flex:1, padding:"16px 12px", overflowY:"auto" }}>
        <div style={{ fontSize:9, fontWeight:600, letterSpacing:"0.18em", color:"var(--text-dim)", padding:"0 8px 10px" }}>WEBSITE SECTIONS</div>
        {SECTIONS.map(s => {
          const active = pathname === "/section/" + s.key;
          return (
            <Link key={s.key} href={"/section/" + s.key} style={{
              display:"flex", alignItems:"center", gap:10, padding:"10px 10px", marginBottom:2,
              background: active ? "rgba(255,255,255,0.08)" : "transparent",
              borderRadius:6, borderLeft: active ? "2px solid #fff" : "2px solid transparent",
              textDecoration:"none", transition:"background 0.15s",
            }}>
              <span style={{ fontSize:16, width:20, textAlign:"center", color: active ? "#fff" : "var(--text-muted)" }}>{s.icon}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight: active ? 600 : 400, color: active ? "#fff" : "var(--text-muted)", letterSpacing:"0.02em" }}>{s.label}</div>
                <div style={{ fontSize:10, color:"var(--text-dim)", marginTop:1 }}>
                  {s.key === "exploreGallery" ? "50 items • 15 ⭐" : (s.count + " images")}
                </div>
              </div>
              {active && <div style={{ width:5, height:5, borderRadius:"50%", background:"#fff", flexShrink:0 }} />}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding:"16px 20px", borderTop:"1px solid var(--border)" }}>
        <a href="http://localhost:3000" target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:8, fontSize:11, color:"var(--text-muted)", textDecoration:"none", padding:"8px 0" }}>
          <span style={{ fontSize:13 }}>↗</span> View Live Site
        </a>
      </div>
    </aside>
  );
}
