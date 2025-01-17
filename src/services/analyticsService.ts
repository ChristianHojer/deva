import { supabase } from "@/lib/supabase";

export const analyticsService = {
  async getTokenUsage({ startDate, endDate, projectIds }: { startDate: Date; endDate: Date; projectIds: string[] }) {
    const query = supabase
      .from('token_usage')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (projectIds.length > 0) {
      query.in('project_id', projectIds);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Process the data to create a timeline
    const timeline = data.reduce((acc: any[], entry: any) => {
      const date = new Date(entry.created_at).toLocaleDateString();
      const existingEntry = acc.find(item => item.date === date);
      
      if (existingEntry) {
        existingEntry.tokens += entry.tokens_used;
      } else {
        acc.push({ date, tokens: entry.tokens_used });
      }
      
      return acc;
    }, []);

    return { timeline };
  },

  async getProjectStats({ startDate, endDate, projectIds }: { startDate: Date; endDate: Date; projectIds: string[] }) {
    const messagesQuery = supabase
      .from('messages')
      .select('project_id')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());

    const filesQuery = supabase
      .from('file_uploads')
      .select('project_id')
      .gte('uploaded_at', startDate.toISOString())
      .lte('uploaded_at', endDate.toISOString());

    if (projectIds.length > 0) {
      messagesQuery.in('project_id', projectIds);
      filesQuery.in('project_id', projectIds);
    }

    const [messagesResult, filesResult, projectsResult] = await Promise.all([
      messagesQuery,
      filesQuery,
      supabase.from('projects').select('id, name')
    ]);

    if (messagesResult.error) throw messagesResult.error;
    if (filesResult.error) throw filesResult.error;
    if (projectsResult.error) throw projectsResult.error;

    const projects = projectsResult.data || [];
    const activity = projects.map(project => ({
      name: project.name,
      messages: messagesResult.data?.filter(m => m.project_id === project.id).length || 0,
      files: filesResult.data?.filter(f => f.project_id === project.id).length || 0,
    }));

    return { activity };
  },

  async getErrorStats({ startDate, endDate, projectIds }: { startDate: Date; endDate: Date; projectIds: string[] }) {
    const { data: errorCodes, error } = await supabase
      .from('error_codes')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (error) throw error;

    const common_errors = errorCodes?.map(error => ({
      type: error.code,
      description: error.message,
      solution: error.solution || 'No solution provided'
    })) || [];

    return { common_errors };
  },

  async exportAnalytics({ format, startDate, endDate, projectIds }: { 
    format: 'pdf' | 'csv';
    startDate: Date;
    endDate: Date;
    projectIds: string[];
  }) {
    // Implement export logic here
    // This is a placeholder that would need to be implemented based on your export requirements
    console.log('Exporting analytics:', { format, startDate, endDate, projectIds });
  }
};