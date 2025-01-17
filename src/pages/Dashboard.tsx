import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, MessageSquare, ChartBar } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { formatDistanceToNow } from "date-fns";

export function Dashboard() {
  const navigate = useNavigate();
  const { projects, isLoading } = useProjects();

  const handleCreateProject = () => {
    navigate("/");
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}/discover`);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your project overview</p>
        </div>
        <Button onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="w-full justify-start" onClick={handleCreateProject}>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
          <Button variant="outline" className="w-full justify-start">
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
                <Card key={project.id} className="hover:bg-accent transition-colors cursor-pointer" onClick={() => handleProjectClick(project.id)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>
                          Last updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                        </CardDescription>
                      </div>
                      <Button variant="secondary" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleProjectClick(project.id);
                      }}>
                        Open
                      </Button>
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
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Monthly Usage</span>
                <span className="text-sm text-muted-foreground">250/1000 tokens</span>
              </div>
              <div className="h-2 bg-secondary rounded-full">
                <div className="h-full bg-primary rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Yearly Usage</span>
                <span className="text-sm text-muted-foreground">2500/12000 tokens</span>
              </div>
              <div className="h-2 bg-secondary rounded-full">
                <div className="h-full bg-primary rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}