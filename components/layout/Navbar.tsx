"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, User, ChevronDown, History, Heart, Settings, LogOut
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { openCart, items } = useCart();
  // ADICIONADO: Puxando o isLoading para evitar o "piscar" da tela
  const { user, profile, signOut, isLoading } = useAuth(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasItems = items.length > 0;

  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || "";
  const firstName = fullName ? fullName.split(' ')[0] : "Membro";
  const avatar = profile?.avatar_url || user?.user_metadata?.avatar_url;

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    await signOut();
    window.location.href = "/login";
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-urban-black/90 backdrop-blur-md border-b border-zinc-900 py-4 transition-all shadow-sm">
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        <Link href="/" className="flex flex-col leading-none group">
          <span className="font-display text-2xl text-green-neon transition-colors">GoGreen</span>
          <span className="font-sans text-[10px] font-bold tracking-widest text-zinc-400 mt-0.5 uppercase group-hover:text-white transition-colors">HEADSHOP</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* LÓGICA DE TRANSIÇÃO SUAVE */}
          {isLoading ? (
            // Exibe um "fantasma" pulsante enquanto verifica se está logado
            <div className="w-24 h-10 bg-zinc-900 rounded-full animate-pulse border border-zinc-800"></div>
          ) : user ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-1 pr-3 bg-zinc-900 rounded-full border border-zinc-800 hover:border-green-neon transition-all"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800">
                  {avatar ? (
                    <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-white hidden md:block">
                  {firstName}
                </span>
                <ChevronDown className={cn("w-3 h-3 text-zinc-400 transition-transform", isMenuOpen && "rotate-180")} />
              </button>

              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                      <p className="text-[10px] font-black text-green-neon uppercase tracking-widest text-left">Acesso VIP</p>
                      <p className="text-sm font-bold text-white truncate text-left mt-1">{fullName || user.email}</p>
                    </div>
                    
                    <div className="p-2">
                      <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white rounded-xl transition-colors">
                        <Settings className="w-4 h-4" /> Meu Perfil
                      </Link>
                      <Link href="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white rounded-xl transition-colors">
                        <History className="w-4 h-4" /> Histórico de Compras
                      </Link>
                      <Link href="/favorites" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white rounded-xl transition-colors">
                        <Heart className="w-4 h-4" /> Meus Favoritos
                      </Link>
                    </div>

                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 p-4 text-sm font-bold text-red-500 hover:bg-red-500/10 border-t border-zinc-800 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Encerrar Sessão
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 bg-green-neon text-urban-black px-5 py-2.5 rounded-full text-sm font-display hover:scale-105 hover:bg-white transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)]">
              ENTRAR VIP
            </Link>
          )}

          <div className="h-6 w-px bg-zinc-800 hidden md:block"></div>

          <button 
            onClick={openCart} 
            className="relative p-2.5 bg-zinc-900 border border-zinc-800 hover:border-green-neon hover:bg-green-neon/10 rounded-full transition-all group"
          >
            <ShoppingBag className="w-5 h-5 text-zinc-300 group-hover:text-green-neon group-hover:scale-110 transition-all" />
            {hasItems && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold border-2 border-zinc-900 rounded-full flex items-center justify-center animate-bounce">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}