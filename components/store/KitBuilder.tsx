"use client";

import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/context/cart-context";
import { getProducts, Product } from "@/data/products"; // Importamos a função, não a lista vazia
import { ChevronRight, Check, PackagePlus, RefreshCcw, Loader2 } from "lucide-react";

export function KitBuilder() {
  const { addToCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, Product>>({});
  
  // Novos estados para dados dinâmicos
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Buscar produtos do Supabase ao carregar
  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setDbProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  // 2. Definir as etapas dinamicamente usando useMemo (só recalcula quando dbProducts mudar)
  const steps = useMemo(() => [
    {
      id: 1,
      title: "1. Escolha a Seda",
      category: "sedas",
      // Filtra baseado nos dados reais do banco
      options: dbProducts.filter(p => p.category === "sedas" && p.name.toLowerCase().includes("seda"))
    },
    {
      id: 2,
      title: "2. Escolha a Piteira",
      category: "sedas",
      options: dbProducts.filter(p => p.name.toLowerCase().includes("piteira"))
    },
    {
      id: 3,
      title: "3. O Fogo",
      category: "fogo",
      options: dbProducts.filter(p => p.category === "fogo")
    }
  ], [dbProducts]);

  const handleSelect = (stepId: number, product: Product) => {
    setSelections({ ...selections, [stepId]: product });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetBuilder = () => {
    setSelections({});
    setCurrentStep(0);
  };

  // Cálculos
  const selectedItems = Object.values(selections);
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const discount = subtotal * 0.10; // 10% de desconto
  const total = subtotal - discount;

  const handleAddToCart = () => {
    const customKit: Product = {
      id: `custom-kit-${Date.now()}`,
      name: "Kit Personalizado (Montado)",
      price: total,
      category: "kits",
      image: "/products/kit_start.png", // Imagem padrão
      isNew: false
    };
    
    addToCart(customKit);
    resetBuilder();
    alert("Kit adicionado ao carrinho com sucesso! 🍁");
  };

  if (loading) {
    return (
      <section className="py-20 bg-zinc-50 border-y border-zinc-200 text-center">
        <div className="flex justify-center items-center gap-2 text-green-forest font-bold animate-pulse">
           <Loader2 className="w-6 h-6 animate-spin" /> Carregando opções do Montador...
        </div>
      </section>
    );
  }

  const currentStepData = steps[currentStep];
  // Proteção contra passo indefinido
  if (!currentStepData) return null;

  const isStepComplete = selections[currentStepData.id];
  const isFinished = Object.keys(selections).length === steps.length;

  return (
    <section className="py-20 bg-zinc-50 border-y border-zinc-200">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-10">
          <span className="bg-green-neon text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Faça do seu jeito
          </span>
          <h2 className="font-display text-4xl text-urban-black mt-3">
            MONTE SEU <span className="text-green-forest">KIT</span>
          </h2>
          <p className="text-zinc-500">Escolha os itens e ganhe <strong className="text-green-600">10% de desconto</strong> no final.</p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          
          {/* Lado Esquerdo: As Opções */}
          <div className="md:col-span-8">
            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-zinc-100 min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-2xl text-urban-black">
                  {currentStepData.title}
                </h3>
                <span className="text-zinc-400 text-sm">Passo {currentStep + 1} de {steps.length}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentStepData.options.length === 0 ? (
                    <p className="text-zinc-400 col-span-3 text-center py-10">Nenhuma opção encontrada nesta categoria.</p>
                ) : (
                    currentStepData.options.map((option) => (
                    <div 
                        key={option.id}
                        onClick={() => handleSelect(currentStepData.id, option)}
                        className={`cursor-pointer rounded-xl p-4 border-2 transition-all group relative ${
                        selections[currentStepData.id]?.id === option.id
                            ? "border-green-neon bg-green-soft"
                            : "border-zinc-100 hover:border-green-200"
                        }`}
                    >
                        <div className="aspect-square bg-zinc-100 rounded-lg mb-3 flex items-center justify-center text-3xl">
                        {option.category === 'sedas' ? '📜' : '🔥'}
                        </div>
                        <h4 className="font-bold text-urban-black text-sm leading-tight">{option.name}</h4>
                        <p className="text-zinc-500 text-sm mt-1">R$ {option.price.toFixed(2)}</p>
                        
                        {selections[currentStepData.id]?.id === option.id && (
                        <div className="absolute top-2 right-2 bg-green-neon rounded-full p-1">
                            <Check className="w-3 h-3 text-black" />
                        </div>
                        )}
                    </div>
                    ))
                )}
              </div>

              <div className="mt-8 flex justify-end">
                {isStepComplete && !isFinished && (
                  <button 
                    onClick={nextStep}
                    className="bg-urban-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-colors animate-in fade-in"
                  >
                    Próximo <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Lado Direito: O Resumo */}
          <div className="md:col-span-4">
            <div className="bg-urban-black text-white p-6 rounded-[24px] sticky top-24">
              <h3 className="font-display text-xl mb-6 flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-green-neon" /> SEU KIT
              </h3>

              <div className="space-y-4 mb-8 min-h-[150px]">
                {selectedItems.length === 0 && (
                  <p className="text-zinc-500 text-sm italic">Selecione os itens ao lado para começar...</p>
                )}
                
                {selectedItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
                    <span className="text-zinc-300">{item.name}</span>
                    <span>R$ {item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-700 pt-4 space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-neon">
                  <span>Desconto (10%)</span>
                  <span>- R$ {discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-display text-2xl mt-2">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {isFinished ? (
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-green-neon text-black font-bold py-4 rounded-xl mt-6 hover:bg-green-400 transition-colors shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                >
                  ADICIONAR AO CARRINHO
                </button>
              ) : (
                <button disabled className="w-full bg-zinc-800 text-zinc-500 font-bold py-4 rounded-xl mt-6 cursor-not-allowed">
                  Complete as 3 etapas
                </button>
              )}
              
              {selectedItems.length > 0 && (
                <button onClick={resetBuilder} className="w-full text-center text-zinc-500 text-xs mt-4 hover:text-white flex items-center justify-center gap-1">
                  <RefreshCcw className="w-3 h-3" /> Reiniciar
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}