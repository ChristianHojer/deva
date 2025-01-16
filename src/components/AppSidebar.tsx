import { Home, Settings, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
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

type Project = {
  id: string;
  name: string;
  createdAt: Date;
};

const menuItems = [
  {
    title: "Home",
    icon: Home,
    url: "/",
  },
  {
    title: "User Settings",
    icon: Settings,
    url: "/settings",
  },
];

export function AppSidebar() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Load projects from localStorage
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      toast({
        title: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    const newProject = {
      id: crypto.randomUUID(),
      name: projectName,
      description: projectDescription,
      createdAt: new Date(),
    };

    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const updatedProjects = [newProject, ...existingProjects];
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    setOpen(false);
    setProjectName("");
    setProjectDescription("");

    toast({
      title: "Project created successfully",
      description: "You can now start working on your project.",
    });
  };

  return (
    <>
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
            <Button onClick={handleCreateProject}>Save project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="hover-scale">
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild className="hover-scale">
                      <a href={`/discover`} className="flex items-center gap-2">
                        <span>{project.name || 'Untitled Project'}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover-scale">
                    <button 
                      onClick={() => setOpen(true)} 
                      className="flex w-full items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add new project</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}