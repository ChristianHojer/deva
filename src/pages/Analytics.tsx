import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileDown, Loader2 } from "lucide-react";
import { Area, AreaChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, BarChart, Bar } from "recharts";
import { analyticsService, ActivityType, ErrorType } from "@/services/analyticsService";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays, startOfMonth } from "date-fns";
import { MultiSelect } from "@/components/ui/multi-select";
import { useProjects } from "@/hooks/useProjects";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Analytics() {
  const { toast } = useToast();
  const { projects } = useProjects();
  
  const [dateRange, setDateRange] = useState<DateRange & { to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [activityType, setActivityType] = useState<ActivityType>('all');
  const [errorType, setErrorType] = useState<ErrorType>('all');

  const { data: tokenUsage, isLoading: isLoadingTokens } = useQuery({
    queryKey: ['analytics', 'token-usage', dateRange, selectedProjects, activityType],
    queryFn: () => analyticsService.getTokenUsage({
      startDate: dateRange.from,
      endDate: dateRange.to,
      projectIds: selectedProjects,
      activityType
    }),
  });

  const { data: projectStats, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['analytics', 'project-stats', dateRange, selectedProjects, activityType],
    queryFn: () => analyticsService.getProjectStats({
      startDate: dateRange.from,
      endDate: dateRange.to,
      projectIds: selectedProjects,
      activityType
    }),
  });

  const { data: errorStats, isLoading: isLoadingErrors } = useQuery({
    queryKey: ['analytics', 'error-stats', dateRange, selectedProjects, errorType],
    queryFn: () => analyticsService.getErrorStats({
      startDate: dateRange.from,
      endDate: dateRange.to,
      projectIds: selectedProjects,
      errorType
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

  const handleDateRangeChange = (range: DateRange) => {
    if (range.from && range.to) {
      setDateRange(range as DateRange & { to: Date });
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
            onDateChange={handleDateRangeChange}
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
          <Select
            value={activityType}
            onValueChange={(value) => setActivityType(value as ActivityType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select activity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="message">Messages</SelectItem>
              <SelectItem value="file">Files</SelectItem>
              <SelectItem value="error">Errors</SelectItem>
              <SelectItem value="code_change">Code Changes</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={errorType}
            onValueChange={(value) => setErrorType(value as ErrorType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select error type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Errors</SelectItem>
              <SelectItem value="syntax">Syntax Errors</SelectItem>
              <SelectItem value="runtime">Runtime Errors</SelectItem>
              <SelectItem value="logic">Logic Errors</SelectItem>
              <SelectItem value="network">Network Errors</SelectItem>
              <SelectItem value="database">Database Errors</SelectItem>
              <SelectItem value="authentication">Authentication Errors</SelectItem>
              <SelectItem value="authorization">Authorization Errors</SelectItem>
              <SelectItem value="validation">Validation Errors</SelectItem>
              <SelectItem value="other">Other Errors</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{error.type}</h4>
                    <span className="text-sm text-muted-foreground px-2 py-1 bg-secondary rounded">
                      {error.errorType}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{error.description}</p>
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
