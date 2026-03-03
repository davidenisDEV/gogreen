"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Loader2, Package, Truck, CheckCircle2, Clock, ChevronRight, Store, UserPlus, Mail, Save, X } from "lucide-react";

export function AdminOrders({ showToast }: { showToast: any }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para o Modal/Popup de vínculo de e-mail
  const [linkingOrderId, setLinkingOrderId] = useState<string | null>(null);
  const [tempEmail, setTempEmail] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*, profiles:user_id (full_name, email, phone), pos_customers (name, email, phone)")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (!error) { fetchOrders(); showToast('success', 'Status atualizado.'); }
  }

  // FUNÇÃO PARA VINCULAR E-MAIL POSTERIORMENTE
  async function handleLinkEmail(orderId: string, posCustId: string) {
    if (!tempEmail.includes("@")) return showToast('error', 'E-mail inválido.');
    
    // 1. Atualiza o e-mail na tabela de clientes de balcão
    const { error: custError } = await supabase
      .from("pos_customers")
      .update({ email: tempEmail })
      .eq("id", posCustId);

    if (!custError) {
      showToast('success', 'Cliente vinculado ao e-mail com sucesso!');
      setLinkingOrderId(null);
      setTempEmail("");
      fetchOrders();
    }
  }

  const webOrders = orders.filter(o => o.origin !== 'balcao');
  const posOrders = orders.filter(o => o.origin === 'balcao');

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-zinc-900" /></div>;

  const OrderCard = ({ order, nextStatus, nextLabel, icon: Icon, isPos = false }: any) => {
    const customerName = isPos ? order.pos_customers?.name : order.profiles?.full_name;
    const customerEmail = isPos ? order.pos_customers?.email : order.profiles?.email;

    return (
      <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm mb-3 group hover:border-zinc-400 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">#{order.id.split('-')[0]}</span>
          <Icon className="w-4 h-4 text-zinc-400" />
        </div>
        
        <p className="font-bold text-zinc-900 text-sm truncate">{customerName || "Cliente Base"}</p>
        
        {/* Lógica de E-mail / Vínculo */}
        {customerEmail ? (
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> {customerEmail}
          </p>
        ) : isPos ? (
          <button 
            onClick={() => setLinkingOrderId(order.id)}
            className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1 mt-1"
          >
            <UserPlus className="w-3 h-3" /> Vincular E-mail
          </button>
        ) : null}

        {linkingOrderId === order.id && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100 animate-in fade-in">
            <input 
              className="w-full p-1.5 text-[10px] border rounded mb-2 outline-none focus:border-blue-500"
              placeholder="Digite o e-mail..."
              value={tempEmail}
              onChange={e => setTempEmail(e.target.value)}
            />
            <div className="flex gap-1">
              <button onClick={() => handleLinkEmail(order.id, order.pos_customer_id)} className="flex-1 bg-blue-600 text-white text-[9px] py-1 rounded font-bold">SALVAR</button>
              <button onClick={() => setLinkingOrderId(null)} className="p-1 bg-zinc-200 rounded"><X className="w-3 h-3 text-zinc-600"/></button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-zinc-100 pt-3 mt-3">
          <p className="font-bold text-zinc-900 text-sm">R$ {Number(order.total_amount).toFixed(2)}</p>
          {order.payment_method && <span className="text-[9px] font-black uppercase text-zinc-400">{order.payment_method}</span>}
          {nextStatus && (
            <button onClick={() => updateOrderStatus(order.id, nextStatus)} className="text-[10px] font-bold text-white bg-zinc-900 hover:bg-zinc-700 px-2.5 py-1.5 rounded flex items-center gap-1 transition-all">
              {nextLabel} <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in">
      <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900">
            <ShoppingCart className="w-5 h-5 text-zinc-500" /> Fluxo de Operações
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Gerencie pedidos da Web e vendas do Balcão em tempo real.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-4 items-start">
        {/* COLUNAS WEB (1-4) */}
        <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 min-h-[500px]">
          <h3 className="font-bold text-[10px] uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1"><Clock className="w-3 h-3" /> Pendentes ({webOrders.filter(o => o.status === 'pending').length})</h3>
          {webOrders.filter(o => o.status === 'pending').map(order => <OrderCard key={order.id} order={order} nextStatus="processing" nextLabel="Preparar" icon={Clock} />)}
        </div>

        <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 min-h-[500px]">
          <h3 className="font-bold text-[10px] uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1"><Package className="w-3 h-3" /> Preparo ({webOrders.filter(o => o.status === 'processing').length})</h3>
          {webOrders.filter(o => o.status === 'processing').map(order => <OrderCard key={order.id} order={order} nextStatus="shipped" nextLabel="Despachar" icon={Package} />)}
        </div>

        <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 min-h-[500px]">
          <h3 className="font-bold text-[10px] uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1"><Truck className="w-3 h-3" /> Em Rota ({webOrders.filter(o => o.status === 'shipped').length})</h3>
          {webOrders.filter(o => o.status === 'shipped').map(order => <OrderCard key={order.id} order={order} nextStatus="delivered" nextLabel="Concluir" icon={Truck} />)}
        </div>

        <div className="bg-emerald-50/30 p-3 rounded-xl border border-emerald-100 min-h-[500px]">
          <h3 className="font-bold text-[10px] uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Finalizados Web ({webOrders.filter(o => o.status === 'delivered').length})</h3>
          {webOrders.filter(o => o.status === 'delivered').map(order => <OrderCard key={order.id} order={order} nextStatus={null} icon={CheckCircle2} />)}
        </div>

        {/* COLUNA 5: EXCLUSIVA BALCÃO (PDV) */}
        <div className="bg-blue-50/30 p-3 rounded-xl border border-blue-100 min-h-[500px]">
          <h3 className="font-bold text-[10px] uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-1">
            <Store className="w-3 h-3" /> Vendas Balcão ({posOrders.length})
          </h3>
          {posOrders.map(order => (
            <OrderCard key={order.id} order={order} nextStatus={null} icon={Store} isPos={true} />
          ))}
        </div>
      </div>
    </div>
  );
}