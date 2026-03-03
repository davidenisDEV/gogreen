"use client";
import { useState } from "react";
import { MapPin, Search } from "lucide-react";
const bairros = [ { name: "Aldeota", price: 10 }, { name: "Meireles", price: 10 }, { name: "Centro", price: 12 }, { name: "Papicu", price: 15 }, { name: "Messejana", price: 25 } ];

export function DeliveryCalc() {
  const [selected, setSelected] = useState("");
  const [price, setPrice] = useState<number | null>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bairroName = e.target.value;
    setSelected(bairroName);
    const bairro = bairros.find(b => b.name === bairroName);
    setPrice(bairro ? bairro.price : null);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[24px] shadow-sm">
      <div className="flex items-center gap-3 mb-4 text-green-neon">
        <MapPin className="w-6 h-6" /><h3 className="font-display text-xl text-white">Calculadora de Flash ⚡</h3>
      </div>
      <p className="text-zinc-400 text-sm mb-4">Selecione seu bairro para ver uma estimativa da entrega.</p>
      <div className="relative">
        <select value={selected} onChange={handleSelect} className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl appearance-none outline-none focus:border-green-neon font-bold cursor-pointer">
          <option value="">Selecione seu bairro...</option>
          {bairros.map(b => (<option key={b.name} value={b.name}>{b.name}</option>))}
        </select>
        <Search className="absolute right-4 top-3.5 w-5 h-5 text-green-neon/50 pointer-events-none" />
      </div>
      {price !== null && (
        <div className="mt-4 p-4 bg-green-neon/10 rounded-xl border border-green-neon/20 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-bold text-green-neon">Estimativa:</span><span className="font-display text-2xl text-green-neon">~R$ {price},00</span>
        </div>
      )}
    </div>
  );
}