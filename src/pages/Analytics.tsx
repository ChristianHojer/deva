import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenUsageStats } from "@/components/dashboard/TokenUsageStats";
import { useTokenUsage } from "@/hooks/useTokenUsage";
import { supabase } from "@/lib/supabase";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";

export function Analytics() {
  const { monthlyUsage, yearlyUsage, isLoading } = useTokenUsage();
  const [realtimeData, setRealtimeData] = useState<Array<{ timestamp: string; tokens: number }>>([]);

  useEffect(() => {
    // Subscribe to real-time token usage updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'token_usage'
        },
        (payload) => {
          const timestamp = new Date().toLocaleTimeString();
          const tokens = payload.new.tokens_used;
          
          setRealtimeData(prev => {
            const newData = [...prev, { timestamp, tokens }];
            // Keep only last 10 data points for better visualization
            return newData.slice(-10);
          });
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
      </div>
    </div>
  );
}
