import { MainLayout } from "@/components/MainLayout";
import { ChatSection } from "@/components/sections/ChatSection";
import { VisualizationSection } from "@/components/sections/VisualizationSection";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [activeTab, setActiveTab] = useState("discover");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initialMessage = sessionStorage.getItem('initialProjectMessage');
    if (initialMessage) {
      setOpen(true);
    }
  }, []);

  const handleSaveProject = () => {
    if (!projectName.trim()) {
      toast({
        title: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const latestProject = existingProjects[0];
    
    if (latestProject) {
      latestProject.name = projectName;
      latestProject.description = projectDescription;
      localStorage.setItem('projects', JSON.stringify(existingProjects));
      sessionStorage.removeItem('initialProjectMessage');
      setOpen(false);
      
      toast({
        title: "Project created successfully",
        description: "You can now start working on your project.",
      });
    }
  };

  const shouldShowChat = activeTab === "discover" || activeTab === "iterate";

  return (
    <MainLayout>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name your project</DialogTitle>
            <DialogDescription>
              Give your project a name and optionally describe what you want to achieve.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                id="name"
                placeholder="Project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                id="description"
                placeholder="Tell me more about your project (optional)"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveProject}>Save project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="h-[calc(100vh-10rem)]">
        {shouldShowChat ? (
          <ChatSection activeTab={activeTab} />
        ) : (
          activeTab === "visualization" && <VisualizationSection />
        )}
      </div>
    </MainLayout>
  );
};

export default Index;