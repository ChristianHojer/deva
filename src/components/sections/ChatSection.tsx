import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface ChatSectionProps {
  variant?: "primary" | "code";
  className?: string;
}

export const ChatSection = ({ variant = "primary", className }: ChatSectionProps) => {
  return (
    <div className={cn(
      "flex flex-col h-full",
      variant === "primary" ? "bg-purple-50" : "bg-gray-50",
      className
    )}>
      <div className="flex-1 p-4 space-y-4">
        {/* Chat messages will go here */}
      </div>
      <div className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
          <Input placeholder="Type your message..." className="flex-1" />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
};