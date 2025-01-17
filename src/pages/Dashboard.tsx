import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from "@/hooks/useProjects";
import { ProjectDialog } from "@/components/sidebar/ProjectDialog";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FileUploadDialog } from "@/components/dashboard/FileUploadDialog";
import { useTokenUsage } from "@/hooks/useTokenUsage";
import { supabase } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ProjectList } from "@/components/dashboard/ProjectList";
import { TokenUsageStats } from "@/components/dashboard/TokenUsageStats";

export function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();
  const { monthlyUsage, yearlyUsage, isLoading: isLoadingTokens, error: tokenError } = useTokenUsage();
  const isMobile = useIsMobile();
  
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // Set up real-time subscriptions
  useEffect(() => {
    const projectsChannel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          console.log('Projects change received:', payload);
        }
      )
      .subscribe();

    const tokenUsageChannel = supabase
      .channel('token-usage-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'token_usage'
        },
        (payload) => {
          console.log('Token usage change received:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(tokenUsageChannel);
    };
  }, []);

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    
    await createProject.mutateAsync({
      name: projectName,
      description: projectDescription,
    });
    
    setProjectDialogOpen(false);
    setProjectName("");
    setProjectDescription("");
    toast({
      title: "Success",
      description: "Project created successfully",
    });
  };

  const handleEditProject = async () => {
    if (!selectedProject || !projectName.trim()) return;
    
    await updateProject.mutateAsync({
      id: selectedProject.id,
      name: projectName,
      description: projectDescription,
    });
    
    setProjectDialogOpen(false);
    setSelectedProject(null);
    setProjectName("");
    setProjectDescription("");
    toast({
      title: "Success",
      description: "Project updated successfully",
    });
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    
    await deleteProject.mutateAsync(selectedProject.id);
    setDeleteDialogOpen(false);
    setSelectedProject(null);
    toast({
      title: "Success",
      description: "Project deleted successfully",
    });
  };

  const openProjectDialog = (project?: any) => {
    if (project) {
      setSelectedProject(project);
      setProjectName(project.name);
      setProjectDescription(project.description || "");
    }
    setProjectDialogOpen(true);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}/discover`);
  };

  const handleAnalyticsClick = () => {
    navigate("/analytics");
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your project overview</p>
        </div>
      </div>

      <QuickActions
        onNewProject={() => openProjectDialog()}
        onUploadFiles={() => setFileDialogOpen(true)}
        onViewAnalytics={handleAnalyticsClick}
        isMobile={isMobile}
      />

      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>Your current projects and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectList
            projects={projects || []}
            isLoading={isLoading}
            isMobile={isMobile}
            onEditProject={openProjectDialog}
            onDeleteProject={(project) => {
              setSelectedProject(project);
              setDeleteDialogOpen(true);
            }}
            onProjectClick={handleProjectClick}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Token Usage</CardTitle>
          <CardDescription>Your current token consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <TokenUsageStats
            monthlyUsage={monthlyUsage}
            yearlyUsage={yearlyUsage}
            isLoading={isLoadingTokens}
          />
        </CardContent>
      </Card>

      <ProjectDialog
        open={projectDialogOpen}
        setOpen={setProjectDialogOpen}
        projectName={projectName}
        setProjectName={setProjectName}
        projectDescription={projectDescription}
        setProjectDescription={setProjectDescription}
        editingProject={selectedProject}
        handleCreateProject={selectedProject ? handleEditProject : handleCreateProject}
      />

      <FileUploadDialog
        open={fileDialogOpen}
        setOpen={setFileDialogOpen}
        projects={projects || []}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}