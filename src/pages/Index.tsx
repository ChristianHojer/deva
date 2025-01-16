import { MainLayout } from "@/components/MainLayout";
import { ChatSection } from "@/components/sections/ChatSection";
import { VisualizationSection } from "@/components/sections/VisualizationSection";
import { BugsList } from "@/components/sections/BugsList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case 'discover':
      case 'iterate':
        return <ChatSection />;
      case 'visualization':
        return <VisualizationSection />;
      case 'code':
        return <ChatSection variant="code" />;
      case 'bugs':
        return <BugsList />;
      case 'settings':
        navigate('/settings');
        return null;
      default:
        return <ChatSection />;
    }
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-4rem)]">
        {renderContent()}
      </div>
    </MainLayout>
  );
};

export default Index;