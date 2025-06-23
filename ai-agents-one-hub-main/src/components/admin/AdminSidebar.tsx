
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  Users,
  FileText,
  Star,
  FolderTree,
  Settings,
  Shield,
  Activity,
  Database
} from 'lucide-react';

const adminMenuItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: BarChart3,
    description: 'Overview and metrics'
  },
  {
    title: 'Agent Management',
    url: '/admin/agents',
    icon: Database,
    description: 'Manage AI agents'
  },
  {
    title: 'User Management',
    url: '/admin/users',
    icon: Users,
    description: 'Manage users and roles'
  },
  {
    title: 'Reviews Management',
    url: '/admin/reviews',
    icon: Star,
    description: 'Moderate reviews'
  },
  {
    title: 'Categories',
    url: '/admin/categories',
    icon: FolderTree,
    description: 'Manage categories'
  },
  {
    title: 'Analytics',
    url: '/admin/analytics',
    icon: Activity,
    description: 'Detailed analytics'
  },
  {
    title: 'Audit Logs',
    url: '/admin/audit',
    icon: Shield,
    description: 'Admin activity logs'
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings,
    description: 'System settings'
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  const isActiveRoute = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-gray-900 mb-4">
            {!isCollapsed ? 'Admin Panel' : 'Admin'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 ${
                          isActive || isActiveRoute(item.url)
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-700 hover:text-gray-900'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex flex-col">
                          <span>{item.title}</span>
                          <span className="text-xs text-gray-500">{item.description}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
