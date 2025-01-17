import { supabase } from "@/lib/supabase";
import { DateRange } from "react-day-picker";

interface AnalyticsParams {
  startDate: Date;
  endDate: Date;
  projectIds?: string[];
}

interface ExportParams extends AnalyticsParams {
  format: 'pdf' | 'csv';
}

export const analyticsService = {
  async getTokenUsage({ startDate, endDate, projectIds }: AnalyticsParams) {
    let query = supabase
      .from('token_usage')
      .select('tokens_used, created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (projectIds && projectIds.length > 0) {
      query = query.in('project_id', projectIds);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Process data for timeline visualization
    const timeline = data.map(item => ({
      date: new Date(item.created_at).toLocaleDateString(),
      tokens: item.tokens_used
    }));

    return { timeline };
  },

  async getProjectStats({ startDate, endDate, projectIds }: AnalyticsParams) {
    let messagesQuery = supabase
      .from('messages')
      .select('project_id')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    let filesQuery = supabase
      .from('file_uploads')
      .select('project_id')
      .gte('uploaded_at', startDate.toISOString())
      .lte('uploaded_at', endDate.toISOString());

    let projectsQuery = supabase
      .from('projects')
      .select('id, name');

    if (projectIds && projectIds.length > 0) {
      messagesQuery = messagesQuery.in('project_id', projectIds);
      filesQuery = filesQuery.in('project_id', projectIds);
      projectsQuery = projectsQuery.in('id', projectIds);
    }

    const [
      { data: messages, error: messagesError },
      { data: files, error: filesError },
      { data: projects, error: projectsError }
    ] = await Promise.all([
      messagesQuery,
      filesQuery,
      projectsQuery
    ]);

    if (messagesError || filesError || projectsError) 
      throw messagesError || filesError || projectsError;

    const activity = projects.map(project => ({
      name: project.name,
      messages: messages.filter(m => m.project_id === project.id).length,
      files: files.filter(f => f.project_id === project.id).length
    }));

    return { activity };
  },

  async getErrorStats({ startDate, endDate, projectIds }: AnalyticsParams) {
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

  async exportAnalytics({ format, startDate, endDate, projectIds }: ExportParams) {
    // This is a placeholder for the export functionality
    // You would implement the actual export logic here
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  }
};