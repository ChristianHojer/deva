import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenUsageStats } from "@/components/dashboard/TokenUsageStats";
import { useTokenUsage } from "@/hooks/useTokenUsage";
import { supabase } from "@/lib/supabase";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { useProjects } from "@/hooks/useProjects";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { RealtimeTokenChart } from "@/components/analytics/RealtimeTokenChart";
import { ProjectTokenChart } from "@/components/analytics/ProjectTokenChart";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { addDays, startOfMonth, endOfMonth, startOfYear, subDays } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const presetRanges = {
    "last7Days": {
      label: "Last 7 Days",
      range: { from: subDays(new Date(), 7), to: new Date() }
    },
    "lastMonth": {
      label: "Last Month",
      range: { from: startOfMonth(subDays(new Date(), 30)), to: endOfMonth(subDays(new Date(), 30)) }
    },
    "lastYear": {
      label: "Last Year",
      range: { from: startOfYear(new Date()), to: new Date() }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <AnalyticsHeader onExport={handleExport} />
      
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-auto">
          <DatePickerWithRange
            date={date}
            onDateChange={setDate}
            className="w-full md:w-[300px]"
          />
        </div>
        
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects?.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={activityType} onValueChange={(value: ActivityType) => setActivityType(value)}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Activity Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="chat">Chat Messages</SelectItem>
            <SelectItem value="file">File Uploads</SelectItem>
            <SelectItem value="code">Code Changes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TooltipProvider>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Token Usage Overview</CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shows your monthly and yearly token usage limits and consumption</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ) : (
                <TokenUsageStats
                  monthlyUsage={monthlyUsage}
                  yearlyUsage={yearlyUsage}
                  isLoading={isStatsLoading}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Real-time Token Usage</CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Live updates of token usage as they occur</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <RealtimeTokenChart data={realtimeData} />
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Token Usage by Project</CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Breakdown of token usage across different projects</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ProjectTokenChart data={projectUsage} />
              )}
            </CardContent>
          </Card>
        </TooltipProvider>
      </div>
    </div>
  );
}