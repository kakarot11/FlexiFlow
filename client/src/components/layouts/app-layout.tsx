import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import TopNav from "@/components/ui/top-nav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for mobile */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } fixed inset-0 z-40 md:hidden`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>

      {/* Sidebar component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
