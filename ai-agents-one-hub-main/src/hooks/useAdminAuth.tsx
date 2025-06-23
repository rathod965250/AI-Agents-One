import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables, Json } from '@/integrations/supabase/types';

interface UserRole {
  id: string;
  user_id: string;
  role: 'user' | 'admin' | 'moderator';
  assigned_by: string | null;
  assigned_at: string;
  created_at: string;
}

export const useAdminAuth = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        // Check if user has admin role
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          setUserRole(null);
        } else if (roleData) {
          setIsAdmin(true);
          setUserRole(roleData);
        } else {
          setIsAdmin(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [user, authLoading]);

  const logAdminAction = async (action: string, resourceType: string, resourceId?: string, oldValues?: Json, newValues?: Json) => {
    if (!user || !isAdmin) return;

    try {
      await supabase.from('admin_audit_logs').insert({
        admin_id: user.id,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        old_values: oldValues,
        new_values: newValues,
        ip_address: null, // Could be enhanced to get real IP
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  };

  const assignRole = async (userId: string, role: 'user' | 'admin' | 'moderator') => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to assign roles.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role,
          assigned_by: user.id
        });

      if (error) throw error;

      await logAdminAction('assign_role', 'user_roles', userId, null, { role });
      
      toast({
        title: "Role Assigned",
        description: `User role updated to ${role}.`
      });
      return true;
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "Failed to assign role.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    isAdmin,
    userRole,
    loading: loading || authLoading,
    logAdminAction,
    assignRole
  };
};
