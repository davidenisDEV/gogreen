"use client";

import { useAuth } from "@/context/auth-context";
import { NavbarGuest } from "./NavbarGuest";
import { NavbarUser } from "./NavbarUser";

export function Navbar() {
  const { user, profile, isLoading } = useAuth();

  // Enquanto verifica o login, mostra apenas a barra vazia translúcida para não piscar
  if (isLoading) {
    return (
      <header className="fixed top-0 w-full z-50 bg-[#080a09]/90 backdrop-blur-md border-b border-white/[0.05] h-[73px] shadow-sm" />
    );
  }

  // Se tem utilizador, mostra o menu User, senão, mostra o menu Guest
  return user ? <NavbarUser user={user} profile={profile} /> : <NavbarGuest />;
}