"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, User, ChevronDown, History, Heart, Settings, LogOut 
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

export function NavbarUser({ user, profile }: { user: any, profile: any }) {
  const { openCart, items } = useCart();
  const { signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasItems = items.length > 0;

  return (
    <header className="fixed top-0 w-full z-50 bg-urban-black/90 backdrop-blur-md border-b border-zinc-900 py-4 shadow-sm">
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        <Link href="/" className="flex flex-col leading-none group">
          <span className="font-display text-2xl text-green-forest group-hover:text-green-neon transition-colors">GoGreen</span>
          <span className="font-sans text-[10px] font-bold tracking-widest text-green-forest uppercase">HEADSHOP</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 p-1 pr-3 bg-zinc-50 rounded-full border border-zinc-100 hover:border-green-neon transition-all"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-green-soft bg-white">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
              <span className="text-xs font-bold text-urban-black hidden md:block">
                {profile?.full_name ? profile.full_name.split(' ')[0] : "Membro"}
              </span>
              <ChevronDown className={cn("w-3 h-3 text-zinc-400 transition-transform", isMenuOpen && "rotate-180")} />
            </button>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden z-20">
                  <div className="p-4 border-b border-zinc-50 bg-zinc-50/50">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Acesso VIP</p>
                    <p className="text-sm font-bold text-urban-black truncate">{profile?.full_name || user.email}</p>
                  </div>
                  
                  <div className="p-2">
                    <Link href="/profile" className="flex items-center gap-3 p-3 text-sm font-medium text-zinc-600 hover:bg-green-soft rounded-xl transition-colors">
                      <Settings className="w-4 h-4" /> Meu Perfil
                    </Link>
                    <Link href="/orders" className="flex items-center gap-3 p-3 text-sm font-medium text-zinc-600 hover:bg-green-soft rounded-xl transition-colors">
                      <History className="w-4 h-4" /> Histórico
                    </Link>
                    <Link href="/favorites" className="flex items-center gap-3 p-3 text-sm font-medium text-zinc-600 hover:bg-green-soft rounded-xl transition-colors">
                      <Heart className="w-4 h-4" /> Favoritos
                    </Link>
                  </div>

                  <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 p-4 text-sm font-bold text-red-500 hover:bg-red-50 border-t border-zinc-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Encerrar Sessão
                  </button>
                </div>
              </>
            )}
          </div>

          <button onClick={openCart} className="relative p-2.5 bg-green-soft rounded-full group">
            <ShoppingBag className="w-5 h-5 text-green-forest" />
            {hasItems && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold border-2 border-white rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}