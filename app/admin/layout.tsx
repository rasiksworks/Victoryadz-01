export const metadata = {
  title: "VictoryAdz Admin Panel",
  description: "Manage site images and configuration",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // We can just return children since app/layout.tsx already provides html/body
  // This layout is purely to override metadata and maybe provide context if needed.
  return <>{children}</>;
}
