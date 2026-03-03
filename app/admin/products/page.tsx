"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash, Image as ImageIcon, Loader2, Save, X, Edit2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { categories } from "@/data/products"; // Importa categorias centralizadas

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Estado para Edição (se null, é criação)
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0, 
    cost: 0, 
    stock: 0,
    category: "kits",
    image_url: "/products/placeholder.png"
  });

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("name");
    if (data) setProducts(data);
  }

  // Prepara o modal para CRIAÇÃO
  function openCreateModal() {
    setEditingId(null);
    setFormData({ name: "", description: "", price: 0, cost: 0, stock: 0, category: "kits", image_url: "/products/placeholder.png" });
    setIsModalOpen(true);
  }

  // Prepara o modal para EDIÇÃO
  function openEditModal(product: any) {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      cost: product.cost || 0,
      stock: product.stock || 0,
      category: product.category || "kits",
      image_url: product.image_url || "/products/placeholder.png"
    });
    setIsModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (confirm("Deletar produto?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error } = await supabase.storage.from('products').upload(filePath, file);
      if (error) throw error;
      const { data } = supabase.storage.from('products').getPublicUrl(filePath);
      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (error: any) {
      alert('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!formData.name || formData.price <= 0) {
      alert("Preencha nome e preço.");
      return;
    }

    try {
      if (editingId) {
        // ATUALIZAR (UPDATE)
        const { error } = await supabase
          .from("products")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        // CRIAR (INSERT)
        const { error } = await supabase
          .from("products")
          .insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-display text-urban-black">Catálogo</h1>
           <p className="text-zinc-500">Gerencie produtos, estoque e preços.</p>
        </div>
        <button onClick={openCreateModal} className="bg-green-neon text-black px-6 py-3 rounded-xl font-bold flex gap-2 hover:bg-green-400 transition-colors shadow-lg shadow-green-neon/20">
          <Plus className="w-5 h-5" /> Adicionar Produto
        </button>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-zinc-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-100 uppercase tracking-wider text-zinc-500 text-xs">
            <tr>
              <th className="p-4 pl-6">Produto</th>
              <th className="p-4">Custo</th>
              <th className="p-4">Venda</th>
              <th className="p-4">Margem</th>
              <th className="p-4">Estoque</th>
              <th className="p-4 text-right pr-6">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {products.map(p => {
               const lucro = (p.price || 0) - (p.cost || 0);
               const margem = p.price > 0 ? ((lucro / p.price) * 100).toFixed(0) : 0;
               
               return (
              <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="p-4 pl-6 flex items-center gap-3">
                  <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-zinc-200" />
                  <div>
                    <div className="font-bold text-urban-black">{p.name}</div>
                    <div className="text-xs text-zinc-400 capitalize">{p.category}</div>
                  </div>
                </td>
                <td className="p-4 text-zinc-500 font-medium">{formatCurrency(p.cost || 0)}</td>
                <td className="p-4 text-green-700 font-bold">{formatCurrency(p.price)}</td>
                <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${Number(margem) > 30 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {margem}%
                    </span>
                </td>
                <td className="p-4">
                    <span className={`font-bold ${p.stock < 5 ? 'text-red-500' : 'text-zinc-700'}`}>
                        {p.stock} un.
                    </span>
                </td>
                <td className="p-4 text-right pr-6 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  {/* Botão Editar */}
                  <button onClick={() => openEditModal(p)} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  {/* Botão Deletar */}
                  <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                <h2 className="font-display text-xl text-urban-black">
                    {editingId ? "Editar Produto" : "Novo Produto"}
                </h2>
                <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-zinc-400 hover:text-red-500" /></button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
                {/* 1. Imagem */}
                <div className="flex justify-center">
                    <div className="relative group cursor-pointer">
                        <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-zinc-300 flex items-center justify-center overflow-hidden hover:border-green-neon transition-colors bg-zinc-50">
                            {formData.image_url && formData.image_url !== "/products/placeholder.png" ? (
                                <img src={formData.image_url} className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="w-8 h-8 text-zinc-300" />
                            )}
                        </div>
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} disabled={uploading} />
                        <div className="text-center mt-2 text-xs text-zinc-500 font-bold">{uploading ? "Enviando..." : "Alterar foto"}</div>
                    </div>
                </div>

                {/* 2. Dados Básicos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-400">Nome</label>
                        <input className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:border-green-neon outline-none" 
                            placeholder="Ex: Seda Zomo" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-400">Categoria</label>
                        <select className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:border-green-neon outline-none"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                            {/* Gera opções dinamicamente do arquivo de categorias */}
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                            {/* Fallback caso a categoria salva no banco não esteja na lista */}
                            <option value="geral">Geral</option>
                        </select>
                    </div>
                </div>

                {/* 3. Descrição */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400">Descrição</label>
                    <textarea className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:border-green-neon outline-none h-24 resize-none" 
                        placeholder="Detalhes..." 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                    />
                </div>

                {/* 4. Financeiro */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-green-soft/50 rounded-xl border border-green-100">
                     <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500">Custo (R$)</label>
                        <input type="number" step="0.01" className="w-full bg-white border border-zinc-200 p-2 rounded-lg focus:border-green-neon outline-none" 
                            value={formData.cost}
                            onChange={e => setFormData({...formData, cost: Number(e.target.value)})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-green-700">Venda (R$)</label>
                        <input type="number" step="0.01" className="w-full bg-white border border-green-200 p-2 rounded-lg focus:border-green-neon outline-none font-bold text-green-700" 
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500">Estoque</label>
                        <input type="number" className="w-full bg-white border border-zinc-200 p-2 rounded-lg focus:border-green-neon outline-none" 
                            value={formData.stock}
                            onChange={e => setFormData({...formData, stock: Number(e.target.value)})} 
                        />
                    </div>
                </div>
            </div>
            
            <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-zinc-200 text-zinc-500 py-4 rounded-xl font-bold hover:bg-zinc-100 transition-colors">
                    Cancelar
                </button>
                <button onClick={handleSave} disabled={uploading} className="flex-[2] bg-green-neon text-black py-4 rounded-xl font-bold hover:bg-green-400 transition-colors shadow-lg shadow-green-neon/20 flex items-center justify-center gap-2">
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin"/> : <><Save className="w-5 h-5" /> {editingId ? "Atualizar" : "Salvar"}</>}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}