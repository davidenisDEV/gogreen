"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/store/ProductCard";
import { useAuth } from "@/context/auth-context";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FavoritesPage() {
  const { user, isLoading } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      if (!user) return;
      const { data, error } = await supabase
        .from("favorites")
        .select("products (*)")
        .eq("user_id", user.id);

      if (data) {
        // Mapeia para extrair apenas os produtos do resultado do join
        const products = data.map((item: any) => item.products).filter(Boolean);
        setFavorites(products);
      }
      setLoadingItems(false);
    }
    loadFavorites();
  }, [user]);

  // Tela de Loading Inicial (agora no modo escuro)
  if (isLoading || loadingItems) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-urban-black">
        <Loader2 className="animate-spin text-green-neon w-12 h-12 mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Carregando seus favoritos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-urban-black pb-20 selection:bg-green-neon selection:text-black">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-32 md:pt-40 text-center">
        <header className="mb-16">
          <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="w-10 h-10 text-red-500 fill-red-500/20" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-white uppercase italic mb-3">
            Meus <span className="text-green-neon">Favoritos</span>
          </h1>
          <p className="text-zinc-400 font-medium">Seus itens indispensáveis salvos em um só lugar.</p>
        </header>

        {favorites.length === 0 ? (
          <div className="bg-zinc-900 rounded-[32px] p-12 max-w-md mx-auto border border-zinc-800 shadow-sm">
            <Heart className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 mb-8 font-bold text-lg">Nenhum item salvo ainda...</p>
            <Link 
              href="/" 
              className="bg-green-neon text-black font-display text-lg px-8 py-4 rounded-xl inline-flex items-center justify-center hover:scale-105 hover:bg-white transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] w-full"
            >
              EXPLORAR A LOJA
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}