import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsHeaderProps {
  onExport: (format: 'csv' | 'pdf') => Promise<void>;
}

export function AnalyticsHeader({ onExport }: AnalyticsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onExport('csv')}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Button
          variant="outline"
          onClick={() => onExport('pdf')}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}