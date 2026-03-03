"use client";

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/cart-context";

export function NavbarGuest() {
  const { openCart, items } = useCart();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-green-100 py-4 shadow-sm">
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        <Link href="/" className="flex flex-col leading-none group">
          <span className="font-display text-2xl text-green-forest group-hover:text-green-neon transition-colors">GoGreen</span>
          <span className="font-sans text-[10px] font-bold tracking-widest text-green-forest uppercase">HEADSHOP</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/login" className="flex items-center gap-2 text-urban-black hover:text-green-forest transition-colors group">
            <div className="p-2 bg-zinc-50 rounded-full group-hover:bg-green-soft transition-colors">
              <User className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Entrar</span>
          </Link>

          <button onClick={openCart} className="relative p-2.5 bg-green-soft rounded-full">
            <ShoppingBag className="w-5 h-5 text-green-forest" />
            {items.length > 0 && (
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