import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ProjectTokenChart } from "./ProjectTokenChart";

interface ProjectTokenUsageCardProps {
  data: Array<{ name: string; tokens: number }>;
  isLoading: boolean;
}

export function ProjectTokenUsageCard({ data, isLoading }: ProjectTokenUsageCardProps) {
  return (
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
          <ProjectTokenChart data={data} />
        )}
      </CardContent>
    </Card>
  );
}