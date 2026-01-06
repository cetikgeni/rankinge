import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAdmin: false,
  });

  const checkAdminRole = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Exception checking admin role:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (session?.user) {
          // Keep loading state until role check completes to avoid "not admin" flicker.
          setAuthState({
            user: session.user,
            session,
            isLoading: true,
            isAdmin: false,
          });

          const isAdmin = await checkAdminRole(session.user.id);
          if (!isMounted) return;

          setAuthState({
            user: session.user,
            session,
            isLoading: false,
            isAdmin,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAdmin: false,
          });
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        if (isMounted) {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAdmin: false,
          });
        }
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          // Keep loading until role check completes to avoid route guard flicker.
          setAuthState({
            user: session.user,
            session,
            isLoading: true,
            isAdmin: false,
          });

          const isAdmin = await checkAdminRole(session.user.id);
          if (!isMounted) return;

          setAuthState({
            user: session.user,
            session,
            isLoading: false,
            isAdmin,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAdmin: false,
          });
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminRole]);

  // Provide a refresh function to manually re-check admin status
  const refreshAdminStatus = useCallback(async () => {
    if (authState.user) {
      const isAdmin = await checkAdminRole(authState.user.id);
      setAuthState(prev => ({ ...prev, isAdmin }));
    }
  }, [authState.user, checkAdminRole]);

  return { ...authState, refreshAdminStatus };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
