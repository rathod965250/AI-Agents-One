import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { User, FileText, Heart, Settings, BarChart3, Star } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import MySubmissions from '@/components/dashboard/MySubmissions';
import MyReviews from '@/components/dashboard/MyReviews';
import MyFavorites from '@/components/dashboard/MyFavorites';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import UserSidebar from '@/components/dashboard/UserSidebar';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'submissions', label: 'My Submissions', icon: FileText },
    { id: 'reviews', label: 'My Reviews', icon: Star },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'submissions':
        return <MySubmissions />;
      case 'reviews':
        return <MyReviews />;
      case 'favorites':
        return <MyFavorites />;
      case 'settings':
        return <ProfileSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <Breadcrumbs />
      
      <div className="flex-1">
        <SidebarProvider>
          <div className="flex">
            <UserSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <SidebarInset>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <User className="h-6 w-6" />
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>
                {renderContent()}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
