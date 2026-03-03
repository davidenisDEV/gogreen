"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Loader2, Crown, Search, Edit3, Save, X } from "lucide-react";

export function AdminCRM({ showToast }: { showToast: (type: 'success' | 'error', msg: string) => void }) {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPoints, setEditingPoints] = useState<string | null>(null);
  const [newPoints, setNewPoints] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
        if (isMounted) setClients(data || []);
      } finally { if (isMounted) setLoading(false); }
    }
    load(); return () => { isMounted = false; };
  }, []);

  async function fetchClients() {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setClients(data || []);
  }

  async function handleUpdatePoints(clientId: string) {
    const { error } = await supabase.from("profiles").update({ points: newPoints }).eq("id", clientId);
    if (!error) {
      setEditingPoints(null); fetchClients(); showToast('success', 'Pontos do cliente atualizados.');
    } else { showToast('error', 'Falha na comunicação com o servidor.'); }
  }

  const filteredClients = clients.filter(c => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-zinc-900" /></div>;

  return (
    <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900">
          <Users className="w-5 h-5 text-zinc-500" /> Relacionamento (CRM)
        </h2>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
          <input 
            placeholder="Buscar por e-mail ou nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-zinc-200 pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none focus:border-zinc-900 text-zinc-900 placeholder-zinc-400 shadow-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-zinc-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr className="text-xs uppercase tracking-widest text-zinc-500">
              <th className="p-4 font-bold">Cliente</th>
              <th className="p-4 font-bold">Contato</th>
              <th className="p-4 font-bold">Pontos VIP</th>
              <th className="p-4 font-bold">Nível</th>
              <th className="p-4 font-bold text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredClients.map(client => (
              <tr key={client.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors text-sm">
                <td className="p-4">
                  <p className="font-bold text-zinc-900">{client.full_name || "Membro Anônimo"}</p>
                  <p className="text-xs text-zinc-500">{client.email}</p>
                </td>
                <td className="p-4 text-zinc-600">{client.phone || "-"}</td>
                <td className="p-4">
                  {editingPoints === client.id ? (
                    <div className="flex items-center gap-1">
                      <input type="number" className="w-20 p-1.5 border border-zinc-300 rounded text-center text-zinc-900 outline-none focus:border-zinc-900" value={newPoints} onChange={(e) => setNewPoints(Number(e.target.value))} />
                      <button onClick={() => handleUpdatePoints(client.id)} className="bg-zinc-900 text-white p-1.5 rounded hover:bg-zinc-800"><Save className="w-4 h-4"/></button>
                      <button onClick={() => setEditingPoints(null)} className="text-zinc-400 hover:text-zinc-600 p-1.5"><X className="w-4 h-4"/></button>
                    </div>
                  ) : (
                    <span className="font-bold text-zinc-900 flex items-center gap-1"><Crown className="w-4 h-4 text-zinc-400" /> {client.points || 0}</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${client.role === 'admin' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
                    {client.role === 'admin' ? 'Staff' : 'Cliente'}
                  </span>
                </td>
                <td className="p-4 flex justify-end">
                  <button onClick={() => { setEditingPoints(client.id); setNewPoints(client.points || 0); }} className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors" title="Ajustar Balanço">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}