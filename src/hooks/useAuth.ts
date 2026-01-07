import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
}

const AUTH_TIMEOUT_MS = 5000; // 5 second timeout to prevent infinite loading

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAdmin: false,
  });
  const timeoutRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const initializedRef = useRef(false);

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

  // Clear timeout helper
  const clearAuthTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Set timeout helper - forces loading to false after timeout
  const setAuthTimeout = useCallback(() => {
    clearAuthTimeout();
    timeoutRef.current = window.setTimeout(() => {
      if (mountedRef.current) {
        console.warn('Auth timeout reached, forcing loading to false');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    }, AUTH_TIMEOUT_MS);
  }, [clearAuthTimeout]);

  useEffect(() => {
    // Prevent double initialization in StrictMode
    if (initializedRef.current) return;
    initializedRef.current = true;
    mountedRef.current = true;

    const initSession = async () => {
      setAuthTimeout();
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mountedRef.current) return;

        if (error) {
          console.error('Error getting session:', error);
          clearAuthTimeout();
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAdmin: false,
          });
          return;
        }

        if (session?.user) {
          const isAdmin = await checkAdminRole(session.user.id);
          if (!mountedRef.current) return;

          clearAuthTimeout();
          setAuthState({
            user: session.user,
            session,
            isLoading: false,
            isAdmin,
          });
        } else {
          clearAuthTimeout();
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAdmin: false,
          });
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        if (mountedRef.current) {
          clearAuthTimeout();
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
        if (!mountedRef.current) return;

        if (session?.user) {
          // Set loading but with timeout protection
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            session,
            isLoading: true,
          }));
          
          setAuthTimeout();
          const isAdmin = await checkAdminRole(session.user.id);
          
          if (!mountedRef.current) return;

          clearAuthTimeout();
          setAuthState({
            user: session.user,
            session,
            isLoading: false,
            isAdmin,
          });
        } else {
          clearAuthTimeout();
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
      mountedRef.current = false;
      clearAuthTimeout();
      subscription.unsubscribe();
    };
  }, [checkAdminRole, setAuthTimeout, clearAuthTimeout]);

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
