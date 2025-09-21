import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { logActivity } from '../services/database';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);

        // Log authentication events
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            await logActivity({
              log_id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              user_id: session.user.id,
              action: 'تسجيل دخول',
              details: 'تم تسجيل الدخول بنجاح',
              ip_address: null,
              user_agent: navigator.userAgent
            });
          } catch (error) {
            console.error('Failed to log sign in activity:', error);
          }
        }

        if (event === 'SIGNED_OUT') {
          try {
            await logActivity({
              log_id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              user_id: user?.id || null,
              action: 'تسجيل خروج',
              details: 'تم تسجيل الخروج',
              ip_address: null,
              user_agent: navigator.userAgent
            });
          } catch (error) {
            console.error('Failed to log sign out activity:', error);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export function useRealTimeSubscription<T>(
  table: string,
  filter?: string,
  callback?: (payload: any) => void
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      try {
        let query = supabase.from(table).select('*');
        
        if (filter) {
          // Parse filter string like "organization_id=eq.123"
          const [column, operator, value] = filter.split(/[=.]/);
          if (operator === 'eq') {
            query = query.eq(column, value);
          }
        }
        
        const { data: initialData, error } = await query;
        if (error) throw error;
        
        setData(initialData || []);
      } catch (error) {
        console.error(`Error fetching ${table}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter
        },
        (payload) => {
          if (callback) {
            callback(payload);
          }
          
          // Update local data based on the event
          if (payload.eventType === 'INSERT') {
            setData(prev => [payload.new as T, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => prev.map(item => 
              (item as any).id === payload.new.id ? payload.new as T : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter(item => 
              (item as any).id !== payload.old.id
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter]);

  return { data, loading };
}

// Custom hooks for specific entities
export function useOrganizations() {
  return useRealTimeSubscription<Organization>('organizations');
}

export function useSurveys(organizationId?: string) {
  const filter = organizationId ? `organization_id=eq.${organizationId}` : undefined;
  return useRealTimeSubscription<Survey>('surveys', filter);
}

export function useBeneficiaries(organizationId?: string) {
  const filter = organizationId ? `organization_id=eq.${organizationId}` : undefined;
  return useRealTimeSubscription<Beneficiary>('beneficiaries', filter);
}

export function useActivityLogs(organizationId?: string) {
  const filter = organizationId ? `organization_id=eq.${organizationId}` : undefined;
  return useRealTimeSubscription<ActivityLog>('activity_log', filter);
}

export function useTransactions(organizationId?: string) {
  const filter = organizationId ? `organization_id=eq.${organizationId}` : undefined;
  return useRealTimeSubscription<Transaction>('transactions', filter);
}

export function useOrganizationRequests() {
  return useRealTimeSubscription<Request>('requests');
}

// Export types for components
export type {
  User,
  Organization,
  Survey,
  Beneficiary,
  Response,
  ActivityLog,
  Transaction,
  Request,
  Role,
  SubscriptionPlan
};