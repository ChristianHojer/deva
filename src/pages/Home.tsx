import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  image: string;
}

const sampleProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Dashboard",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  },
  {
    id: "2",
    name: "Analytics Platform",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  }
];

const Home = () => {
  const navigate = useNavigate();

  const handleStartCreating = () => {
    navigate('/discover');
  };

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">
          Hi and welcome! Are you ready to take your projects to the next level?
        </h1>
        <Button 
          size="lg" 
          className="hover-scale"
          onClick={handleStartCreating}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Start creating
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProjects.map((project) => (
          <Card 
            key={project.id}
            className="overflow-hidden hover-scale cursor-pointer"
            onClick={handleStartCreating}
          >
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={project.image} 
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{project.name}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;