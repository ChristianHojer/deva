import { cn } from "@/lib/utils";
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
      { id: 'discover', label: 'Discover' },
      { id: 'iterate', label: 'Iterate' }
    ]
  },
  { id: 'visualization', label: 'Visualization' },
  { id: 'code', label: 'Code' },
  { id: 'bugs', label: 'Bugs & such' }
];

interface TopNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TopNavigation = ({ activeTab, setActiveTab }: TopNavigationProps) => {
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
                      <div className="relative flex rounded-lg overflow-hidden bg-muted/50">
                        {tab.children.map((child, index) => (
                          <button
                            key={child.id}
                            onClick={() => setActiveTab(child.id)}
                            className={cn(
                              "px-4 py-2 text-sm font-medium transition-colors relative",
                              activeTab === child.id
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-primary hover:bg-muted",
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
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "px-4 py-2 mx-2 rounded-md text-sm font-medium transition-colors",
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-primary hover:bg-muted"
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