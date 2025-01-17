import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, ChartBar, Edit, Trash } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { formatDistanceToNow } from "date-fns";
import { ProjectDialog } from "@/components/sidebar/ProjectDialog";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FileUploadDialog } from "@/components/dashboard/FileUploadDialog";
import { useTokenUsage } from "@/hooks/useTokenUsage";

export function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();
  const { monthlyUsage, yearlyUsage, isLoading: isLoadingTokens } = useTokenUsage();
  
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

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
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your project overview</p>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="w-full justify-start" onClick={() => openProjectDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => setFileDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={handleAnalyticsClick}>
            <ChartBar className="mr-2 h-4 w-4" />
            View Analytics
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
              <p>Loading projects...</p>
            ) : projects?.length === 0 ? (
              <p className="text-muted-foreground">No active projects found.</p>
            ) : (
              projects?.map((project) => (
                <Card key={project.id} className="hover:bg-accent transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>
                          Status: {project.status || "In Progress"} • Last updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openProjectDialog(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          setSelectedProject(project);
                          setDeleteDialogOpen(true);
                        }}>
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button variant="default" size="sm" onClick={() => handleProjectClick(project.id)}>
                          Open
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
            <p>Loading token usage...</p>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Usage</span>
                  <span className="text-sm text-muted-foreground">
                    {monthlyUsage.used}/{monthlyUsage.limit} tokens
                  </span>
                </div>
                <Progress value={(monthlyUsage.used / monthlyUsage.limit) * 100} />
                {monthlyUsage.used / monthlyUsage.limit > 0.9 && (
                  <p className="text-sm text-yellow-600 mt-1">You are nearing your monthly token limit</p>
                )}
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Yearly Usage</span>
                  <span className="text-sm text-muted-foreground">
                    {yearlyUsage.used}/{yearlyUsage.limit} tokens
                  </span>
                </div>
                <Progress value={(yearlyUsage.used / yearlyUsage.limit) * 100} />
                {yearlyUsage.used / yearlyUsage.limit > 0.9 && (
                  <p className="text-sm text-yellow-600 mt-1">You are nearing your yearly token limit</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Dialog */}
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

      {/* File Upload Dialog */}
      <FileUploadDialog
        open={fileDialogOpen}
        setOpen={setFileDialogOpen}
        projects={projects || []}
      />

      {/* Delete Confirmation Dialog */}
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