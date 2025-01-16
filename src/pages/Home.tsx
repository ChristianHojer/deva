import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

    // Store the initial message in sessionStorage to use it in the project
    sessionStorage.setItem('initialProjectMessage', message);
    navigate('/discover');
  };

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">
          Create without limits. Create your ideas.
        </h1>
      </div>

      {/* Chat Window */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="flex gap-3 items-center bg-[#0A0A0A] rounded-xl shadow-xl border border-[#1E1E1E] p-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-400 hover:text-gray-300 hover:bg-[#1E1E1E]"
          >
            <Upload className="h-5 w-5" />
          </Button>
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
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Deva Project Card */}
        <Card 
          className="overflow-hidden hover-scale cursor-pointer"
          onClick={handleStartCreating}
        >
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
              alt="Code Editor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              <h3 className="font-semibold text-lg">Deva</h3>
            </div>
          </div>
        </Card>

        {/* Empty Project Card */}
        <Card 
          className="overflow-hidden hover-scale cursor-pointer flex flex-col items-center justify-center aspect-[4/3]"
          onClick={handleStartCreating}
        >
          <Plus className="h-12 w-12 mb-2 text-gray-400" />
          <span className="text-gray-600 font-medium">Start creating</span>
        </Card>
      </div>
    </div>
  );
};

export default Home;