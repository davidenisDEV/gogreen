"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  avatar_url: string | null;
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

  // Busca perfil ou cria um se não existir (essencial para logins novos com Google)
  const ensureProfileExists = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle(); // Evita erro 406 se não encontrar

      if (data) {
        setProfile(data);
      } else {
        // Criar perfil inicial para evitar erro de FK em outras tabelas
        const { data: newProfile } = await supabase
          .from("profiles")
          .insert([
            { 
              id: currentUser.id, 
              email: currentUser.email, 
              full_name: currentUser.user_metadata.full_name || "Membro GoGreen",
              avatar_url: currentUser.user_metadata.avatar_url,
              role: 'user' 
            }
          ])
          .select()
          .single();
        
        if (newProfile) setProfile(newProfile);
      }
    } catch (err) {
      console.error("Erro ao sincronizar perfil:", err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await ensureProfileExists(session.user);
      }
      setIsLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await ensureProfileExists(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    localStorage.removeItem("gogreen_admin_token");
    window.location.href = "/";
  };

  const refreshProfile = async () => {
    if (user) await ensureProfileExists(user);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);