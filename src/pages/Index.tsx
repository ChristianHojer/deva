import { useLocation } from "react-router-dom";
import { ChatSection } from "@/components/sections/ChatSection";
import { VisualizationSection } from "@/components/sections/VisualizationSection";
import { BugsList } from "@/components/sections/BugsList";
import { ProjectDashboard } from "@/components/sections/ProjectDashboard";

const Index = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop();

  const renderContent = () => {
    switch (currentTab) {
      case 'discover':
      case 'iterate':
        return <ChatSection activeTab={currentTab} />;
      case 'visualization':
        return <VisualizationSection />;
      case 'code':
        return <ChatSection activeTab={currentTab} variant="code" />;
      case 'bugs':
        return <BugsList />;
      case 'dashboard':
        return <ProjectDashboard />;
      default:
        return <ChatSection activeTab="discover" />;
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)]">
      {renderContent()}
    </div>
  );
};

export default Index;