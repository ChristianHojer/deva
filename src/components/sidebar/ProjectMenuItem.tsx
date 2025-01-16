import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  archived?: boolean;
};

interface ProjectMenuItemProps {
  project: Project;
  selectedProjectId?: string;
  onProjectClick: (projectId: string) => void;
  onRename: (project: Project) => void;
  onArchive: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectMenuItem({
  project,
  selectedProjectId,
  onProjectClick,
  onRename,
  onArchive,
  onDelete,
}: ProjectMenuItemProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className={`hover-scale ${
              selectedProjectId === project.id ? "bg-gray-800 text-white" : ""
            }`}
            onClick={() => onProjectClick(project.id)}
          >
            <button className="flex w-full items-center gap-2">
              <span>{project.name || 'Untitled Project'}</span>
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => onRename(project)}>
          Rename
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onArchive(project.id)}>
          Archive
        </ContextMenuItem>
        <ContextMenuItem 
          className="text-red-600"
          onClick={() => onDelete(project.id)}
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}