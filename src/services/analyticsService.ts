import { supabase } from "@/lib/supabase";

export type ActivityType = 'message' | 'file' | 'error' | 'code_change' | 'all';
export type ErrorType = 'syntax' | 'runtime' | 'logic' | 'network' | 'database' | 'authentication' | 'authorization' | 'validation' | 'other' | 'all';

export const analyticsService = {
  async getTokenUsage({ startDate, endDate, projectIds, activityType }: { 
    startDate: Date; 
    endDate: Date; 
    projectIds: string[];
    activityType?: ActivityType;
  }) {
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

  async getProjectStats({ startDate, endDate, projectIds, activityType }: { 
    startDate: Date; 
    endDate: Date; 
    projectIds: string[];
    activityType?: ActivityType;
  }) {
    let messagesQuery = supabase
      .from('messages')
      .select('project_id, activity_type')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());

    let filesQuery = supabase
      .from('file_uploads')
      .select('project_id, activity_type')
      .gte('uploaded_at', startDate.toISOString())
      .lte('uploaded_at', endDate.toISOString());

    if (projectIds.length > 0) {
      messagesQuery = messagesQuery.in('project_id', projectIds);
      filesQuery = filesQuery.in('project_id', projectIds);
    }

    if (activityType && activityType !== 'all') {
      messagesQuery = messagesQuery.eq('activity_type', activityType);
      filesQuery = filesQuery.eq('activity_type', activityType);
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

  async getErrorStats({ 
    startDate, 
    endDate, 
    projectIds,
    errorType = 'all'
  }: { 
    startDate: Date; 
    endDate: Date; 
    projectIds: string[];
    errorType?: ErrorType;
  }) {
    const query = supabase
      .from('error_codes')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (errorType !== 'all') {
      query.eq('error_type', errorType);
    }

    const { data: errorCodes, error } = await query;
    if (error) throw error;

    const common_errors = errorCodes?.map(error => ({
      type: error.code,
      description: error.message,
      solution: error.solution || 'No solution provided',
      errorType: error.error_type
    })) || [];

    return { common_errors };
  },

  async exportAnalytics({ format, startDate, endDate, projectIds }: { 
    format: 'pdf' | 'csv';
    startDate: Date;
    endDate: Date;
    projectIds: string[];
  }) {
    console.log('Exporting analytics:', { format, startDate, endDate, projectIds });
  }
};
