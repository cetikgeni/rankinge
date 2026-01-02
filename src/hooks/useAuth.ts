import { useState, useEffect } from 'react';
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

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;
      
      if (session?.user) {
        const isAdmin = await checkAdminRole(session.user.id);
        if (isMounted) {
          setAuthState({
            user: session.user,
            session,
            isLoading: false,
            isAdmin,
          });
        }
      } else {
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          isAdmin: false,
        });
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        setAuthState(prev => ({
          ...prev,
          user: session?.user ?? null,
          session: session,
          isLoading: false,
        }));
        
        // Defer admin check with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(async () => {
            if (!isMounted) return;
            const isAdmin = await checkAdminRole(session.user.id);
            if (isMounted) {
              setAuthState(prev => ({
                ...prev,
                isAdmin,
              }));
            }
          }, 0);
        } else {
          setAuthState(prev => ({
            ...prev,
            isAdmin: false,
          }));
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return authState;
};

async function checkAdminRole(userId: string): Promise<boolean> {
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
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
