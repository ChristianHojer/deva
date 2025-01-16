import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { TopNavigation } from './TopNavigation';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.substring(1); // Remove leading slash
    if (path) {
      setActiveTab(path);
    } else {
      setActiveTab('dashboard');
    }
  }, [location]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopNavigation activeTab={activeTab} />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};