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
    let isMounted = true; 

    async function loadFavorites() {
      if (!user?.id) {
        if (isMounted) setLoadingItems(false);
        return;
      }
      
      try {
        // O Supabase faz um JOIN automático com a tabela de produtos
        const { data, error } = await supabase
          .from("favorites")
          .select("products (*)")
          .eq("user_id", user.id);

        if (error) throw error;

        if (data && isMounted) {
          // Extrai os produtos de dentro do objeto do JOIN
          const products = data.map((item: any) => item.products).filter(Boolean);
          setFavorites(products);
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      } finally {
        if (isMounted) setLoadingItems(false);
      }
    }
    
    if (!isLoading) {
      loadFavorites();
    }

    return () => { isMounted = false; };
  }, [user?.id, isLoading]); 

  if (isLoading || loadingItems) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#080a09]">
        <Loader2 className="animate-spin text-green-500 w-12 h-12 mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Carregando seus favoritos...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#080a09] pt-[90px] pb-20 relative overflow-hidden">
      {/* Luz de fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-green-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <Navbar />
      
      <div className="container mx-auto px-6 pt-12 md:pt-16 relative z-10">
        <header className="text-center mb-16">
          <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <Heart className="w-10 h-10 text-red-500 fill-red-500" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-3">
            Meus <span className="text-red-500">Favoritos</span>
          </h1>
          <p className="text-zinc-400 text-sm">Seus itens indispensáveis salvos em um só lugar.</p>
        </header>

        {favorites.length === 0 ? (
          <div className="bg-white/[0.02] rounded-[32px] p-12 max-w-md mx-auto border border-white/[0.05] backdrop-blur-md text-center">
            <Heart className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 mb-8 font-bold text-lg">Nenhum item salvo ainda...</p>
            <Link 
              href="/#shop" 
              className="bg-green-500 text-black font-bold text-sm px-8 py-4 rounded-xl inline-flex items-center justify-center hover:bg-white transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)] w-full uppercase tracking-widest"
            >
              Explorar a Loja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}