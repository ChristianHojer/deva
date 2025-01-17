import { useEffect, useState } from "react";
import { useTokenUsage } from "@/hooks/useTokenUsage";
import { supabase } from "@/lib/supabase";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { useProjects } from "@/hooks/useProjects";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth } from "date-fns";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { TokenUsageOverviewCard } from "@/components/analytics/TokenUsageOverviewCard";
import { RealtimeTokenUsageCard } from "@/components/analytics/RealtimeTokenUsageCard";
import { ProjectTokenUsageCard } from "@/components/analytics/ProjectTokenUsageCard";

type TokenUsageRow = Database['public']['Tables']['token_usage']['Row'];
type ActivityType = 'all' | 'chat' | 'file' | 'code';

export function Analytics() {
  const { monthlyUsage, yearlyUsage, isLoading: isStatsLoading } = useTokenUsage();
  const { projects } = useProjects();
  const { toast } = useToast();
  const [realtimeData, setRealtimeData] = useState<Array<{ timestamp: string; tokens: number }>>([]);
  const [projectUsage, setProjectUsage] = useState<Array<{ name: string; tokens: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [activityType, setActivityType] = useState<ActivityType>("all");
  const [date, setDate] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  const fetchProjectUsage = async (dateRange: DateRange, project?: string, activity?: ActivityType) => {
    if (!dateRange.from || !dateRange.to) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('token_usage')
        .select('project_id, tokens_used, activity_type')
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString());

      if (project && project !== 'all') {
        query = query.eq('project_id', project);
      }

      if (activity && activity !== 'all') {
        query = query.eq('activity_type', activity);
      }

      const { data, error } = await query;

      if (error) throw error;

      const projectTokens = data.reduce((acc: Record<string, number>, curr) => {
        if (curr.project_id) {
          acc[curr.project_id] = (acc[curr.project_id] || 0) + curr.tokens_used;
        }
        return acc;
      }, {});

      const projectUsageData = projects?.map(project => ({
        name: project.name,
        tokens: projectTokens[project.id] || 0
      })) || [];

      setProjectUsage(projectUsageData);
    } catch (error) {
      console.error('Error fetching project usage:', error);
      toast({
        title: "Error fetching data",
        description: "There was an error fetching the project usage data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (date.from && date.to) {
      fetchProjectUsage(date, selectedProject, activityType);
    }
  }, [date, selectedProject, activityType, projects]);

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'token_usage'
        },
        (payload: RealtimePostgresChangesPayload<TokenUsageRow>) => {
          if (payload.new && 'tokens_used' in payload.new) {
            const timestamp = new Date().toLocaleTimeString();
            const tokens = payload.new.tokens_used;
            
            setRealtimeData(prev => {
              const newData = [...prev, { timestamp, tokens }];
              return newData.slice(-10);
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const exportData = {
        tokenUsage: realtimeData.map(item => ({
          date: item.timestamp,
          tokens: item.tokens
        })),
        projectStats: projectUsage.map(project => ({
          name: project.name,
          files: 0,
          messages: 0
        })),
        errorStats: []
      };

      if (format === 'csv') {
        exportToCSV(exportData);
      } else {
        exportToPDF(exportData);
      }

      toast({
        title: "Export Successful",
        description: `Analytics data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the analytics data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <AnalyticsHeader onExport={handleExport} />
      
      <AnalyticsFilters
        date={date}
        onDateChange={setDate}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        activityType={activityType}
        onActivityTypeChange={setActivityType}
        projects={projects}
      />

      <TooltipProvider>
        <div className="grid gap-6 md:grid-cols-2">
          <TokenUsageOverviewCard
            monthlyUsage={monthlyUsage}
            yearlyUsage={yearlyUsage}
            isLoading={isStatsLoading}
          />

          <RealtimeTokenUsageCard
            data={realtimeData}
            isLoading={isLoading}
          />

          <ProjectTokenUsageCard
            data={projectUsage}
            isLoading={isLoading}
          />
        </div>
      </TooltipProvider>
    </div>
  );
}