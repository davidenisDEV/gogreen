"use client";

import { useState, useEffect } from "react";
import { getProducts, categories, Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega produtos do Supabase ao abrir a página
  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setDbProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredProducts = activeCategory === "todos" 
    ? dbProducts 
    : dbProducts.filter(p => p.category === activeCategory);

  return (
    <section id="shop" className="py-20 px-6">
      <div className="container mx-auto">
        
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl text-green-forest mb-4">
            A BRABA TÁ AQUI
          </h2>
          <p className="text-zinc-500">Escolha sua munição e boa sessão.</p>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 overflow-x-auto pb-8 justify-start md:justify-center no-scrollbar mb-8">
          <button
            onClick={() => setActiveCategory("todos")}
            className={`whitespace-nowrap px-6 py-3 rounded-full font-bold transition-all border-2 ${
              activeCategory === "todos"
                ? "bg-urban-black text-green-neon border-urban-black"
                : "bg-white text-zinc-500 border-gray-200 hover:border-green-neon"
            }`}
          >
            🔥 Tudo
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-full font-bold transition-all border-2 flex items-center gap-2 ${
                activeCategory === cat.id
                  ? "bg-green-forest text-white border-green-forest"
                  : "bg-white text-zinc-500 border-gray-200 hover:border-green-neon"
              }`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Loading ou Grid */}
        {loading ? (
          <div className="text-center py-20 animate-pulse text-green-forest font-bold">
            Carregando estoque atualizado... ⏳
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-zinc-400">
            Nada encontrado nesta categoria. 💨
          </div>
        )}

      </div>
    </section>
  );
}