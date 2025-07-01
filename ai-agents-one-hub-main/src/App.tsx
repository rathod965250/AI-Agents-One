import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import mixpanel from 'mixpanel-browser';

// Lazy load components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Browse = lazy(() => import("./pages/Browse"));
const Guide = lazy(() => import("./pages/Guide"));
// const AgentDetail = lazy(() => import("./pages/AgentDetail")); // Temporarily disabled for debugging
import AgentDetail from "./pages/AgentDetail";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Submit = lazy(() => import("./pages/Submit"));
const Admin = lazy(() => import("./pages/Admin"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Compare = lazy(() => import("./pages/Compare"));
const Categories = lazy(() => import("./pages/Categories"));
const CategoryAgents = lazy(() => import("./pages/CategoryAgents"));

const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/browse", element: <Browse /> },
  { path: "/categories", element: <Categories /> },
  { path: "/categories/:slug", element: <CategoryAgents /> },
  { path: "/guide", element: <Guide /> },
  { path: "/agent/:slug", element: <AgentDetail /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/submit", element: <Submit /> },
  { path: "/auth", element: <Auth /> },
  { path: "/admin/*", element: <Admin /> },
  { path: "/compare", element: <Compare /> },
  { path: "*", element: <NotFound /> },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component
const PageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-16 w-full mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="app">
            <Toaster />
            <Sonner />
            <Suspense fallback={<PageSkeleton />}>
              <RouterProvider router={router} />
            </Suspense>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
