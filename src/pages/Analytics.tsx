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

type TokenUsageRow = Database['public']['Tables']['token_usage']['Row'];

export function Analytics() {
  const { monthlyUsage, yearlyUsage, isLoading } = useTokenUsage();
  const { projects } = useProjects();
  const { toast } = useToast();
  const [realtimeData, setRealtimeData] = useState<Array<{ timestamp: string; tokens: number }>>([]);
  const [projectUsage, setProjectUsage] = useState<Array<{ name: string; tokens: number }>>([]);

  useEffect(() => {
    const fetchProjectUsage = async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const { data, error } = await supabase
        .from('token_usage')
        .select('project_id, tokens_used')
        .gte('created_at', startOfMonth.toISOString());

      if (error) {
        console.error('Error fetching project usage:', error);
        return;
      }

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
    };

    fetchProjectUsage();
  }, [projects]);

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
          if (payload.new && 'tokens_used' in payload.new && typeof payload.new.tokens_used === 'number') {
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
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Token Usage Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <TokenUsageStats
              monthlyUsage={monthlyUsage}
              yearlyUsage={yearlyUsage}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        <RealtimeTokenChart data={realtimeData} />
        <ProjectTokenChart data={projectUsage} />
      </div>
    </div>
  );
}