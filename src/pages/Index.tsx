import { MainLayout } from "@/components/MainLayout";
import { ChatSection } from "@/components/sections/ChatSection";
import { VisualizationSection } from "@/components/sections/VisualizationSection";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    const initialMessage = sessionStorage.getItem('initialProjectMessage');
    if (initialMessage) {
      // Show project naming prompt
      toast({
        title: "Name your project",
        description: "Click on the project name at the top to rename it.",
        duration: 5000,
      });
      // Clear the message from storage
      sessionStorage.removeItem('initialProjectMessage');
    }
  }, []);

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-10rem)]">
        <ChatSection />
        <VisualizationSection />
      </div>
    </MainLayout>
  );
};

export default Index;