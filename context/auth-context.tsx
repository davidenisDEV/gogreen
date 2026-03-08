"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  avatar_url: string | null;
  phone: string | null;
  points: number;
};

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isSyncing = useRef(false);

  const ensureProfileExists = async (currentUser: User) => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle();

      if (data) {
        setProfile(data);
      } else {
        // Puxa o nome e telefone que enviamos no formulário de Registo
        const fullName = currentUser.user_metadata?.full_name || "Membro";
        const phone = currentUser.user_metadata?.phone || null;

        const { data: newProfile } = await supabase.from("profiles").insert([{ 
            id: currentUser.id, 
            email: currentUser.email, 
            full_name: fullName, 
            phone: phone,
            role: 'user', 
            points: 0
        }]).select().single();
        
        if (newProfile) setProfile(newProfile);
      }
    } catch (err) {
      console.error("Erro interno:", err);
    } finally {
      isSyncing.current = false;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Escuta simples e direta do Login via Email
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          await ensureProfileExists(session.user);
        }
        setIsLoading(false);
      } else {
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null); 
    setProfile(null);
    if (typeof window !== "undefined") {
      Object.keys(localStorage).forEach(key => { if (key.includes('sb-')) localStorage.removeItem(key); });
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);