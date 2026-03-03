"use client";

import { useAuth } from "@/context/auth-context";
import { NavbarUser } from "./NavbarUser";
import { NavbarGuest } from "./NavbarGuest";

export function Navbar() {
  const { user, profile, isLoading } = useAuth();

  // Enquanto carrega a sessão do Supabase, mostramos um estado neutro
  if (isLoading) {
    return <div className="h-[73px] w-full bg-white border-b border-green-100 animate-pulse" />;
  }

  // Se houver usuário e o perfil estiver carregado, mostra a barra VIP
  if (user && profile) {
    return <NavbarUser user={user} profile={profile} />;
  }

  // Caso contrário, mostra a barra para visitantes (padrão)
  return <NavbarGuest />;
}