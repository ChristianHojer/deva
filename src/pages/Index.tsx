import { MainLayout } from "@/components/MainLayout";
import { ChatSection } from "@/components/sections/ChatSection";
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

    // Get existing projects
    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    // Find the most recent project (should be the first one)
    const latestProject = existingProjects[0];
    
    if (latestProject) {
      // Update the project name and description
      latestProject.name = projectName;
      latestProject.description = projectDescription;
      
      // Save back to localStorage
      localStorage.setItem('projects', JSON.stringify(existingProjects));
      
      // Clear the initial message
      sessionStorage.removeItem('initialProjectMessage');
      
      setOpen(false);
      
      toast({
        title: "Project created successfully",
        description: "You can now start working on your project.",
      });
    }
  };

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
        <ChatSection />
      </div>
    </MainLayout>
  );
};

export default Index;