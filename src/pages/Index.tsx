import { MainLayout } from "@/components/MainLayout";
import { ChatSection } from "@/components/sections/ChatSection";
import { VisualizationSection } from "@/components/sections/VisualizationSection";
import { BugsList } from "@/components/sections/BugsList";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState('discover');

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
      default:
        return null;
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