import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project } from "@/types/project";

type ActivityType = 'all' | 'chat' | 'file' | 'code';

interface AnalyticsFiltersProps {
  date: DateRange;
  onDateChange: (date: DateRange) => void;
  selectedProject: string;
  onProjectChange: (value: string) => void;
  activityType: ActivityType;
  onActivityTypeChange: (value: ActivityType) => void;
  projects?: Project[];
}

export function AnalyticsFilters({
  date,
  onDateChange,
  selectedProject,
  onProjectChange,
  activityType,
  onActivityTypeChange,
  projects
}: AnalyticsFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start">
      <div className="w-full md:w-auto">
        <DatePickerWithRange
          date={date}
          onDateChange={onDateChange}
          className="w-full md:w-[300px]"
        />
      </div>
      
      <Select value={selectedProject} onValueChange={onProjectChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Select Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects?.map(project => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={activityType} onValueChange={(value: ActivityType) => onActivityTypeChange(value)}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Activity Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Activities</SelectItem>
          <SelectItem value="chat">Chat Messages</SelectItem>
          <SelectItem value="file">File Uploads</SelectItem>
          <SelectItem value="code">Code Changes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}