import { useState, useEffect } from 'react';
import { useLocation, useParams, Outlet } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { TopNavigation } from './TopNavigation';

export const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const location = useLocation();
  const { projectId } = useParams();

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path) {
      setActiveTab(path);
    }
  }, [location]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar selectedProjectId={projectId} />
        <div className="flex-1 flex flex-col">
          <TopNavigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            projectId={projectId}
          />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};