"use client";

import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { X, Minus, Plus, Trash2, ShoppingBag, MapPin, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function CartDrawer() {
  const { items, removeFromCart, updateQuantity, total, isCartOpen, closeCart } = useCart();
  const { user, profile } = useAuth();
  const [userAddresses, setUserAddresses] = useState<any[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<string>("");

  useEffect(() => {
    if (isCartOpen && user) {
      loadAddresses();
    }
  }, [isCartOpen, user]);

  async function loadAddresses() {
    const { data } = await supabase.from("addresses").select("*").eq("user_id", user?.id);
    setUserAddresses(data || []);
    if (data?.length) setSelectedAddrId(data[0].id);
  }

  const generateCheckoutUrl = () => {
    const phone = "5585996699921";
    const addr = userAddresses.find(a => a.id === selectedAddrId);
    
    let message = `*🍁 Salve GoGreen! Pedido VIP:*\n\n`;
    items.forEach(i => message += `▪️ ${i.quantity}x ${i.name} - R$ ${(i.price * i.quantity).toFixed(2)}\n`);
    message += `\n*💰 Total: R$ ${total.toFixed(2)}*`;
    
    if (addr) {
      message += `\n\n*📍 Entrega em:* ${addr.street}, ${addr.number}\n*Bairro:* ${addr.neighborhood}\n*CEP:* ${addr.cep}`;
      if (addr.complement) message += `\n*Complemento:* ${addr.complement}`;
      message += `\n\n_(Pode calcular o Flash pra cá?)_`;
    } else {
      message += `\n\nQuero combinar o local de entrega!`;
    }
    
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeCart}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display text-2xl text-green-forest flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" /> SEU KIT
          </h2>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6 text-zinc-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 text-2xl">🌿</div>
                <div className="flex-1">
                  <h3 className="font-display text-sm text-urban-black leading-tight mb-1">{item.name}</h3>
                  <p className="font-bold text-zinc-500 text-sm">R$ {item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100"><Minus className="w-4 h-4 text-zinc-400" /></button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100"><Plus className="w-4 h-4 text-green-forest" /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="p-6 border-t border-gray-100 bg-zinc-50">
          {userAddresses.length > 0 && (
            <div className="mb-4">
              <label className="text-[10px] font-bold text-zinc-400 uppercase mb-2 block ml-1">Enviar para:</label>
              <div className="relative">
                <select 
                  value={selectedAddrId} 
                  onChange={(e) => setSelectedAddrId(e.target.value)}
                  className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold outline-none focus:border-green-neon appearance-none"
                >
                  {userAddresses.map(a => (
                    <option key={a.id} value={a.id}>{a.street}, {a.number}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          )}

          <div className="flex justify-between items-end mb-4">
            <span className="text-zinc-500 font-bold">Total:</span>
            <span className="font-display text-3xl text-green-forest">R$ {total.toFixed(2)}</span>
          </div>
          
          <a 
            href={generateCheckoutUrl()}
            target="_blank"
            className="w-full bg-green-neon text-black font-display text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-400 transition-all shadow-lg"
          >
            FINALIZAR NO ZAP 📲
          </a>
        </div>
      </div>
    </div>
  );
}