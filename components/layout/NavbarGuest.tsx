"use client";

import Link from "next/link";
import { ShoppingBag, UserPlus, LogIn } from "lucide-react";
import { useCart } from "@/context/cart-context";

export function NavbarGuest() {
  const { openCart, items } = useCart();
  const hasItems = items.length > 0;

  return (
    <header className="fixed top-0 w-full z-50 bg-[#080a09]/90 backdrop-blur-md border-b border-white/[0.05] py-4 shadow-sm">
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        <Link href="/" className="flex flex-col leading-none group">
          <span className="font-display text-2xl text-white group-hover:text-green-500 transition-colors">GoGreen</span>
          <span className="font-sans text-[10px] font-bold tracking-widest text-zinc-500 uppercase">HEADSHOP</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <LogIn className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Entrar</span>
          </Link>
          
          <Link href="/register" className="flex items-center gap-2 bg-green-500 text-black px-5 py-2.5 rounded-full hover:bg-white transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <UserPlus className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Registo</span>
          </Link>

          <div className="h-6 w-px bg-zinc-800 hidden md:block mx-2"></div>

          <button onClick={openCart} className="relative p-2.5 bg-white/[0.02] border border-white/[0.05] hover:border-green-500 hover:text-green-500 rounded-full transition-all group">
            <ShoppingBag className="w-5 h-5 text-zinc-300 group-hover:text-green-500 transition-colors" />
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