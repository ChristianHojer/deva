import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Project {
  id: string;
  name: string;
  description?: string;
  status?: string;
  updated_at: string;
}

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
  isMobile: boolean;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  onProjectClick: (projectId: string) => void;
}

export const ProjectList = ({
  projects,
  isLoading,
  isMobile,
  onEditProject,
  onDeleteProject,
  onProjectClick,
}: ProjectListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!projects?.length) {
    return <p className="text-muted-foreground">No active projects found.</p>;
  }

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
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
                <Button variant="outline" size="sm" onClick={() => onEditProject(project)}>
                  <Edit className="h-4 w-4" />
                  {!isMobile && <span className="ml-2">Edit</span>}
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDeleteProject(project)}>
                  <Trash className="h-4 w-4" />
                  {!isMobile && <span className="ml-2">Delete</span>}
                </Button>
                <Button variant="default" size="sm" onClick={() => onProjectClick(project.id)}>
                  {isMobile ? "Open" : "Open Project"}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};