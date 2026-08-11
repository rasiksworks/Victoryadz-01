import React from 'react';

export const metadata = {
  title: 'VictoryAdz Admin Panel',
  description: 'Manage site content',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen bg-[#141414] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-white/10 shrink-0 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-widest uppercase">Admin Panel</h1>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">Content Manager</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="/admin" className="block px-4 py-2 bg-white/10 rounded-md text-sm font-semibold tracking-wide hover:bg-white/20 transition-colors">
                Image Manager
              </a>
            </li>
            <li>
              <a href="/" target="_blank" className="block px-4 py-2 mt-4 text-xs font-semibold tracking-wide text-white/50 hover:text-white transition-colors">
                ↗ View Live Site
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}
