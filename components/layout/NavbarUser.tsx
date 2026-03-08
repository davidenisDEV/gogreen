"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, User, ChevronDown, History, Heart, LogOut, ShieldCheck, MapPin
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";

export function NavbarUser({ user, profile }: { user: any, profile: any }) {
  const { openCart, items } = useCart();
  const { signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const hasItems = items.length > 0;
  const isVIP = profile?.role === 'vip';
  const firstName = profile?.full_name?.split(' ')[0] || "Membro";

  // Fechar o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#080a09]/90 backdrop-blur-md border-b border-white/[0.05] py-4 shadow-sm">
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        <Link href="/" className="flex flex-col leading-none group">
          <span className="font-display text-2xl text-white group-hover:text-green-500 transition-colors">GoGreen</span>
          <span className="font-sans text-[10px] font-bold tracking-widest text-zinc-500 uppercase">HEADSHOP</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] pl-1 pr-3 py-1 rounded-full transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-zinc-400" />
                )}
              </div>
              <span className="text-sm font-bold text-white max-w-[100px] truncate">{firstName}</span>
              {isVIP && <ShieldCheck className="w-4 h-4 text-green-500" />}
              <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#080a09] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2">
                
                <div className="p-4 border-b border-zinc-900 bg-white/[0.02]">
                  <p className="text-sm font-bold text-white">{profile?.full_name || "Membro GoGreen"}</p>
                  <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                </div>

                <div className="p-2 flex flex-col gap-1">
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm font-medium text-zinc-400 hover:bg-white/[0.03] hover:text-white rounded-xl transition-colors">
                    <User className="w-4 h-4" /> Perfil & Moradas
                  </Link>
                  <Link href="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm font-medium text-zinc-400 hover:bg-white/[0.03] hover:text-white rounded-xl transition-colors">
                    <History className="w-4 h-4" /> Meus Pedidos
                  </Link>
                  <Link href="/favorites" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm font-medium text-zinc-400 hover:bg-white/[0.03] hover:text-white rounded-xl transition-colors">
                    <Heart className="w-4 h-4" /> Favoritos
                  </Link>
                </div>

                <button 
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 p-4 text-sm font-bold text-red-500 hover:bg-red-500/10 border-t border-zinc-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Encerrar Sessão
                </button>
              </div>
            )}
          </div>

          <button onClick={openCart} className="relative p-2.5 bg-white/[0.02] border border-white/[0.05] hover:border-green-500 rounded-full group">
            <ShoppingBag className="w-5 h-5 text-zinc-300 group-hover:text-green-500" />
            {hasItems && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-black text-[10px] font-bold border-2 border-[#080a09] rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}