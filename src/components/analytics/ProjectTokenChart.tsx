import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, Legend, XAxis, YAxis } from "recharts";

interface ProjectTokenChartProps {
  data: Array<{ name: string; tokens: number }>;
}

export function ProjectTokenChart({ data }: ProjectTokenChartProps) {
  return (
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
          <BarChart data={data}>
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
  );
}