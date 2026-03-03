"use client";

import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/context/cart-context";
import { supabase } from "@/lib/supabase"; 
import { ChevronRight, Check, PackagePlus, RefreshCcw, Loader2 } from "lucide-react";
import { Product } from "@/data/products";

export function KitBuilder() {
  const { addToCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, Product>>({});
  
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [prodsRes, settingsRes] = await Promise.all([
          supabase.from("products").select("*").eq("is_kit_item", true),
          supabase.from("store_settings").select("*")
        ]);

        if (isMounted) {
          if (prodsRes.data) setDbProducts(prodsRes.data);
          if (settingsRes.data) {
             const disc = settingsRes.data.find(s => s.id === "kit_discount_percent");
             const vis = settingsRes.data.find(s => s.id === "kit_builder_visible");
             if (disc) setDiscountPercent(Number(disc.value));
             if (vis) setIsVisible(vis.value === 'true'); 
          }
        }
      } catch (error) {
        console.error("Erro ao carregar Kit:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const steps = useMemo(() => [
    { id: 1, title: "1. Escolha a Seda", options: dbProducts.filter(p => p.category === "papelaria" && p.name.toLowerCase().includes("seda")) },
    { id: 2, title: "2. Escolha a Piteira", options: dbProducts.filter(p => p.category === "papelaria" && p.name.toLowerCase().includes("piteira")) },
    { id: 3, title: "3. O Fogo", options: dbProducts.filter(p => p.category === "fogo") }
  ], [dbProducts]);

  const handleSelect = (stepId: number, product: Product) => setSelections({ ...selections, [stepId]: product });
  const nextStep = () => { if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1); };
  const resetBuilder = () => { setSelections({}); setCurrentStep(0); };

  // Cálculos Dinâmicos
  const selectedItems = Object.values(selections);
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const discountAmount = subtotal * (discountPercent / 100); 
  const total = subtotal - discountAmount;

  const handleAddToCart = () => {
    const customKit: Product = {
      id: `custom-kit-${Date.now()}`,
      name: `Kit Personalizado (${discountPercent}% OFF)`,
      price: total,
      category: "kits",
      image: "/products/kit_start.png", 
      isNew: false
    };
    addToCart(customKit);
    resetBuilder();
    alert("Kit adicionado ao carrinho com sucesso! 🍁");
  };

  if (loading) return (
    <section className="py-20 bg-zinc-50 border-y border-zinc-200 text-center">
      <div className="flex justify-center items-center gap-2 text-green-forest font-bold animate-pulse">
         <Loader2 className="w-6 h-6 animate-spin" /> Carregando opções do Montador...
      </div>
    </section>
  );

  const currentStepData = steps[currentStep];
  if (!currentStepData) return null;

  const isStepComplete = selections[currentStepData.id];
  const isFinished = Object.keys(selections).length === steps.length;

  // Se o admin desligou no painel, nem renderiza o componente inteiro!
  if (!isVisible) return null;

  return (
    <section className="py-20 bg-zinc-950/30 border-y border-zinc-900 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="text-center mb-10">
          <span className="bg-green-neon text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Faça do seu jeito</span>
          <h2 className="font-display text-4xl text-white mt-4 drop-shadow-md">MONTE SEU <span className="text-green-neon">KIT</span></h2>
          <p className="text-zinc-400 mt-2">Escolha os itens e ganhe <strong className="text-green-neon">{discountPercent}% de desconto</strong> no final.</p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <div className="bg-zinc-900 p-6 md:p-8 rounded-[32px] border border-zinc-800 min-h-[400px]">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
                <h3 className="font-display text-2xl text-white">{currentStepData.title}</h3>
                <span className="text-zinc-500 text-sm font-bold bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">Passo {currentStep + 1} de {steps.length}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentStepData.options.length === 0 ? (
                    <p className="text-zinc-500 col-span-3 text-center py-10">Nenhuma opção nesta categoria.</p>
                ) : (
                    currentStepData.options.map((option) => (
                    <div 
                        key={option.id} onClick={() => handleSelect(currentStepData.id, option)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all group relative ${selections[currentStepData.id]?.id === option.id ? "border-green-neon bg-green-neon/10" : "border-zinc-800 bg-zinc-950 hover:border-green-neon/50"}`}
                    >
                        <div className="aspect-square bg-zinc-900 rounded-xl mb-3 flex items-center justify-center text-3xl border border-zinc-800">{option.category === 'papelaria' ? '📜' : '🔥'}</div>
                        <h4 className="font-bold text-white text-sm leading-tight">{option.name}</h4>
                        <p className="text-zinc-400 text-sm mt-1">R$ {option.price.toFixed(2)}</p>
                        {selections[currentStepData.id]?.id === option.id && (<div className="absolute top-2 right-2 bg-green-neon rounded-full p-1 shadow-[0_0_10px_rgba(57,255,20,0.5)]"><Check className="w-3 h-3 text-black" /></div>)}
                    </div>
                    ))
                )}
              </div>
              <div className="mt-8 flex justify-end">
                {isStepComplete && !isFinished && (<button onClick={nextStep} className="bg-green-neon text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-colors animate-in fade-in">Próximo <ChevronRight className="w-4 h-4" /></button>)}
              </div>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="bg-urban-black text-white p-6 rounded-[32px] border border-zinc-800 sticky top-24">
              <h3 className="font-display text-xl mb-6 flex items-center gap-2 text-green-neon"><PackagePlus className="w-5 h-5" /> SEU KIT</h3>
              <div className="space-y-4 mb-8 min-h-[150px]">
                {selectedItems.length === 0 && <p className="text-zinc-600 text-sm italic">Selecione os itens para começar...</p>}
                {selectedItems.map((item, idx) => (<div key={idx} className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2"><span className="text-zinc-300 truncate pr-4">{item.name}</span><span className="font-bold text-white">R$ {item.price.toFixed(2)}</span></div>))}
              </div>
              <div className="border-t border-zinc-800 pt-4 space-y-2">
                <div className="flex justify-between text-zinc-400 text-sm"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-green-neon text-sm font-bold"><span>Desconto ({discountPercent}%)</span><span>- R$ {discountAmount.toFixed(2)}</span></div>
                <div className="flex justify-between font-display text-3xl mt-4 pt-4 border-t border-zinc-800"><span>Total</span><span className="text-white">R$ {total.toFixed(2)}</span></div>
              </div>
              {isFinished ? (<button onClick={handleAddToCart} className="w-full bg-green-neon text-black font-bold py-4 rounded-xl mt-6 hover:bg-white transition-colors shadow-[0_0_20px_rgba(57,255,20,0.3)]">ADICIONAR AO CARRINHO</button>) : (<button disabled className="w-full bg-zinc-900 text-zinc-600 font-bold py-4 rounded-xl mt-6 border border-zinc-800 cursor-not-allowed">Complete as 3 etapas</button>)}
              {selectedItems.length > 0 && (<button onClick={resetBuilder} className="w-full text-center text-zinc-500 text-xs mt-4 hover:text-white flex items-center justify-center gap-1 transition-colors"><RefreshCcw className="w-3 h-3" /> Reiniciar</button>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}