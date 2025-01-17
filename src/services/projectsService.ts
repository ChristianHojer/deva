import { supabase } from "@/lib/supabase";
import { CreateProjectInput, Project, UpdateProjectInput } from "@/types/project";

export const projectsService = {
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
  },

  async createProject({ name, description }: CreateProjectInput): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, description }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProject({ id, name, description }: UpdateProjectInput): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({ name, description })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};