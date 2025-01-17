import { Plus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ProjectMenuItem } from "./ProjectMenuItem";
import { Project } from "./types";

interface ProjectsMenuProps {
  projects: Project[];
  selectedProjectId?: string;
  onProjectClick: (projectId: string) => void;
  onRename: (project: Project) => void;
  onArchive: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onAddNew: () => void;
}

export function ProjectsMenu({
  projects,
  selectedProjectId,
  onProjectClick,
  onRename,
  onArchive,
  onDelete,
  onAddNew,
}: ProjectsMenuProps) {
  const activeProjects = projects.filter(project => !project.archived);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {activeProjects.map((project) => (
            <ProjectMenuItem
              key={project.id}
              project={project}
              selectedProjectId={selectedProjectId}
              onProjectClick={onProjectClick}
              onRename={onRename}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover-scale">
              <button 
                onClick={onAddNew}
                className="flex w-full items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                <span>Add new project</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}