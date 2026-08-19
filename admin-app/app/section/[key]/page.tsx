import { SectionEditor } from "@/components/SectionEditor";
import { Sidebar } from "@/components/Sidebar";
import { SECTIONS, type SectionKey } from "@/lib/types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SectionPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const valid = SECTIONS.find(s => s.key === key);
  if (!valid) notFound();

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: "hidden" }}>
        <SectionEditor sectionKey={key as SectionKey} />
      </main>
    </div>
  );
}
