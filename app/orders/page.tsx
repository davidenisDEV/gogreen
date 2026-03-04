"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Navbar } from "@/components/layout/Navbar";
import { ShoppingBag, Calendar, Package, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function OrdersPage() {
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchOrders() {
      if (!user?.id) return; // Segurança extra
      
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && isMounted) setOrders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setFetching(false);
      }
    }
    
    fetchOrders();
    
    return () => { isMounted = false; }; // Cleanup para evitar vazamento de memória
  }, [user?.id]);

  // Tela de Loading no modo escuro
  if (isLoading || fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-urban-black">
        <Loader2 className="animate-spin text-green-neon w-12 h-12 mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Buscando seu histórico...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-urban-black pb-20 selection:bg-green-neon selection:text-black">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-32 md:pt-40">
        <div className="max-w-3xl mx-auto text-center md:text-left">
          
          <h1 className="font-display text-4xl md:text-5xl text-white mb-2 uppercase italic">
            Minha <span className="text-green-neon">Jornada</span>
          </h1>
          <p className="text-zinc-400 mb-12 font-medium">Acompanhe todos os seus pedidos e status de entrega.</p>

          {orders.length === 0 ? (
            <div className="bg-zinc-900 rounded-[32px] p-12 text-center border border-zinc-800 shadow-sm">
              <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ShoppingBag className="w-10 h-10 text-zinc-600" />
              </div>
              <h2 className="text-2xl font-display text-white mb-2 uppercase italic">Carrinho Vazio?</h2>
              <p className="text-zinc-400 mb-8 max-w-xs mx-auto">Você ainda não realizou nenhum pedido em nossa loja.</p>
              <Link 
                href="/" 
                className="inline-block bg-green-neon text-black font-display text-lg px-8 py-4 rounded-xl hover:scale-105 hover:bg-white transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)]"
              >
                BORA PRO SHOP 🍁
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Estilo Dark para os cards de pedidos quando existirem */}
              {orders.map((order) => (
                <div key={order.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[24px] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-green-neon/50 transition-colors group">
                  
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:border-green-neon/50 transition-colors">
                      <Package className="w-6 h-6 text-green-neon" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">Pedido #{order.id.split('-')[0]}</p>
                      <p className="text-zinc-500 text-sm flex items-center gap-1 mt-1">
                        <Calendar className="w-4 h-4" /> {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end md:gap-8 border-t border-zinc-800 md:border-t-0 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Status</p>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-green-neon/10 text-green-neon border border-green-neon/20' :
                        order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-zinc-800 text-zinc-300'
                      }`}>
                        {order.status === 'pending' ? 'Novo' : 
                         order.status === 'processing' ? 'Preparando' : 
                         order.status === 'shipped' ? 'Em Rota' : 
                         order.status === 'delivered' ? 'Entregue' : order.status}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Total</p>
                      <p className="text-white font-display text-xl">R$ {Number(order.total_amount || 0).toFixed(2)}</p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}