"use client";

import { Product } from "@/data/products";
import { useCart } from "@/context/cart-context";
import { Plus, Flame } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 5;
  const hasValidImage = product.image && (product.image.startsWith("http") || product.image.startsWith("/"));

  return (
    <div className="group relative flex flex-col h-full">
      <div className="aspect-square bg-zinc-900 rounded-[24px] overflow-hidden relative mb-4 border border-zinc-800 group-hover:border-green-neon transition-all duration-300">
        
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.isNew && (
            <span className="bg-urban-black text-green-neon border border-green-neon/30 text-[10px] font-bold px-3 py-1 rounded-full w-fit">NOVO</span>
            )}
            {isLowStock && (
            <span className="bg-red-500/20 border border-red-500 text-red-500 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit animate-pulse">
                <Flame className="w-3 h-3" /> RESTAM {product.stock}
            </span>
            )}
        </div>
        
        {hasValidImage ? (
           <img 
             src={product.image} 
             alt={product.name} 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
             onError={(e) => {
               (e.target as HTMLImageElement).style.display = 'none';
               (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center');
             }}
           />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-zinc-800 to-zinc-900 flex items-center justify-center text-4xl">
             {product.category === 'kits' ? '📦' : '🌿'}
          </div>
        )}

        <button 
          onClick={() => addToCart(product)}
          className="absolute bottom-3 right-3 bg-green-neon w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all active:scale-90 hover:rotate-90 group/btn"
        >
          <Plus className="w-6 h-6 text-black group-hover/btn:text-black" />
        </button>
      </div>

      <div>
        <h3 className="font-display text-lg text-white leading-tight mb-1 group-hover:text-green-neon transition-colors truncate">
          {product.name}
        </h3>
        <p className="font-sans font-bold text-zinc-400">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </p>
      </div>
    </div>
  );
}