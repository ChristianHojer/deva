import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProjectDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  projectName: string;
  setProjectName: (name: string) => void;
  projectDescription: string;
  setProjectDescription: (description: string) => void;
  editingProject: Project | null;
  handleCreateProject: () => void;
}

type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  archived?: boolean;
};

export function ProjectDialog({
  open,
  setOpen,
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  editingProject,
  handleCreateProject,
}: ProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingProject ? "Rename project" : "Name your project"}</DialogTitle>
          <DialogDescription>
            {editingProject 
              ? "Give your project a new name."
              : "Give your project a name and optionally describe what you want to achieve."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              id="name"
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          {!editingProject && (
            <div className="space-y-2">
              <Textarea
                id="description"
                placeholder="Tell me more about your project (optional)"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleCreateProject}>
            {editingProject ? "Save changes" : "Save project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}