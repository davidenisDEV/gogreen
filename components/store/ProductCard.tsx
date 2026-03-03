"use client";

import { Product } from "@/data/products";
import { useCart } from "@/context/cart-context";
import { Plus, Flame } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 5;

  // Verifica se a imagem é válida (não é vazia e não é o placeholder padrão se você não quiser)
  // Aceita qualquer coisa que comece com http (Supabase) ou / (Local)
  const hasValidImage = product.image && (product.image.startsWith("http") || product.image.startsWith("/"));

  return (
    <div className="group relative flex flex-col h-full">
      <div className="aspect-square bg-gray-100 rounded-[24px] overflow-hidden relative mb-4 shadow-sm group-hover:shadow-green-neon/20 transition-all duration-300 border border-transparent group-hover:border-green-neon/50">
        
        {/* Tags */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.isNew && (
            <span className="bg-urban-black text-green-neon text-[10px] font-bold px-3 py-1 rounded-full w-fit">NOVO</span>
            )}
            {isLowStock && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit animate-pulse">
                <Flame className="w-3 h-3" /> RESTAM {product.stock}
            </span>
            )}
        </div>
        
        {/* LÓGICA DE IMAGEM CORRIGIDA */}
        {hasValidImage ? (
           <img 
             src={product.image} 
             alt={product.name} 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
             onError={(e) => {
               // Se a imagem quebrar, volta para o ícone (esconde a img quebrada)
               (e.target as HTMLImageElement).style.display = 'none';
               (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center');
             }}
           />
        ) : (
          /* Fallback: Ícone se não tiver imagem */
          <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-200 flex items-center justify-center text-4xl">
             {product.category === 'kits' ? '📦' : '🌿'}
          </div>
        )}

        <button 
          onClick={() => addToCart(product)}
          className="absolute bottom-3 right-3 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-green-neon transition-all active:scale-90 hover:rotate-90 group/btn"
        >
          <Plus className="w-6 h-6 text-black group-hover/btn:text-white" />
        </button>
      </div>

      <div>
        <h3 className="font-display text-lg leading-tight mb-1 group-hover:text-green-forest transition-colors truncate">
          {product.name}
        </h3>
        <p className="font-sans font-bold text-zinc-500">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </p>
      </div>
    </div>
  );
}