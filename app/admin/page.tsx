"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DollarSign, TrendingUp, Package } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalStockValue: 0, potentialProfit: 0, lowStock: 0 });

  useEffect(() => {
    async function loadStats() {
      const { data: products } = await supabase.from("products").select("*");
      if (!products) return;

      const totalStockValue = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);
      // Lucro Potencial = (Preço - Custo) * Estoque
      const potentialProfit = products.reduce((acc, p) => acc + ((p.price - (p.cost || 0)) * (p.stock || 0)), 0);
      const lowStock = products.filter(p => (p.stock || 0) < 5).length;

      setStats({ totalStockValue, potentialProfit, lowStock });
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in">
      <h1 className="text-3xl font-display text-urban-black">Dashboard Financeiro</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-forest text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/20 rounded-lg"><DollarSign className="w-6 h-6" /></div>
            <span className="text-green-200 text-sm font-bold uppercase">Valor em Estoque</span>
          </div>
          <p className="text-4xl font-display">R$ {stats.totalStockValue.toFixed(2)}</p>
        </div>

        <div className="bg-urban-black text-green-neon p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/10 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
            <span className="text-zinc-400 text-sm font-bold uppercase">Lucro Potencial</span>
          </div>
          <p className="text-4xl font-display">R$ {stats.potentialProfit.toFixed(2)}</p>
        </div>

        <div className="bg-white border-2 border-red-100 p-6 rounded-2xl shadow-sm">
           <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-red-50 rounded-lg"><Package className="w-6 h-6 text-red-500" /></div>
            <span className="text-red-400 text-sm font-bold uppercase">Estoque Crítico</span>
          </div>
          <p className="text-4xl font-display text-red-600">{stats.lowStock} <span className="text-lg text-zinc-400">itens</span></p>
        </div>
      </div>
    </div>
  );
}