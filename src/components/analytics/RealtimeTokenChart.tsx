import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";

interface RealtimeTokenChartProps {
  data: Array<{ timestamp: string; tokens: number }>;
}

export function RealtimeTokenChart({ data }: RealtimeTokenChartProps) {
  return (
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
          <AreaChart data={data}>
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
  );
}