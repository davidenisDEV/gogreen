"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Plus, Trash2, UserPlus, CreditCard, Banknote, QrCode, Loader2, ShoppingCart } from "lucide-react";

export function AdminPOS({ showToast }: { showToast: any }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  
  // Dados do Cliente
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").gt("stock", 0).order("name");
    setProducts(data || []);
    setLoading(false);
  }

  const addToCart = (prod: any) => {
    const existing = cart.find(i => i.id === prod.id);
    if (existing) {
      if (existing.quantity >= prod.stock) return showToast('error', 'Limite de estoque atingido.');
      setCart(cart.map(i => i.id === prod.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...prod, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => setCart(cart.filter(i => i.id !== id));
  
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  async function handleFinishSale() {
    if (cart.length === 0) return showToast('error', 'Carrinho vazio.');
    setIsFinishing(true);

    try {
      let customerId = null;

      // 1. Lógica de vínculo: Se tiver e-mail, tenta achar no sistema
      if (customer.name) {
        const { data: posCust } = await supabase.from("pos_customers").insert([{
          name: customer.name, email: customer.email, phone: customer.phone
        }]).select().single();
        customerId = posCust?.id;
      }

      // 2. Registrar a Venda
      const { data: order, error: orderError } = await supabase.from("orders").insert([{
        total_amount: total,
        status: 'delivered',
        origin: 'balcao',
        payment_method: paymentMethod,
        pos_customer_id: customerId
      }]).select().single();

      if (orderError) throw orderError;

      // 3. Baixa Automática de Estoque
      for (const item of cart) {
        await supabase.rpc('decrement_inventory', { 
          product_id: item.id, 
          qty: item.quantity 
        });
      }

      showToast('success', 'Venda realizada e estoque atualizado!');
      setCart([]);
      setCustomer({ name: "", email: "", phone: "" });
      fetchProducts();
    } catch (err) {
      showToast('error', 'Erro ao processar venda.');
    } finally {
      setIsFinishing(false);
    }
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="grid md:grid-cols-12 gap-6 animate-in fade-in">
      {/* LADO ESQUERDO: BUSCA E PRODUTOS */}
      <div className="md:col-span-7 space-y-4">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
            <input 
              placeholder="Buscar produto por nome..." 
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 outline-none focus:border-zinc-900 bg-white text-zinc-900"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredProducts.map(prod => (
              <button 
                key={prod.id} 
                onClick={() => addToCart(prod)}
                className="flex flex-col p-4 border border-zinc-100 rounded-xl hover:border-zinc-900 hover:bg-zinc-50 transition-all text-left group"
              >
                <span className="text-[10px] font-bold text-zinc-400 uppercase">{prod.category}</span>
                <span className="font-bold text-zinc-900 text-sm truncate w-full">{prod.name}</span>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-zinc-900 font-bold">R$ {prod.price.toFixed(2)}</span>
                  <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-500">{prod.stock} un</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LADO DIREITO: CARRINHO E CLIENTE */}
      <div className="md:col-span-5 space-y-4">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2 border-b pb-3">
            <ShoppingCart className="w-5 h-5" /> Carrinho de Balcão
          </h3>
          
          <div className="space-y-3 mb-6 min-h-[100px]">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm bg-zinc-50 p-2 rounded-lg">
                <div className="flex-1">
                  <p className="font-bold text-zinc-900">{item.name}</p>
                  <p className="text-xs text-zinc-500">{item.quantity}x R$ {item.price.toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t pt-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-400">Cliente (Opcional)</label>
              <input 
                placeholder="Nome Completo" 
                className="w-full p-2 border border-zinc-200 rounded-lg mt-1 text-sm bg-white text-zinc-900"
                value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}
              />
              <input 
                placeholder="E-mail para vínculo VIP" 
                className="w-full p-2 border border-zinc-200 rounded-lg mt-2 text-sm bg-white text-zinc-900"
                value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pix', icon: QrCode, label: 'PIX' },
                { id: 'money', icon: Banknote, label: 'DIN' },
                { id: 'card', icon: CreditCard, label: 'CART' },
              ].map(m => (
                <button 
                  key={m.id} 
                  onClick={() => setPaymentMethod(m.id)}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all ${paymentMethod === m.id ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 text-zinc-500'}`}
                >
                  <m.icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center py-4 border-y">
              <span className="text-lg font-bold text-zinc-900">Total</span>
              <span className="text-2xl font-black text-zinc-900">R$ {total.toFixed(2)}</span>
            </div>

            <button 
              disabled={isFinishing || cart.length === 0}
              onClick={handleFinishSale}
              className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors flex justify-center items-center gap-2"
            >
              {isFinishing ? <Loader2 className="animate-spin" /> : "FINALIZAR VENDA FISÍCA"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}