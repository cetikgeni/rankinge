import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
}

const AUTH_TIMEOUT_MS = 5000;

// ---- Singleton auth store (prevents N subscriptions + repeated getSession calls) ----
let initialized = false;
let timeoutId: number | null = null;
let mounted = true;

let currentState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  isAdmin: false,
};

const listeners = new Set<(s: AuthState) => void>();

function emit(next: AuthState) {
  currentState = next;
  for (const l of listeners) l(currentState);
}

async function checkAdminRole(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      console.error("Error checking admin role:", error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error("Exception checking admin role:", err);
    return false;
  }
}

function clearAuthTimeout() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

function setAuthTimeout() {
  clearAuthTimeout();
  timeoutId = window.setTimeout(() => {
    // Only warn once per app load; avoids noisy logs when multiple components mount.
    console.warn("Auth timeout reached, forcing loading to false");
    emit({ ...currentState, isLoading: false });
  }, AUTH_TIMEOUT_MS);
}

async function initAuthOnce() {
  if (initialized) return;
  initialized = true;
  mounted = true;

  setAuthTimeout();

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      clearAuthTimeout();
      emit({ user: null, session: null, isLoading: false, isAdmin: false });
    } else if (session?.user) {
      const isAdmin = await checkAdminRole(session.user.id);
      clearAuthTimeout();
      emit({ user: session.user, session, isLoading: false, isAdmin });
    } else {
      clearAuthTimeout();
      emit({ user: null, session: null, isLoading: false, isAdmin: false });
    }
  } catch (e) {
    console.error("Error initializing session:", e);
    clearAuthTimeout();
    emit({ user: null, session: null, isLoading: false, isAdmin: false });
  }

  const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!mounted) return;

    if (!session?.user) {
      clearAuthTimeout();
      emit({ user: null, session: null, isLoading: false, isAdmin: false });
      return;
    }

    // Refresh admin state with timeout protection
    emit({ user: session.user, session, isLoading: true, isAdmin: false });
    setAuthTimeout();

    const isAdmin = await checkAdminRole(session.user.id);
    clearAuthTimeout();
    emit({ user: session.user, session, isLoading: false, isAdmin });
  });

  // Keep subscription around for app lifetime
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _sub = data.subscription;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(currentState);

  useEffect(() => {
    initAuthOnce();
    const handler = (s: AuthState) => setState(s);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const refreshAdminStatus = async () => {
    if (!currentState.user) return;
    const isAdmin = await checkAdminRole(currentState.user.id);
    emit({ ...currentState, isAdmin });
  };

  return { ...state, refreshAdminStatus };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

