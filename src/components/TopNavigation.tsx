import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

const tabs = [
  { id: 'discover', label: 'Discover', path: '/discover' },
  { id: 'iterate', label: 'Iterate', path: '/iterate' },
  { id: 'visualization', label: 'Visualization', path: '/visualization' },
  { id: 'code', label: 'Code', path: '/code' },
  { id: 'bugs', label: 'Bugs', path: '/bugs' }
];

interface TopNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TopNavigation = ({ activeTab, setActiveTab }: TopNavigationProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4">
        <div className="flex h-16 items-center">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  currentPath === tab.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-primary bg-gray-200 hover:bg-gray-300"
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};