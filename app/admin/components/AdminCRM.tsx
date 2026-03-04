"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Loader2, Crown, Search, Save, X } from "lucide-react";

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
    load(); 
    return () => { isMounted = false; };
  }, []);

  async function fetchClients() {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setClients(data || []);
  }

  // FUNÇÃO REFORÇADA COM TRY/CATCH/FINALLY PARA NÃO TRAVAR A TELA
  async function handleUpdatePoints(clientId: string) {
    try {
      const { error } = await supabase.from("profiles").update({ points: newPoints }).eq("id", clientId);
      if (error) throw error;
      
      showToast('success', 'Pontos atualizados com sucesso!');
      await fetchClients();
    } catch (error) {
      console.error(error);
      showToast('error', 'Falha ao atualizar pontos.');
    } finally {
      setEditingPoints(null); // Fecha a edição independente de dar erro ou sucesso
    }
  }

  // Filtro de busca de clientes
  const filteredClients = clients.filter(c => 
    (c.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (c.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-zinc-900" /></div>;

  return (
    <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm admin-panel">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900">
          <Users className="w-5 h-5 text-zinc-500" /> Gestão de Clientes VIP
        </h2>
        
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Buscar membro..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg outline-none focus:border-zinc-900 text-sm bg-zinc-50 text-zinc-900"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="overflow-x-auto border border-zinc-100 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr className="text-xs uppercase tracking-widest text-zinc-500">
              <th className="p-4 font-bold">Membro</th>
              <th className="p-4 font-bold">Contato</th>
              <th className="p-4 font-bold">Pontos VIP</th>
              <th className="p-4 font-bold">Nível</th>
              <th className="p-4 font-bold text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr key={client.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors text-sm">
                <td className="p-4">
                  <p className="font-bold text-zinc-900">{client.full_name || 'Sem Nome'}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Desde {new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
                </td>
                <td className="p-4 text-zinc-600">{client.email}</td>
                <td className="p-4">
                  {editingPoints === client.id ? (
                    <div className="flex items-center gap-2 animate-in fade-in">
                      <input type="number" className="w-20 p-1.5 text-center rounded border border-zinc-300 outline-none focus:border-zinc-900 bg-white" value={newPoints} onChange={(e) => setNewPoints(Number(e.target.value))} />
                      <button onClick={() => handleUpdatePoints(client.id)} className="bg-zinc-900 text-white p-1.5 rounded hover:bg-zinc-800"><Save className="w-4 h-4"/></button>
                      <button onClick={() => setEditingPoints(null)} className="text-zinc-400 hover:text-zinc-600 p-1.5"><X className="w-4 h-4"/></button>
                    </div>
                  ) : (
                    <span className="font-bold text-zinc-900 flex items-center gap-1"><Crown className="w-4 h-4 text-emerald-500" /> {client.points || 0}</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${client.role === 'admin' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
                    {client.role === 'admin' ? 'Staff' : 'Cliente'}
                  </span>
                </td>
                <td className="p-4 flex justify-end">
                  <button onClick={() => { setEditingPoints(client.id); setNewPoints(client.points || 0); }} className="p-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    Editar Pontos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredClients.length === 0 && (
          <div className="p-8 text-center text-zinc-500">Nenhum membro encontrado.</div>
        )}
      </div>
    </div>
  );
}