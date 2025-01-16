import { ScrollArea } from "@/components/ui/scroll-area";

export const BugsList = () => {
  return (
    <div className="h-full bg-gray-50 p-4">
      <ScrollArea className="h-full">
        <div className="space-y-4">
          {/* Bug items will go here */}
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-medium">Example Bug</h3>
            <p className="text-sm text-gray-500">This is a placeholder for bug items</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};