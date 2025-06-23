import { Routes, Route } from 'react-router-dom';
import AdminRoute from '@/components/admin/AdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import AdminAgents from './AdminAgents';
import AdminUsers from './AdminUsers';
import AdminReviews from './AdminReviews';
import SiteSettings from '@/components/admin/SiteSettings';
import AdminAnalytics from './AdminAnalytics';
import CategoriesManager from '@/components/admin/CategoriesManager';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/20">
      <AdminRoute>
        <AdminLayout>
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="agents" element={<AdminAgents />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="categories" element={<CategoriesManager />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="audit" element={
              <div className="text-center py-8 bg-white/50 backdrop-blur-sm rounded-lg border border-blue-100">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Audit Logs
                </h2>
                <p className="text-gray-600">Coming Soon</p>
              </div>
            } />
            <Route path="settings" element={<SiteSettings />} />
          </Routes>
        </AdminLayout>
      </AdminRoute>
    </div>
  );
};

export default Admin;
