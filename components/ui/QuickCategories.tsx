"use client";

import { Flame, Leaf, Package, Zap } from "lucide-react";

export function QuickCategories() {
  const categories = [
    { name: "Kits Salva-Rolê", icon: <Package className="w-5 h-5" /> },
    { name: "Sedas & Blunts", icon: <Leaf className="w-5 h-5" /> },
    { name: "Isqueiros", icon: <Flame className="w-5 h-5" /> },
    { name: "Acessórios", icon: <Zap className="w-5 h-5" /> },
  ];

  const scrollToProducts = () => {
    document.getElementById("vitrine")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full border-b border-zinc-900 py-4 overflow-x-auto no-scrollbar bg-urban-black">
      <div className="container mx-auto px-6 flex items-center justify-start md:justify-center gap-4 min-w-max">
        {categories.map((cat, i) => (
          <button 
            key={i} 
            onClick={scrollToProducts}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-green-neon hover:text-black text-zinc-400 border border-zinc-800 px-5 py-2.5 rounded-full font-bold text-sm transition-colors whitespace-nowrap group shadow-sm"
          >
            <span className="text-green-neon group-hover:text-black transition-colors">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}