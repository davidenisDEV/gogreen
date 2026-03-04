"use client";

import { useState, useEffect } from "react";
import { getProducts, categories, Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // AbortController é a forma mais moderna e segura de cancelar requisições 
    // se o usuário sair da página no meio do carregamento.
    const controller = new AbortController();
    let isMounted = true; 

    async function load() {
      try {
        setLoading(true);
        const data = await getProducts(); // A busca usa os dados protegidos em products.ts
        if (isMounted) {
          setDbProducts(data || []);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error("Erro ao buscar vitrine:", error);
      } finally {
        if (isMounted) setLoading(false); 
      }
    }

    load();

    return () => { 
      isMounted = false; 
      controller.abort(); 
    }; 
  }, []);

  const filteredProducts = activeCategory === "todos" 
    ? dbProducts 
    : dbProducts.filter(p => p.category === activeCategory);

  return (
    <section id="shop" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl text-green-neon mb-4 drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">
            A BRABA TÁ AQUI
          </h2>
          <p className="text-zinc-400">Escolha sua munição e boa sessão.</p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-8 justify-start md:justify-center no-scrollbar mb-8">
          <button
            onClick={() => setActiveCategory("todos")}
            className={`whitespace-nowrap px-6 py-3 rounded-full font-bold transition-all border ${
              activeCategory === "todos"
                ? "bg-green-neon text-black border-green-neon shadow-[0_0_15px_rgba(57,255,20,0.3)]"
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-green-neon hover:text-white"
            }`}
          >
            🔥 Tudo
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-full font-bold transition-all border flex items-center gap-2 ${
                activeCategory === cat.id
                  ? "bg-green-neon text-black border-green-neon shadow-[0_0_15px_rgba(57,255,20,0.3)]"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-green-neon hover:text-white"
              }`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 flex flex-col items-center justify-center gap-4 text-green-neon font-bold">
            <Loader2 className="w-8 h-8 animate-spin" /> 
            <span className="text-sm tracking-widest uppercase">Carregando Estoque...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-zinc-500 flex flex-col items-center gap-4">
            <span className="text-4xl">💨</span>
            <p className="font-bold">Puxa, nenhum produto em estoque nesta categoria no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}