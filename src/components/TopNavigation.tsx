import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const tabs = [
  {
    id: 'discover',
    label: 'Discover',
    path: '/discover'
  },
  {
    id: 'iterate',
    label: 'Iterate',
    path: '/iterate'
  },
  {
    id: 'visualization',
    label: 'Visualization',
    path: '/visualization'
  },
  {
    id: 'code',
    label: 'Code',
    path: '/code'
  },
  {
    id: 'bugs',
    label: 'Bugs & such',
    path: '/bugs'
  }
];

interface TopNavigationProps {
  activeTab: string;
}

export const TopNavigation = ({ activeTab }: TopNavigationProps) => {
  const navigate = useNavigate();

  return (
    <nav className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4">
        <div className="flex h-16 items-center space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary bg-gray-200 hover:bg-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};