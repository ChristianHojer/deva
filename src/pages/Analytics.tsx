import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, FileDown, Loader2 } from "lucide-react";
import { Area, AreaChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, BarChart, Bar } from "recharts";
import { analyticsService } from "@/services/analyticsService";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays, startOfMonth } from "date-fns";
import { MultiSelect } from "@/components/ui/multi-select";
import { useProjects } from "@/hooks/useProjects";

export function Analytics() {
  const { toast } = useToast();
  const { projects } = useProjects();
  
  // Date range state
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  // Project selection state
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const { data: tokenUsage, isLoading: isLoadingTokens } = useQuery({
    queryKey: ['analytics', 'token-usage', dateRange, selectedProjects],
    queryFn: () => analyticsService.getTokenUsage({
      startDate: dateRange.from,
      endDate: dateRange.to,
      projectIds: selectedProjects
    }),
  });

  const { data: projectStats, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['analytics', 'project-stats', dateRange, selectedProjects],
    queryFn: () => analyticsService.getProjectStats({
      startDate: dateRange.from,
      endDate: dateRange.to,
      projectIds: selectedProjects
    }),
  });

  const { data: errorStats, isLoading: isLoadingErrors } = useQuery({
    queryKey: ['analytics', 'error-stats', dateRange, selectedProjects],
    queryFn: () => analyticsService.getErrorStats({
      startDate: dateRange.from,
      endDate: dateRange.to,
      projectIds: selectedProjects
    }),
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'csv') => {
    try {
      setIsExporting(true);
      await analyticsService.exportAnalytics({
        format,
        startDate: dateRange.from,
        endDate: dateRange.to,
        projectIds: selectedProjects
      });
      
      toast({
        title: "Export Successful",
        description: `Analytics data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export analytics data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoadingTokens || isLoadingProjects || isLoadingErrors) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header and Filters */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your project metrics and usage</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => handleExport('csv')}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="mr-2 h-4 w-4" />
              )}
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export PDF
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
          />
          <MultiSelect
            placeholder="Select projects"
            options={projects?.map(project => ({
              label: project.name,
              value: project.id
            })) || []}
            value={selectedProjects}
            onChange={setSelectedProjects}
          />
        </div>
      </div>

      {/* Token Usage Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Token Usage Over Time</CardTitle>
          <CardDescription>Track your token consumption trends</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tokenUsage?.timeline}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="tokens" stroke="#2563eb" fill="#3b82f6" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Activity</CardTitle>
            <CardDescription>Files and messages per project</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStats?.activity}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="files" fill="#3b82f6" />
                <Bar dataKey="messages" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Analysis</CardTitle>
            <CardDescription>Common errors and solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {errorStats?.common_errors.map((error, index) => (
                <div key={index} className="p-4 rounded-lg border">
                  <h4 className="font-medium">{error.type}</h4>
                  <p className="text-sm text-muted-foreground">{error.description}</p>
                  <p className="text-sm font-medium mt-2">Suggested Fix:</p>
                  <p className="text-sm text-muted-foreground">{error.solution}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}