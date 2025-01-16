import { Home, Settings, Plus, Archive } from "lucide-react";
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  archived?: boolean;
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
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  useEffect(() => {
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

    if (editingProject) {
      // Handle project rename
      const updatedProjects = projects.map(project => 
        project.id === editingProject.id 
          ? { ...project, name: projectName }
          : project
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      setEditingProject(null);
    } else {
      // Handle new project creation
      const newProject = {
        id: crypto.randomUUID(),
        name: projectName,
        description: projectDescription,
        createdAt: new Date(),
        archived: false,
      };

      const updatedProjects = [newProject, ...projects];
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
    }

    setOpen(false);
    setProjectName("");
    setProjectDescription("");

    toast({
      title: editingProject ? "Project renamed successfully" : "Project created successfully",
      description: editingProject ? "Your project has been renamed." : "You can now start working on your project.",
    });
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleRenameProject = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description || "");
    setOpen(true);
  };

  const handleArchiveProject = (projectId: string) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, archived: true } : project
    );
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    toast({
      title: "Project archived",
      description: "You can find this project in the archived projects section.",
    });
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    toast({
      title: "Project deleted",
      description: "The project has been permanently deleted.",
    });
  };

  const activeProjects = projects.filter(project => !project.archived);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProject ? "Rename project" : "Name your project"}</DialogTitle>
            <DialogDescription>
              {editingProject 
                ? "Give your project a new name."
                : "Give your project a name and optionally describe what you want to achieve."
              }
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
            {!editingProject && (
              <div className="space-y-2">
                <Textarea
                  id="description"
                  placeholder="Tell me more about your project (optional)"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleCreateProject}>
              {editingProject ? "Save changes" : "Save project"}
            </Button>
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
                {activeProjects.map((project) => (
                  <ContextMenu key={project.id}>
                    <ContextMenuTrigger>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className={`hover-scale ${
                            selectedProjectId === project.id ? "bg-gray-800" : ""
                          }`}
                          onClick={() => handleProjectClick(project.id)}
                        >
                          <a href={`/discover`} className="flex items-center gap-2">
                            <span>{project.name || 'Untitled Project'}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={() => handleRenameProject(project)}>
                        Rename
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => handleArchiveProject(project.id)}>
                        Archive
                      </ContextMenuItem>
                      <ContextMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover-scale">
                    <button 
                      onClick={() => {
                        setEditingProject(null);
                        setProjectName("");
                        setProjectDescription("");
                        setOpen(true);
                      }} 
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