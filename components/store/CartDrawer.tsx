"use client";

import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { X, Minus, Plus, Trash2, ShoppingBag, MapPin, ChevronDown, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site-config"; 

// Tabela de frete (Você pode transferir isso para o site-config.ts depois)
const bairrosFrete: Record<string, number> = {
  "Aldeota": 10,
  "Meireles": 10,
  "Centro": 12,
  "Papicu": 15,
  "Messejana": 25,
  "Outro": 15
};

export function CartDrawer() {
  const { items, removeFromCart, updateQuantity, total, isCartOpen, closeCart } = useCart();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [userAddresses, setUserAddresses] = useState<any[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<string>("");

  useEffect(() => {
    if (isCartOpen && user && items.length > 0) {
      loadAddresses();
    }
  }, [isCartOpen, user, items.length]);

  async function loadAddresses() {
    const { data } = await supabase.from("addresses").select("*").eq("user_id", user?.id);
    setUserAddresses(data || []);
    if (data?.length) setSelectedAddrId(data[0].id);
  }

  // --- REGRAS DE NEGÓCIO ---
  const minOrder = 20;
  const isMinOrderReached = total >= minOrder;
  
  const selectedAddress = userAddresses.find(a => a.id === selectedAddrId);
  const baseShipping = selectedAddress ? (bairrosFrete[selectedAddress.neighborhood] || 15) : 0;
  
  const isVIP = profile?.role === 'vip';
  let finalShipping = total >= 100 ? 0 : baseShipping;
  if (isVIP && finalShipping > 0) finalShipping = finalShipping * 0.85; // 15% Desconto VIP

  const finalTotal = total + finalShipping;

  const handleCheckout = () => {
    if (!user) {
      closeCart();
      router.push("/login");
      return;
    }

    if (!selectedAddress) {
      alert("Por favor, adicione um endereço de entrega no seu perfil.");
      closeCart();
      router.push("/profile");
      return;
    }

    const phone = siteConfig.contact.whatsappNumber || "5585996699921";
    const itensText = items.map(i => `${i.quantity}x ${i.name} (R$ ${(i.price * i.quantity).toFixed(2)})`).join('%0A');
    
    let text = `🍃 *Salve GoGreen! Quero fechar meu pedido:*%0A%0A${itensText}%0A%0A`;
    text += `*Subtotal:* R$ ${total.toFixed(2)}%0A`;
    text += `*Frete:* ${finalShipping === 0 ? 'GRÁTIS ⚡' : `R$ ${finalShipping.toFixed(2)}`}%0A`;
    if (isVIP && finalShipping > 0) text += `*(Desconto VIP Aplicado)*%0A`;
    text += `*TOTAL:* R$ ${finalTotal.toFixed(2)}%0A%0A`;
    text += `📍 *Entrega em:*%0A${selectedAddress.street}, ${selectedAddress.number} - ${selectedAddress.neighborhood}`;

    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeCart}></div>
      <div className="relative w-full max-w-md bg-[#080a09] border-l border-zinc-900 h-full flex flex-col animate-in slide-in-from-right-full shadow-2xl">
        
        <div className="flex items-center justify-between p-6 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-green-500" />
            <h2 className="font-display text-xl text-white">Meu Kit</h2>
          </div>
          <button onClick={closeCart} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p>O carrinho está vazio.</p>
              <button onClick={closeCart} className="text-green-500 font-bold uppercase tracking-widest text-sm hover:underline">
                Ver Produtos
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-zinc-950/50 border border-zinc-900 p-4 rounded-2xl">
                <div className="w-20 h-20 bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-bold text-white leading-tight mb-1">{item.name}</h3>
                  <p className="text-green-500 font-display mb-3">R$ {(item.price * item.quantity).toFixed(2)}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 bg-zinc-900 rounded-lg px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-zinc-400 hover:text-white"><Minus className="w-4 h-4" /></button>
                      <span className="font-bold text-sm w-4 text-center text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-zinc-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-zinc-950/80 border-t border-zinc-900">
            
            {/* Seleção de Endereço só aparece se logado */}
            {user ? (
              <div className="mb-4">
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 flex items-center gap-2 ml-1">
                  <MapPin className="w-3 h-3 text-green-500" /> Entrega:
                </label>
                <div className="relative">
                  <select 
                    value={selectedAddrId} 
                    onChange={(e) => setSelectedAddrId(e.target.value)}
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-white outline-none focus:border-green-500 appearance-none"
                  >
                    {userAddresses.length === 0 && <option value="">Nenhum endereço cadastrado</option>}
                    {userAddresses.map(a => (
                      <option key={a.id} value={a.id}>{a.street}, {a.number} - {a.neighborhood}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            ) : (
              <div className="mb-4 bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
                <Lock className="w-5 h-5 text-green-500 shrink-0" />
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Faça login para calcular o frete, acumular pontos no <strong className="text-white">Green Card</strong> e finalizar o pedido.
                </p>
              </div>
            )}

            <div className="space-y-2 mb-6 border-b border-zinc-900 pb-4">
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              
              {user && (
                <div className="flex justify-between text-zinc-400 text-sm">
                  <span className="flex items-center gap-1">Frete {isVIP && <span className="text-[10px] bg-green-500/20 text-green-500 px-1 rounded">VIP</span>}</span>
                  {finalShipping === 0 ? (
                    <span className="text-green-500 font-bold">GRÁTIS ⚡</span>
                  ) : (
                    <span>R$ {finalShipping.toFixed(2)}</span>
                  )}
                </div>
              )}

              {!isMinOrderReached && (
                <p className="text-red-500 text-xs font-bold text-right mt-2">
                  Falta R$ {(minOrder - total).toFixed(2)} para o pedido mínimo.
                </p>
              )}
              {total > 0 && total < 100 && user && (
                <p className="text-green-500 text-[10px] font-bold text-right uppercase tracking-widest mt-2">
                  Falta R$ {(100 - total).toFixed(2)} para frete grátis!
                </p>
              )}
            </div>

            <div className="flex justify-between items-end mb-6">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Total a pagar:</span>
              <span className="font-display text-3xl text-white">R$ {user ? finalTotal.toFixed(2) : total.toFixed(2)}</span>
            </div>
            
            <button 
              disabled={!isMinOrderReached || (user !== null && userAddresses.length === 0)}
              onClick={handleCheckout}
              className={`w-full font-display text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
                !isMinOrderReached 
                  ? "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800" 
                  : (user && userAddresses.length === 0)
                    ? "bg-yellow-500 text-black hover:bg-yellow-400"
                    : "bg-green-500 text-black hover:bg-white"
              }`}
            >
              {!user ? (
                 <>Entrar e Finalizar <Lock className="w-5 h-5" /></>
              ) : !isMinOrderReached ? (
                 `Mínimo R$ ${minOrder.toFixed(2)}`
              ) : userAddresses.length === 0 ? (
                 "Cadastrar Endereço"
              ) : (
                 "Avançar para Pagamento"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}