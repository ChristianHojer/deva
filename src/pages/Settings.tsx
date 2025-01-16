import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Upload, X, ArrowLeft, Archive } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Website {
  id: string;
  url: string;
}

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  archived?: boolean;
}

export const Settings = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [newWebsite, setNewWebsite] = useState(false);
  const [archivedProjects, setArchivedProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const projects = JSON.parse(storedProjects);
      setArchivedProjects(projects.filter((p: Project) => p.archived));
    }
  }, []);

  const handleUnarchiveProject = (projectId: string) => {
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const updatedProjects = storedProjects.map((project: Project) =>
      project.id === projectId ? { ...project, archived: false } : project
    );
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setArchivedProjects(archivedProjects.filter(p => p.id !== projectId));
    toast({
      title: "Project unarchived",
      description: "The project has been moved back to your active projects.",
    });
  };

  const handleDeleteProject = (projectId: string) => {
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const updatedProjects = storedProjects.filter((p: Project) => p.id !== projectId);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setArchivedProjects(archivedProjects.filter(p => p.id !== projectId));
    toast({
      title: "Project deleted",
      description: "The project has been permanently deleted.",
    });
  };

  return (
    <div className="container max-w-4xl py-8">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <h1 className="text-2xl font-bold mb-8">User Settings</h1>
      
      <div className="space-y-8">
        {/* Profile Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <div className="flex items-start gap-6">
            <div>
              <Avatar className="w-24 h-24">
                <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="mt-2">
                Change Photo
              </Button>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Your company" />
              </div>
            </div>
          </div>
        </section>

        {/* Archived Projects Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archived Projects
          </h2>
          <div className="grid gap-4">
            {archivedProjects.length === 0 ? (
              <p className="text-muted-foreground">No archived projects</p>
            ) : (
              archivedProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnarchiveProject(project.id)}
                        >
                          Unarchive
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* File Upload Sections */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Files & Documents</h2>
          
          {/* Coding Files */}
          <div className="space-y-2">
            <Label>Coding Files</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <div className="mt-2">
                <Button variant="outline">Upload Coding Files</Button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-2">
            <Label>Preferences</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <div className="mt-2">
                <Button variant="outline">Upload Preferences</Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
