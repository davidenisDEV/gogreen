"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Navbar } from "@/components/layout/Navbar";
import { ShoppingBag, Calendar, Package, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function OrdersPage() {
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      // Simulando busca no banco (você precisará criar a tabela 'orders' no futuro)
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setOrders(data || []);
      setFetching(false);
    }
    fetchOrders();
  }, [user]);

  if (isLoading || fetching) return <div className="min-h-screen flex items-center justify-center bg-zinc-50"><Loader2 className="animate-spin text-green-neon" /></div>;

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <Navbar />
      <div className="container mx-auto px-6 pt-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl text-urban-black mb-2 uppercase italic">Minha Jornada</h1>
          <p className="text-zinc-500 mb-8 font-sans">Acompanhe todos os seus pedidos e status de entrega.</p>

          {orders.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 text-center border border-zinc-100 shadow-sm">
              <div className="w-20 h-20 bg-green-soft rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-green-forest" />
              </div>
              <h2 className="text-2xl font-display text-urban-black mb-2">CARRINHO VAZIO?</h2>
              <p className="text-zinc-500 mb-8 max-w-xs mx-auto">Você ainda não realizou nenhum pedido em nossa loja.</p>
              <Link href="/" className="inline-block bg-green-neon text-black font-display px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-lg shadow-green-neon/20">
                BORA PRO SHOP 🍁
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mapeamento dos pedidos aqui */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}