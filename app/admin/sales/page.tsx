"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Check, X, Clock, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminSales() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    fetchOrders(); // Recarrega
  }

  if (loading) return <div className="p-8 text-center">Carregando vendas...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display text-urban-black flex items-center gap-3">
        <ShoppingBag className="text-green-forest" /> Gestão de Vendas
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 uppercase tracking-wider">
            <tr>
              <th className="p-4">Cliente</th>
              <th className="p-4">Total</th>
              <th className="p-4">Data</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {orders.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-400">Nenhuma venda registrada ainda.</td></tr>
            ) : orders.map((order) => (
              <tr key={order.id} className="hover:bg-zinc-50/50">
                <td className="p-4">
                  <div className="font-bold text-urban-black">{order.customer_name || "Anônimo"}</div>
                  <div className="text-xs text-zinc-400">{order.customer_phone}</div>
                </td>
                <td className="p-4 font-bold text-green-700">
                  {formatCurrency(order.total)}
                </td>
                <td className="p-4 text-zinc-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    order.status === 'approved' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status === 'pending' ? 'Pendente' : 
                     order.status === 'approved' ? 'Aprovado' : 'Cancelado'}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  {order.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => updateStatus(order.id, 'approved')}
                        className="p-2 bg-green-soft text-green-700 rounded hover:bg-green-200"
                        title="Aprovar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => updateStatus(order.id, 'cancelled')}
                        className="p-2 bg-red-50 text-red-500 rounded hover:bg-red-100"
                        title="Cancelar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}