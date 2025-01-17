import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenUsageStats } from "@/components/dashboard/TokenUsageStats";
import { useTokenUsage } from "@/hooks/useTokenUsage";
import { supabase } from "@/lib/supabase";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, BarChart, Bar, Legend } from "recharts";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { useProjects } from "@/hooks/useProjects";

type TokenUsageRow = Database['public']['Tables']['token_usage']['Row'];

export function Analytics() {
  const { monthlyUsage, yearlyUsage, isLoading } = useTokenUsage();
  const { projects } = useProjects();
  const [realtimeData, setRealtimeData] = useState<Array<{ timestamp: string; tokens: number }>>([]);
  const [projectUsage, setProjectUsage] = useState<Array<{ name: string; tokens: number }>>([]);

  useEffect(() => {
    // Fetch project-specific token usage
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

      // Aggregate tokens by project
      const projectTokens = data.reduce((acc: Record<string, number>, curr) => {
        if (curr.project_id) {
          acc[curr.project_id] = (acc[curr.project_id] || 0) + curr.tokens_used;
        }
        return acc;
      }, {});

      // Map to project names
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      
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

        <Card>
          <CardHeader>
            <CardTitle>Real-time Token Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[200px]"
              config={{
                tokens: {
                  theme: {
                    light: "hsl(var(--primary))",
                    dark: "hsl(var(--primary))",
                  },
                },
              }}
            >
              <AreaChart data={realtimeData}>
                <XAxis 
                  dataKey="timestamp"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  width={40}
                />
                <ChartTooltip />
                <Area
                  type="monotone"
                  dataKey="tokens"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary)/.2)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Token Usage by Project</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px]"
              config={{
                tokens: {
                  theme: {
                    light: "hsl(var(--primary))",
                    dark: "hsl(var(--primary))",
                  },
                },
              }}
            >
              <BarChart data={projectUsage}>
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  width={40}
                />
                <ChartTooltip />
                <Bar
                  dataKey="tokens"
                  fill="hsl(var(--primary))"
                />
                <Legend />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}