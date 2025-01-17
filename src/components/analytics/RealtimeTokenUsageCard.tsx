import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RealtimeTokenChart } from "./RealtimeTokenChart";

interface RealtimeTokenUsageCardProps {
  data: Array<{ timestamp: string; tokens: number }>;
  isLoading: boolean;
}

export function RealtimeTokenUsageCard({ data, isLoading }: RealtimeTokenUsageCardProps) {
  return (
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
          <RealtimeTokenChart data={data} />
        )}
      </CardContent>
    </Card>
  );
}