"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Loader2, BookOpen, Image as ImageIcon } from "lucide-react";

export function AdminEscolinha({ showToast }: { showToast: (type: 'success' | 'error', msg: string) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newItem, setNewItem] = useState({ title: "", content: "", display_type: "card", image_url: "", order_index: 0 });

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const { data } = await supabase.from("educational_content").select("*").order("order_index", { ascending: true });
        if (isMounted) setItems(data || []);
      } finally { if (isMounted) setLoading(false); }
    }
    load(); return () => { isMounted = false; };
  }, []);

  async function fetchItems() {
    const { data } = await supabase.from("educational_content").select("*").order("order_index", { ascending: true });
    setItems(data || []);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.from("educational_content").insert([newItem]);
    if (!error) {
      setNewItem({ title: "", content: "", display_type: "card", image_url: "", order_index: 0 });
      fetchItems(); showToast('success', 'Conteúdo adicionado com sucesso!');
    } else { showToast('error', 'Erro ao adicionar conteúdo.'); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if(!confirm("Certeza que deseja remover?")) return;
    await supabase.from("educational_content").delete().eq("id", id);
    fetchItems(); showToast('success', 'Conteúdo removido da base.');
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-zinc-900" /></div>;

  return (
    <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
      <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900 mb-6">
        <BookOpen className="w-5 h-5 text-zinc-500" /> Gestão Escolinha
      </h2>

      <form onSubmit={handleCreate} className="bg-zinc-50 p-6 rounded-xl mb-8 grid md:grid-cols-2 gap-4 border border-zinc-200">
        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase text-zinc-500">Título do Bloco</label>
          <input required className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white text-zinc-900" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} placeholder="Ex: Como bolar perfeito" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-zinc-500">Formato</label>
          <select className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white text-zinc-900" value={newItem.display_type} onChange={e => setNewItem({...newItem, display_type: e.target.value})}>
            <option value="card">Destaque (Card com Imagem)</option>
            <option value="dropdown">Expansível (Texto Recolhível)</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-zinc-500">URL Imagem</label>
          <div className="flex gap-2 items-center mt-1">
            <ImageIcon className="w-5 h-5 text-zinc-400" />
            <input className="w-full p-3 rounded-lg border border-zinc-200 outline-none focus:border-zinc-900 bg-white text-zinc-900" placeholder="Opcional..." value={newItem.image_url} onChange={e => setNewItem({...newItem, image_url: e.target.value})} disabled={newItem.display_type === 'dropdown'} />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase text-zinc-500">Conteúdo Escrito</label>
          <textarea required rows={3} className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white text-zinc-900" value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} />
        </div>
        <button disabled={saving} type="submit" className="md:col-span-2 bg-zinc-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-zinc-800">
          {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />} Publicar Conteúdo
        </button>
      </form>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 border border-zinc-200 rounded-xl bg-white">
            <div>
              <p className="font-bold text-zinc-900 text-sm">{item.title}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{item.display_type}</p>
            </div>
            <button onClick={() => handleDelete(item.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}