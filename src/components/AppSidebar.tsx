import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { ProjectDialog } from "./sidebar/ProjectDialog";
import { MainMenu } from "./sidebar/MainMenu";
import { ProjectsMenu } from "./sidebar/ProjectsMenu";
import { Project } from "./sidebar/types";

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
          <MainMenu />
          <ProjectsMenu
            projects={projects}
            selectedProjectId={selectedProjectId}
            onProjectClick={handleProjectClick}
            onRename={handleRenameProject}
            onArchive={handleArchiveProject}
            onDelete={handleDeleteProject}
            onAddNew={() => {
              setEditingProject(null);
              setProjectName("");
              setProjectDescription("");
              setOpen(true);
            }}
          />
        </SidebarContent>
      </Sidebar>
    </>
  );
}