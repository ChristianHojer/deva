import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

const tabGroups = [
  {
    id: 'creation',
    tabs: [
      { id: 'discover', label: 'Discover', path: '/discover' },
      { id: 'iterate', label: 'Iterate', path: '/iterate' }
    ]
  },
  {
    id: 'visualization',
    tabs: [
      { id: 'visualize', label: 'Visualization', path: '/visualize' }
    ]
  },
  {
    id: 'development',
    tabs: [
      { id: 'code', label: 'Code', path: '/code' },
      { id: 'bugs', label: 'Bugs', path: '/bugs' }
    ]
  }
];

interface TopNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projectId?: string;
}

export const TopNavigation = ({ activeTab, setActiveTab, projectId }: TopNavigationProps) => {
  const location = useLocation();

  return (
    <nav className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4">
        <div className="flex h-16 items-center">
          <div className="flex items-center space-x-4">
            {tabGroups.map((group) => (
              <div
                key={group.id}
                className={cn(
                  "flex items-center rounded-lg h-10",
                  group.id !== 'visualization' && "bg-gray-100 p-1"
                )}
              >
                <div className="flex items-center space-x-1">
                  {group.tabs.map((tab) => (
                    <Link
                      key={tab.id}
                      to={`/project/${projectId}${tab.path}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "h-8 px-4 flex items-center rounded-md text-sm font-medium transition-colors",
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-primary hover:bg-gray-200"
                      )}
                    >
                      {tab.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};