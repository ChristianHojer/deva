import { Button } from "@/components/ui/button";
import { Plus, Code, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

type Project = {
  id: string;
  name: string;
  createdAt: Date;
};

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  const handleStartCreating = () => {
    // Create a new project and navigate to it
    const newProject = {
      id: crypto.randomUUID(),
      name: 'Untitled Project',
      createdAt: new Date(),
    };

    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const updatedProjects = [newProject, ...existingProjects];
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    navigate(`/project/${newProject.id}/discover`);
  };

  const handleSend = () => {
    if (!message.trim()) {
      toast({
        title: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    const newProject = {
      id: crypto.randomUUID(),
      name: 'Untitled Project',
      createdAt: new Date(),
    };

    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const updatedProjects = [newProject, ...existingProjects];
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    sessionStorage.setItem('initialProjectMessage', message);
    navigate(`/project/${newProject.id}/discover`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-3xl w-full space-y-8 text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Create without limits.
          <br />
          Create your ideas.
        </h1>
      </div>

      <div className="w-full max-w-3xl">
        <div className="flex gap-2 p-4 rounded-lg bg-gray-800">
          <Input 
            placeholder="How can I help you today?" 
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-gray-200 placeholder:text-gray-500 text-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
          />
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSend}
          >
            Send
          </Button>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" className="text-gray-400 border-gray-700" onClick={handleStartCreating}>
            <Plus className="mr-2 h-4 w-4" /> Create from scratch
          </Button>
          <Button variant="outline" className="text-gray-400 border-gray-700">
            <Code className="mr-2 h-4 w-4" /> Import from GitHub
          </Button>
          <Button variant="outline" className="text-gray-400 border-gray-700">
            <Upload className="mr-2 h-4 w-4" /> Upload files
          </Button>
        </div>

        {projects.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">Your Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/project/${project.id}/discover`)}
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-800 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-200 group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;