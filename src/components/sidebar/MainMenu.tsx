import * as React from "react";
import { Settings, LayoutDashboard, Shield, LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { MenuItemType } from "./types";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";

interface MenuItem extends MenuItemType {
  icon: LucideIcon;
  role?: string;
}

const menuItems: MenuItem[] = [
  {
    title: "Superadmin",
    icon: Shield,
    url: "/superadmin",
    role: "superadmin"
  },
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
  {
    title: "User Settings",
    icon: Settings,
    url: "/settings",
  },
];

export function MainMenu() {
  const { profile } = useProfile();
  const location = useLocation();

  const filteredItems = menuItems.filter(item => 
    !item.role || item.role === profile?.role
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {filteredItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.url} 
                  className={cn(
                    "flex items-center gap-2",
                    "hover:scale-105 transition-transform",
                    location.pathname === item.url && "text-primary font-medium"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}