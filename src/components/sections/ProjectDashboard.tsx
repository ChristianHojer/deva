import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ProjectDialog } from "@/components/sidebar/ProjectDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export const ProjectDashboard = () => {
  const { projects, isLoading, createProject } = useProjects();
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    
    await createProject.mutateAsync({
      name: projectName,
      description: projectDescription,
    });
    
    setOpen(false);
    setProjectName("");
    setProjectDescription("");
  };

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your projects and their settings
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>
                Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {project.description || "No description provided"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProjectDialog
        open={open}
        setOpen={setOpen}
        projectName={projectName}
        setProjectName={setProjectName}
        projectDescription={projectDescription}
        setProjectDescription={setProjectDescription}
        editingProject={null}
        handleCreateProject={handleCreateProject}
      />
    </div>
  );
};