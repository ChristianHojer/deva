import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface TokenUsageData {
  used: number;
  limit: number;
}

interface TokenUsageStatsProps {
  monthlyUsage: TokenUsageData;
  yearlyUsage: TokenUsageData;
  isLoading: boolean;
}

export const TokenUsageStats = ({ monthlyUsage, yearlyUsage, isLoading }: TokenUsageStatsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row justify-between mb-2 gap-2">
          <span className="text-sm font-medium">Monthly Usage</span>
          <span className="text-sm text-muted-foreground">
            {monthlyUsage.used}/{monthlyUsage.limit} tokens
          </span>
        </div>
        <Progress value={(monthlyUsage.used / monthlyUsage.limit) * 100} className="h-2" />
        {monthlyUsage.used / monthlyUsage.limit > 0.9 && (
          <p className="text-sm text-yellow-600 mt-1">You are nearing your monthly token limit</p>
        )}
      </div>
      <div>
        <div className="flex flex-col sm:flex-row justify-between mb-2 gap-2">
          <span className="text-sm font-medium">Yearly Usage</span>
          <span className="text-sm text-muted-foreground">
            {yearlyUsage.used}/{yearlyUsage.limit} tokens
          </span>
        </div>
        <Progress value={(yearlyUsage.used / yearlyUsage.limit) * 100} className="h-2" />
        {yearlyUsage.used / yearlyUsage.limit > 0.9 && (
          <p className="text-sm text-yellow-600 mt-1">You are nearing your yearly token limit</p>
        )}
      </div>
    </div>
  );
};