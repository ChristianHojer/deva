import { cn } from "@/lib/utils";

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
  { id: 'profile', label: 'Profile' },
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
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "tab-transition hover-scale px-4 py-2 mx-2 rounded-md text-sm font-medium",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};