import { ReactNode } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import Footer from '@/components/Footer';
import { SidebarProvider } from '@/components/ui/sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/10 flex flex-col">
        <AdminHeader />
        <AdminBreadcrumb />
        
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-6 bg-white/50 backdrop-blur-sm rounded-lg m-4 border border-blue-100">
            {children}
          </main>
        </div>
        
        <Footer />
      </div>
    </SidebarProvider>
  );
}
