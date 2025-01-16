import { ScrollArea } from "@/components/ui/scroll-area";

export const BugsList = () => {
  return (
    <div className="h-full bg-[#F1F1F1] p-4">
      <ScrollArea className="h-full">
        <div className="space-y-4">
          {/* Example bug items */}
          <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Navigation Bug</h3>
            <p className="text-sm text-gray-500">Links not working in mobile view</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Styling Issue</h3>
            <p className="text-sm text-gray-500">Button colors inconsistent</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Performance Problem</h3>
            <p className="text-sm text-gray-500">Slow loading on image gallery</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};