import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenUsageStats } from "@/components/dashboard/TokenUsageStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TokenUsageOverviewCardProps {
  monthlyUsage: number;
  yearlyUsage: number;
  isLoading: boolean;
}

export function TokenUsageOverviewCard({ monthlyUsage, yearlyUsage, isLoading }: TokenUsageOverviewCardProps) {
  return (
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
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ) : (
          <TokenUsageStats
            monthlyUsage={monthlyUsage}
            yearlyUsage={yearlyUsage}
            isLoading={isLoading}
          />
        )}
      </CardContent>
    </Card>
  );
}