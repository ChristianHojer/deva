import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload, ChartBar } from "lucide-react";

interface QuickActionsProps {
  onNewProject: () => void;
  onUploadFiles: () => void;
  onViewAnalytics: () => void;
  isMobile: boolean;
}

export const QuickActions = ({ 
  onNewProject, 
  onUploadFiles, 
  onViewAnalytics,
  isMobile 
}: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={onNewProject}
        >
          <Plus className="mr-2 h-4 w-4" />
          {!isMobile && "Create"} Project
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={onUploadFiles}
        >
          <Upload className="mr-2 h-4 w-4" />
          {!isMobile && "Upload"} Files
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={onViewAnalytics}
        >
          <ChartBar className="mr-2 h-4 w-4" />
          {!isMobile && "View"} Analytics
        </Button>
      </CardContent>
    </Card>
  );
};