import { ScrollArea } from "@/components/ui/scroll-area";

export const BugsList = () => {
  const bugs = [
    {
      id: 1,
      title: "Navigation Bug",
      description: "Links not working in mobile view",
      priority: "High",
      status: "Open"
    },
    {
      id: 2,
      title: "Styling Issue",
      description: "Button colors inconsistent",
      priority: "Medium",
      status: "In Progress"
    },
    {
      id: 3,
      title: "Performance Problem",
      description: "Slow loading on image gallery",
      priority: "High",
      status: "Open"
    },
    {
      id: 4,
      title: "Layout Bug",
      description: "Footer misaligned on small screens",
      priority: "Low",
      status: "Open"
    }
  ];

  return (
    <div className="h-full bg-white p-4">
      <ScrollArea className="h-full">
        <div className="space-y-4">
          {bugs.map((bug) => (
            <div 
              key={bug.id} 
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{bug.title}</h3>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    bug.priority === "High" 
                      ? "bg-red-100 text-red-700" 
                      : bug.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {bug.priority}
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                    {bug.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{bug.description}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};