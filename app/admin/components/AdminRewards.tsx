"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Loader2, Gift } from "lucide-react";

export function AdminRewards({ showToast }: { showToast: (type: 'success' | 'error', msg: string) => void }) {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newReward, setNewReward] = useState({ title: "", description: "", points_cost: 0, image_url: "", is_active: true });

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const { data } = await supabase.from("loyalty_rewards").select("*").order("points_cost", { ascending: true });
        if (isMounted) setRewards(data || []);
      } finally { if (isMounted) setLoading(false); }
    }
    load(); return () => { isMounted = false; };
  }, []);

  async function fetchRewards() {
    const { data } = await supabase.from("loyalty_rewards").select("*").order("points_cost", { ascending: true });
    setRewards(data || []);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.from("loyalty_rewards").insert([newReward]);
    if (!error) {
      setNewReward({ title: "", description: "", points_cost: 0, image_url: "", is_active: true });
      fetchRewards(); showToast('success', 'Prêmio catalogado com sucesso!');
    } else { showToast('error', 'Erro ao salvar prêmio.'); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if(!confirm("Remover prêmio?")) return;
    await supabase.from("loyalty_rewards").delete().eq("id", id);
    fetchRewards(); showToast('success', 'Prêmio removido do sistema.');
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-zinc-900" /></div>;

  return (
    <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-900">
        <Gift className="w-5 h-5 text-zinc-500" /> Catálogo de Recompensas
      </h2>

      <form onSubmit={handleCreate} className="bg-zinc-50 border border-zinc-200 p-6 rounded-xl mb-8 grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-zinc-500">Produto/Prêmio</label>
          <input required className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white text-zinc-900" value={newReward.title} onChange={e => setNewReward({...newReward, title: e.target.value})} placeholder="Ex: Seda King Size" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-zinc-500">Custo em Pontos</label>
          <input required type="number" className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white font-bold text-zinc-900" value={newReward.points_cost} onChange={e => setNewReward({...newReward, points_cost: Number(e.target.value)})} />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase text-zinc-500">Descrição Comercial</label>
          <input className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white text-zinc-900 placeholder-zinc-400" placeholder="Detalhes curtos..." value={newReward.description} onChange={e => setNewReward({...newReward, description: e.target.value})} />
        </div>
        <button disabled={saving} type="submit" className="md:col-span-2 bg-zinc-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-zinc-800">
          {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />} Disponibilizar Prêmio
        </button>
      </form>

      <div className="space-y-3">
        {rewards.map(reward => (
          <div key={reward.id} className="flex items-center justify-between p-4 border border-zinc-200 rounded-xl bg-white shadow-sm">
            <div>
              <p className="font-bold text-zinc-900 text-sm">{reward.title}</p>
              <p className="text-xs text-zinc-500">{reward.description} • <strong className="text-zinc-900">{reward.points_cost} pts</strong></p>
            </div>
            <button onClick={() => handleDelete(reward.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}