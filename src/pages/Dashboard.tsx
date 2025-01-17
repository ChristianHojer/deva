import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, ChartBar, Edit, Trash, Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { formatDistanceToNow } from "date-fns";
import { ProjectDialog } from "@/components/sidebar/ProjectDialog";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FileUploadDialog } from "@/components/dashboard/FileUploadDialog";
import { useTokenUsage } from "@/hooks/useTokenUsage";
import { supabase } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";

export function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();
  const { monthlyUsage, yearlyUsage, isLoadingTokens } = useTokenUsage();
  const isMobile = useIsMobile();
  
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // Set up real-time subscriptions
  useEffect(() => {
    // Subscribe to projects changes
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
          // The useProjects hook will handle the refetch
        }
      )
      .subscribe();

    // Subscribe to token usage changes
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
          // The useTokenUsage hook will handle the refetch
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your project overview</p>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => openProjectDialog()}
          >
            <Plus className="mr-2 h-4 w-4" />
            {!isMobile && "Create"} Project
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => setFileDialogOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            {!isMobile && "Upload"} Files
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleAnalyticsClick}
          >
            <ChartBar className="mr-2 h-4 w-4" />
            {!isMobile && "View"} Analytics
          </Button>
        </CardContent>
      </Card>

      {/* Active Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>Your current projects and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : projects?.length === 0 ? (
              <p className="text-muted-foreground">No active projects found.</p>
            ) : (
              projects?.map((project) => (
                <Card key={project.id} className="hover:bg-accent transition-colors">
                  <CardHeader className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription className="text-sm">
                          Status: {project.status || "In Progress"} • Last updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <Button variant="outline" size="sm" onClick={() => openProjectDialog(project)}>
                          <Edit className="h-4 w-4" />
                          {!isMobile && <span className="ml-2">Edit</span>}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          setSelectedProject(project);
                          setDeleteDialogOpen(true);
                        }}>
                          <Trash className="h-4 w-4" />
                          {!isMobile && <span className="ml-2">Delete</span>}
                        </Button>
                        <Button variant="default" size="sm" onClick={() => handleProjectClick(project.id)}>
                          {isMobile ? "Open" : "Open Project"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Token Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Token Usage</CardTitle>
          <CardDescription>Your current token consumption</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTokens ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex flex-col sm:flex-row justify-between mb-2 gap-2">
                  <span className="text-sm font-medium">Monthly Usage</span>
                  <span className="text-sm text-muted-foreground">
                    {monthlyUsage.used}/{monthlyUsage.limit} tokens
                  </span>
                </div>
                <Progress value={(monthlyUsage.used / monthlyUsage.limit) * 100} className="h-2" />
                {monthlyUsage.used / monthlyUsage.limit > 0.9 && (
                  <p className="text-sm text-yellow-600 mt-1">You are nearing your monthly token limit</p>
                )}
              </div>
              <div>
                <div className="flex flex-col sm:flex-row justify-between mb-2 gap-2">
                  <span className="text-sm font-medium">Yearly Usage</span>
                  <span className="text-sm text-muted-foreground">
                    {yearlyUsage.used}/{yearlyUsage.limit} tokens
                  </span>
                </div>
                <Progress value={(yearlyUsage.used / yearlyUsage.limit) * 100} className="h-2" />
                {yearlyUsage.used / yearlyUsage.limit > 0.9 && (
                  <p className="text-sm text-yellow-600 mt-1">You are nearing your yearly token limit</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
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