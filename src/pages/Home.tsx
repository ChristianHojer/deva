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
    <div className="container max-w-6xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">
          Create without limits. Create your ideas.
        </h1>
      </div>

      {/* Chat Window */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="flex flex-col h-[400px] bg-white rounded-lg shadow-md">
          <div className="flex-1 p-4 bg-[#F1F1F1] rounded-t-lg overflow-y-auto">
            {/* Chat messages will go here */}
          </div>
          <div className="border-t p-4 bg-white">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
              <Input placeholder="Type your message..." className="flex-1" />
              <Button>Send</Button>
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