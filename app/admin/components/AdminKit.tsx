"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PackagePlus, Loader2, Save, Percent, Eye, EyeOff, Plus, Check } from "lucide-react";

export function AdminKit({ showToast }: { showToast: (type: 'success' | 'error', msg: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingCombo, setSavingCombo] = useState(false);
  
  // Estados do Montador Dinâmico
  const [discount, setDiscount] = useState<number>(10);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [kitProducts, setKitProducts] = useState<any[]>([]);

  // Estados do Criador de Combos Fixos
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [comboName, setComboName] = useState("");
  const [comboPrice, setComboPrice] = useState(0);
  const [comboStock, setComboStock] = useState(10);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [settingsRes, prodsRes, allProdsRes] = await Promise.all([
          supabase.from("store_settings").select("*"),
          supabase.from("products").select("*").eq("is_kit_item", true),
          supabase.from("products").select("*").order("category", { ascending: true })
        ]);

        if (isMounted) {
          if (settingsRes.data) {
            const disc = settingsRes.data.find(s => s.id === "kit_discount_percent");
            const vis = settingsRes.data.find(s => s.id === "kit_builder_visible");
            if (disc) setDiscount(Number(disc.value));
            if (vis) setIsVisible(vis.value === 'true');
          }
          if (prodsRes.data) setKitProducts(prodsRes.data);
          if (allProdsRes.data) setAllProducts(allProdsRes.data);
        }
      } finally { if (isMounted) setLoading(false); }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  // --- SALVAR CONFIGURAÇÕES GERAIS ---
  async function handleSaveSettings() {
    setSavingSettings(true);
    await supabase.from("store_settings").upsert([
      { id: "kit_discount_percent", value: discount.toString() },
      { id: "kit_builder_visible", value: isVisible.toString() }
    ]);
    showToast('success', 'Regras do Montador atualizadas com sucesso!');
    setSavingSettings(false);
  }

  // --- LÓGICA DO CRIADOR DE COMBOS ---
  const handleToggleItem = (prod: any) => {
    if (selectedItems.find(i => i.id === prod.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== prod.id));
    } else {
      setSelectedItems([...selectedItems, prod]);
    }
  };

  const comboSubtotal = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const comboCost = selectedItems.reduce((acc, item) => acc + (item.cost || 0), 0);

  async function handleCreateCombo(e: React.FormEvent) {
    e.preventDefault();
    if (selectedItems.length === 0) return showToast('error', 'Selecione ao menos 1 item para montar o kit.');
    
    setSavingCombo(true);
    const desc = "Kit contendo: " + selectedItems.map(i => i.name).join(", ");
    
    const { error } = await supabase.from("products").insert([{
      name: comboName,
      description: desc,
      price: comboPrice,
      cost: comboCost,
      stock: comboStock,
      category: "kits",
      image_url: "/products/kit_start.png", // Imagem padrão de kit
      is_kit_item: false,
      points_awarded: Math.floor(comboPrice * 0.5) // Ex: Ganha metade do preço em pontos
    }]);

    if (!error) {
      showToast('success', 'Combo criado e enviado para a vitrine!');
      setComboName(""); setComboPrice(0); setSelectedItems([]); setComboStock(10);
    } else {
      showToast('error', 'Erro ao criar o combo.');
    }
    setSavingCombo(false);
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-zinc-900" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* SEÇÃO 1: MONTADOR DINÂMICO */}
      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
        <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900 mb-6 border-b border-zinc-100 pb-4">
          <PackagePlus className="w-5 h-5 text-zinc-500" /> 1. Montador de Kits Dinâmico
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-xl">
            <label className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-1 mb-2">
              Visibilidade na Loja
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-700">Mostrar "Monte seu Kit" no site?</span>
              <button 
                onClick={() => setIsVisible(!isVisible)}
                className={`p-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-all ${isVisible ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-500'}`}
              >
                {isVisible ? <><Eye className="w-4 h-4"/> Visível</> : <><EyeOff className="w-4 h-4"/> Oculto</>}
              </button>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-xl flex flex-col justify-between">
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-1 mb-2">
                <Percent className="w-3 h-3" /> Desconto Final Automático (%)
              </label>
              <input 
                type="number" 
                className="w-full p-3 rounded-lg border border-zinc-200 outline-none focus:border-zinc-900 bg-white text-zinc-900 font-bold" 
                value={discount} onChange={e => setDiscount(Number(e.target.value))} 
              />
            </div>
          </div>
        </div>

        <button onClick={handleSaveSettings} disabled={savingSettings} className="bg-zinc-900 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-zinc-800 transition-colors w-full justify-center">
          {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar Configurações do Montador
        </button>
      </div>

      {/* SEÇÃO 2: FÁBRICA DE COMBOS (KITS FIXOS) */}
      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
        <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900 mb-2">
          Fábrica de Combos (Kits Prontos)
        </h2>
        <p className="text-zinc-500 text-sm mb-6 border-b border-zinc-100 pb-4">
          Junte produtos avulsos, defina um preço promocional e crie um novo Kit que aparecerá direto na vitrine.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Coluna Esquerda: Seleção de Produtos */}
          <div>
            <label className="text-xs font-bold uppercase text-zinc-500 mb-2 block">Selecione os produtos para o combo:</label>
            <div className="border border-zinc-200 rounded-xl max-h-80 overflow-y-auto bg-zinc-50 p-2 space-y-1">
              {allProducts.map(prod => {
                const isSelected = selectedItems.find(i => i.id === prod.id);
                return (
                  <div 
                    key={prod.id} 
                    onClick={() => handleToggleItem(prod)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-colors ${isSelected ? 'bg-white border-zinc-900 shadow-sm' : 'bg-transparent border-transparent hover:bg-zinc-100'}`}
                  >
                    <div>
                      <p className={`text-sm font-bold ${isSelected ? 'text-zinc-900' : 'text-zinc-600'}`}>{prod.name}</p>
                      <p className="text-[10px] text-zinc-400">R$ {prod.price.toFixed(2)}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-zinc-900" />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Coluna Direita: Precificação e Salvamento */}
          <form onSubmit={handleCreateCombo} className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-zinc-500">Nome do Novo Kit</label>
                <input required className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white text-zinc-900" value={comboName} onChange={e => setComboName(e.target.value)} placeholder="Ex: Kit Fim de Semana" />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold uppercase text-zinc-500">Preço de Venda Final</label>
                  <input required type="number" step="0.01" className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white font-bold text-zinc-900" value={comboPrice} onChange={e => setComboPrice(Number(e.target.value))} />
                </div>
                <div className="w-1/3">
                  <label className="text-xs font-bold uppercase text-zinc-500">Qtd. em Estoque</label>
                  <input required type="number" className="w-full p-3 rounded-lg border border-zinc-200 mt-1 outline-none focus:border-zinc-900 bg-white text-zinc-900" value={comboStock} onChange={e => setComboStock(Number(e.target.value))} />
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-4 mt-4 space-y-1">
                <div className="flex justify-between text-xs text-zinc-500"><span>Custo Real da Combinação:</span> <span>R$ {comboCost.toFixed(2)}</span></div>
                <div className="flex justify-between text-xs text-zinc-500"><span>Preço se vendido avulso:</span> <span className="line-through">R$ {comboSubtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm font-bold text-emerald-600 mt-2 pt-2 border-t border-zinc-200">
                  <span>Lucro Estimado por Kit:</span> 
                  <span>R$ {(comboPrice - comboCost).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button disabled={savingCombo} type="submit" className="w-full bg-zinc-900 text-white py-3 mt-6 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors">
              {savingCombo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Publicar Novo Kit
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}