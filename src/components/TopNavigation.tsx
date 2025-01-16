import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const tabs = [
  {
    id: 'ideation',
    label: 'Ideation',
    children: [
      { id: 'discover', label: 'Discover', path: '/discover' },
      { id: 'iterate', label: 'Iterate', path: '/iterate' }
    ]
  },
  { 
    id: 'visualization', 
    label: 'Visualization',
    path: '/visualization'
  },
  { 
    id: 'development',
    label: 'Development',
    children: [
      { id: 'code', label: 'Code', path: '/code' },
      { id: 'bugs', label: 'Bugs & such', path: '/bugs' }
    ]
  }
];

interface TopNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TopNavigation = ({ activeTab, setActiveTab }: TopNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tabId: string, path: string) => {
    setActiveTab(tabId);
    navigate(path);
  };

  return (
    <nav className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4">
        <div className="flex h-16 items-center">
          <NavigationMenu>
            <NavigationMenuList>
              {tabs.map((tab) => (
                <NavigationMenuItem key={tab.id}>
                  {tab.children ? (
                    <div className="flex items-center">
                      <div className="relative flex rounded-lg overflow-hidden bg-gray-200">
                        {tab.children.map((child, index) => (
                          <button
                            key={child.id}
                            onClick={() => handleTabClick(child.id, child.path)}
                            className={cn(
                              "px-4 py-2 text-sm font-medium transition-colors relative",
                              location.pathname === child.path
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-primary hover:bg-gray-300",
                              index === 0 && "rounded-l-md",
                              index === tab.children.length - 1 && "rounded-r-md"
                            )}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleTabClick(tab.id, tab.path)}
                      className={cn(
                        "px-4 py-2 mx-2 rounded-md text-sm font-medium transition-colors",
                        location.pathname === tab.path
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-primary bg-gray-200 hover:bg-gray-300"
                      )}
                    >
                      {tab.label}
                    </button>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};