"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/store/ProductCard";
import { useAuth } from "@/context/auth-context";
import { Heart, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FavoritesPage() {
  const { user, isLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      if (!user) return;
      const { data, error } = await supabase
        .from("favorites")
        .select("products (*)")
        .eq("user_id", user.id);

      if (!error) setFavorites(data.map(f => f.products));
      setLoadingItems(false);
    }
    loadFavorites();
  }, [user]);

  if (isLoading || loadingItems) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <Loader2 className="animate-spin text-green-neon w-10 h-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <Navbar />
      <div className="container mx-auto px-6 pt-32 text-center">
        <header className="mb-12">
          <Heart className="w-12 h-12 text-red-500 mx-auto mb-4 fill-red-500" />
          <h1 className="font-display text-4xl text-urban-black uppercase italic">Meus Favoritos</h1>
          <p className="text-zinc-500">Seus itens indispensáveis salvos em um só lugar.</p>
        </header>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 max-w-md mx-auto border border-zinc-100 shadow-sm">
            <p className="text-zinc-500 mb-6 font-bold">Nenhum item salvo ainda...</p>
            <Link href="/" className="bg-urban-black text-green-neon font-display px-8 py-4 rounded-xl inline-block hover:scale-105 transition-transform">
              EXPLORAR LOJA
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}