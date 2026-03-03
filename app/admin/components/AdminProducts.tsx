"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Loader2, PackageSearch, Edit, X, Save, Upload, ImageIcon } from "lucide-react";

export function AdminProducts({ showToast }: { showToast: (type: 'success' | 'error', msg: string) => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emptyProduct = { 
    name: "", 
    description: "", 
    price: 0, 
    cost: 0, 
    stock: 0, 
    category: "kits", 
    image_url: "", 
    points_awarded: 0, 
    is_kit_item: false 
  };
  
  const [newProduct, setNewProduct] = useState(emptyProduct);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
        if (isMounted) setProducts(data || []);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
  }

  // UPLOAD DE IMAGEM NO BUCKET 'products'
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product_images/${fileName}`; // Salva na pasta product_images dentro do bucket products

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setNewProduct({ ...newProduct, image_url: publicUrl });
      showToast('success', 'Imagem carregada com sucesso!');

    } catch (error) {
      console.error('Erro no upload:', error);
      showToast('error', 'Falha ao carregar arquivo de imagem.');
    } finally {
      setUploading(false);
    }
  }

  // LÓGICA DE SALVAMENTO COM PAYLOAD "LIMPO" PARA EVITAR ERRO 400
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    // Mapeamento EXATO do que vai para o banco de dados. 
    // Ignoramos a chave `image_url` e usamos apenas `image`
    const payload = {
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      cost: newProduct.cost,
      stock: newProduct.stock,
      category: newProduct.category,
      image: newProduct.image_url, // A coluna no banco chama 'image'
      points_awarded: newProduct.points_awarded,
      is_kit_item: newProduct.is_kit_item
    };

    if (editingId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingId);
      if (!error) {
        setEditingId(null); setNewProduct(emptyProduct); fetchProducts();
        showToast('success', 'Produto atualizado com sucesso!');
      } else { 
        console.error(error);
        showToast('error', 'Erro ao atualizar.'); 
      }
    } else {
      const { error } = await supabase.from("products").insert([payload]);
      if (!error) {
        setNewProduct(emptyProduct); fetchProducts();
        showToast('success', 'Produto cadastrado com sucesso!');
      } else { 
        console.error(error);
        showToast('error', 'Erro ao cadastrar.'); 
      }
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if(!confirm("Tem a certeza que deseja remover este produto?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
    showToast('success', 'Produto removido.'); 
  }

  const handleEditClick = (prod: any) => {
    setEditingId(prod.id);
    setNewProduct({
      name: prod.name, 
      description: prod.description || "", 
      price: prod.price, 
      cost: prod.cost || 0,
      stock: prod.stock, 
      category: prod.category, 
      image_url: prod.image || "", // Puxa do banco como 'image'
      points_awarded: prod.points_awarded || 0, 
      is_kit_item: prod.is_kit_item || false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-zinc-900" /></div>;

  return (
    <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm admin-panel">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900">
          <PackageSearch className="w-5 h-5 text-zinc-500" /> Gestão de Produtos
        </h2>
      </div>

      <form onSubmit={handleSave} className={`p-6 rounded-xl mb-8 grid md:grid-cols-4 gap-4 border transition-colors ${editingId ? 'bg-blue-50/10 border-blue-200' : 'bg-zinc-50 border-zinc-200'}`}>
        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase text-zinc-500">Nome do Produto</label>
          <input required className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white text-zinc-900" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="Ex: Seda Zomo Brown" />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-zinc-500">Categoria</label>
          <select className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white text-zinc-900" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
             <option value="kits">📦 Kits Salva-Rolê</option>
             <option value="papelaria">📜 Papelaria</option>
             <option value="fogo">🔥 Fogo</option>
             <option value="fumos">🌿 Fumos & Tabacos</option>
             <option value="vidros">🔮 Vidros & Bongs</option>
             <option value="ferramentas">✂️ Ferramentas</option>
             <option value="armazenamento">🏺 Armazenamento</option>
             <option value="vaporizadores">💨 Vaporizadores</option>
             <option value="limpeza">🧽 Limpeza</option>
             <option value="lifestyle">🧢 Lifestyle</option>
             <option value="acessorios">🔌 Acessórios</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-zinc-500">Estoque</label>
          <input required type="number" className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white text-zinc-900" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-zinc-500">Preço Venda (R$)</label>
          <input required type="number" step="0.01" className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white font-bold text-zinc-900" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-zinc-500">Custo (R$)</label>
          <input required type="number" step="0.01" className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white text-zinc-900" value={newProduct.cost} onChange={e => setNewProduct({...newProduct, cost: Number(e.target.value)})} />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase text-zinc-500">Pontos VIP Gerados</label>
          <input required type="number" className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white text-zinc-900" value={newProduct.points_awarded} onChange={e => setNewProduct({...newProduct, points_awarded: Number(e.target.value)})} />
        </div>

        <div className="md:col-span-4">
          <label className="text-xs font-bold uppercase text-zinc-500">Foto do Produto (.png, .jpg)</label>
          <div className="flex items-center gap-4 mt-1">
            <div className="w-16 h-16 rounded-xl bg-white border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
              {newProduct.image_url ? (
                <img src={newProduct.image_url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-zinc-300" />
              )}
            </div>
            <label className="flex-1 group cursor-pointer">
              <div className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-zinc-200 rounded-xl hover:border-zinc-900 hover:bg-white transition-all text-zinc-500 hover:text-zinc-900">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="text-sm font-bold">{uploading ? "Subindo Imagem..." : "Selecionar Imagem"}</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={uploading} 
              />
            </label>
            {newProduct.image_url && (
               <button type="button" onClick={() => setNewProduct({...newProduct, image_url: ""})} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Remover imagem"><X className="w-4 h-4" /></button>
            )}
          </div>
        </div>

        <div className="md:col-span-4 flex items-center gap-3 bg-white border border-zinc-200 p-4 rounded-lg">
          <input type="checkbox" id="kit_toggle" className="w-4 h-4 cursor-pointer" checked={newProduct.is_kit_item} onChange={e => setNewProduct({...newProduct, is_kit_item: e.target.checked})} />
          <label htmlFor="kit_toggle" className="text-sm font-medium text-zinc-700 cursor-pointer">Disponível no "Monte seu Kit"</label>
        </div>
        
        <div className="md:col-span-4 flex gap-3 mt-2">
          <button disabled={saving || uploading} type="submit" className="flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all bg-zinc-900 text-white hover:bg-zinc-800">
            {saving ? <Loader2 className="animate-spin w-5 h-5" /> : editingId ? <><Save className="w-5 h-5"/> Atualizar</> : <><Plus className="w-5 h-5"/> Cadastrar</>}
          </button>
          {editingId && (
            <button type="button" onClick={() => {setEditingId(null); setNewProduct(emptyProduct);}} className="px-6 bg-white border border-zinc-200 text-zinc-600 font-bold rounded-lg hover:bg-zinc-50 flex items-center justify-center"><X className="w-5 h-5" /> Cancelar</button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto border border-zinc-100 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr className="text-xs uppercase tracking-widest text-zinc-500">
              <th className="p-4 font-bold">Produto</th>
              <th className="p-4 font-bold">Estoque</th>
              <th className="p-4 font-bold">Preço</th>
              <th className="p-4 font-bold text-emerald-600">Pontos</th>
              <th className="p-4 font-bold text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors text-sm">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                     <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40")} />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{prod.name}</p>
                    <p className="text-[10px] uppercase text-zinc-400 tracking-wider">{prod.category}</p>
                  </div>
                </td>
                <td className="p-4"><span className={`px-2 py-1 rounded-md text-xs font-bold ${prod.stock < 5 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>{prod.stock} un</span></td>
                <td className="p-4 font-medium text-zinc-900">R$ {prod.price.toFixed(2)}</td>
                <td className="p-4 font-bold text-emerald-600">+{prod.points_awarded || 0}</td>
                <td className="p-4 flex justify-end gap-2 mt-1">
                  <button onClick={() => handleEditClick(prod)} className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(prod.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}