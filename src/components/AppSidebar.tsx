import { Settings, Plus, LayoutDashboard } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ProjectDialog } from "./sidebar/ProjectDialog";
import { ProjectMenuItem } from "./sidebar/ProjectMenuItem";

type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  archived?: boolean;
};

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
  {
    title: "User Settings",
    icon: Settings,
    url: "/settings",
  },
];

interface AppSidebarProps {
  selectedProjectId?: string;
}

export function AppSidebar({ selectedProjectId }: AppSidebarProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      const updatedProjects = projects.map(project => 
        project.id === editingProject.id 
          ? { ...project, name: projectName }
          : project
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      setEditingProject(null);
    } else {
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
    navigate(`/project/${projectId}/discover`);
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
    if (projectId === selectedProjectId) {
      navigate('/');
    }
  };

  const activeProjects = projects.filter(project => !project.archived);

  return (
    <>
      <ProjectDialog
        open={open}
        setOpen={setOpen}
        projectName={projectName}
        setProjectName={setProjectName}
        projectDescription={projectDescription}
        setProjectDescription={setProjectDescription}
        editingProject={editingProject}
        handleCreateProject={handleCreateProject}
      />

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
                  <ProjectMenuItem
                    key={project.id}
                    project={project}
                    selectedProjectId={selectedProjectId}
                    onProjectClick={handleProjectClick}
                    onRename={handleRenameProject}
                    onArchive={handleArchiveProject}
                    onDelete={handleDeleteProject}
                  />
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
