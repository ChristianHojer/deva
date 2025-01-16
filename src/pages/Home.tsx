import { Button } from "@/components/ui/button";
import { Plus, Code, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("");

  const handleStartCreating = () => {
    navigate('/discover');
  };

  const handleSend = () => {
    if (!message.trim()) {
      toast({
        title: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    // Create a new project
    const newProject = {
      id: crypto.randomUUID(),
      name: 'Untitled Project',
      createdAt: new Date(),
    };

    // Get existing projects or initialize empty array
    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    // Add new project to the beginning of the array
    const updatedProjects = [newProject, ...existingProjects];
    
    // Save to localStorage
    localStorage.setItem('projects', JSON.stringify(updatedProjects));

    // Store the initial message in sessionStorage to use it in the project
    sessionStorage.setItem('initialProjectMessage', message);
    navigate('/discover');
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
      </div>
    </div>
  );
};

export default Home;