import { supabase } from "@/lib/supabase";

export const analyticsService = {
  async getTokenUsage(timeRange: string) {
    const { data, error } = await supabase
      .from('token_usage')
      .select('tokens_used, created_at')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Process data for timeline visualization
    const timeline = data.map(item => ({
      date: new Date(item.created_at).toLocaleDateString(),
      tokens: item.tokens_used
    }));

    return { timeline };
  },

  async getProjectStats() {
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('project_id');

    const { data: files, error: filesError } = await supabase
      .from('file_uploads')
      .select('project_id');

    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name');

    if (messagesError || filesError || projectsError) throw messagesError || filesError || projectsError;

    const activity = projects.map(project => ({
      name: project.name,
      messages: messages.filter(m => m.project_id === project.id).length,
      files: files.filter(f => f.project_id === project.id).length
    }));

    return { activity };
  },

  async getErrorStats() {
    const { data, error } = await supabase
      .from('error_codes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    const common_errors = data.map(error => ({
      type: error.code,
      description: error.message,
      solution: error.solution
    }));

    return { common_errors };
  },

  async exportAnalytics(format: 'pdf' | 'csv') {
    // This is a placeholder for the export functionality
    // You would implement the actual export logic here
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  }
};