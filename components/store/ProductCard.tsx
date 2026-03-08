"use client";

import { useState, useEffect } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { Plus, X, Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock !== undefined && product.stock === 0;
  const hasValidImage = product.image && (product.image.startsWith("http") || product.image.startsWith("/"));

  // Verifica se este produto já está nos favoritos do utilizador logado
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    
    const checkFavorite = async () => {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .maybeSingle();
        
      if (data && isMounted) setIsFavorite(true);
    };
    checkFavorite();
    
    return () => { isMounted = false; };
  }, [user, product.id]);

  // Função para Favoritar / Desfavoritar
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      router.push("/login"); // Se não estiver logado, manda para o login
      return;
    }

    setLoadingFav(true);
    try {
      if (isFavorite) {
        await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", product.id);
        setIsFavorite(false);
      } else {
        await supabase.from("favorites").insert([{ user_id: user.id, product_id: product.id }]);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Erro ao favoritar:", error);
    } finally {
      setLoadingFav(false);
    }
  };

  return (
    <div className="group relative flex flex-col h-full">
      {/* FUNDO RECORTADO E TRANSPARENTE (DARK CLEAN) */}
      <div className={cn(
        "aspect-square rounded-[24px] overflow-hidden relative mb-4 border transition-all duration-500 flex items-center justify-center backdrop-blur-sm",
        isOutOfStock 
          ? "border-zinc-900 bg-zinc-950/20 opacity-60 grayscale" 
          : "border-transparent bg-white/[0.02] hover:bg-white/[0.04] hover:border-green-500/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.08)]"
      )}>
        
        {/* BOTÃO DE FAVORITO (CORAÇÃO) */}
        <button 
          onClick={toggleFavorite}
          disabled={loadingFav}
          className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md hover:scale-110 transition-all shadow-lg"
        >
          {loadingFav ? (
            <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
          ) : (
            <Heart className={cn(
              "w-4 h-4 transition-colors", 
              isFavorite ? "fill-red-500 text-red-500" : "text-zinc-400 hover:text-red-400"
            )} />
          )}
        </button>

        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
            {product.isNew && !isOutOfStock && (
              <span className="bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold px-3 py-1 rounded-full w-fit backdrop-blur-md">
                NOVO
              </span>
            )}
            {isLowStock && !isOutOfStock && (
              <span className="bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit animate-pulse backdrop-blur-md">
                ÚLTIMOS {product.stock}
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-zinc-900 text-zinc-500 border border-zinc-800 text-[10px] font-bold px-3 py-1 rounded-full w-fit">
                ESGOTADO
              </span>
            )}
        </div>
        
        {hasValidImage ? (
           <img 
             src={product.image} 
             alt={product.name} 
             className={cn(
               "w-[75%] h-[75%] object-contain transition-transform duration-700 drop-shadow-2xl",
               !isOutOfStock && "group-hover:scale-110"
             )}
             onError={(e) => {
               (e.target as HTMLImageElement).style.display = 'none';
               (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center');
             }}
           />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
             {product.category === 'kits' ? '📦' : '🌿'}
          </div>
        )}

        <button 
          disabled={isOutOfStock}
          onClick={() => addToCart(product)}
          className={cn(
            "absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all z-20",
            isOutOfStock 
              ? "bg-zinc-900 border border-zinc-800 cursor-not-allowed" 
              : "bg-green-500 hover:bg-white active:scale-90 hover:rotate-90 group/btn"
          )}
        >
          {isOutOfStock ? (
            <X className="w-6 h-6 text-zinc-600" />
          ) : (
            <Plus className="w-6 h-6 text-black group-hover/btn:text-black" />
          )}
        </button>
      </div>

      <div>
        <h3 className="font-display text-lg text-white leading-tight mb-1 group-hover:text-green-500 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-zinc-500 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-end justify-between mt-auto">
          <span className={cn(
            "font-display text-2xl font-bold",
            isOutOfStock ? "text-zinc-600" : "text-white"
          )}>
            R$ {product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}