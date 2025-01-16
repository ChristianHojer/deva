import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Code, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const Home = () => {
  const navigate = useNavigate();

  const handleStartCreating = () => {
    navigate('/discover');
  };

  return (
    <div className="container max-w-6xl mx-auto py-8">
      {/* Chat Window */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="flex flex-col h-[600px] bg-[#0A0A0A] rounded-xl shadow-xl border border-[#1E1E1E]">
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Chat messages will go here */}
          </div>
          <div className="p-4 border-t border-[#1E1E1E]">
            <div className="flex gap-3 items-center">
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
              />
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Send
              </Button>
            </div>
          </div>
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