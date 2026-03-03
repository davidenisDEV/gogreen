"use client";

import { useState } from "react";
import { MessageSquare, X, ShoppingBag, HelpCircle } from "lucide-react";
import { siteConfig } from "@/config/site-config";
import { cn } from "@/lib/utils";

export function WhatsAppBtn() {
  const [isOpen, setIsOpen] = useState(false);

  const openWhatsApp = (msg: string) => {
    // Usa o número configurado no site-config.ts
    const url = `https://wa.me/${siteConfig.business.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[40] flex flex-col items-end font-sans">
      
      {/* Menu Rápido */}
      {isOpen && (
        <div className="mb-4 w-64 bg-white rounded-xl shadow-xl border border-green-100 overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-green-forest p-3 text-white font-display text-sm uppercase tracking-wider text-center">
            Atendimento GoGreen
          </div>
          
          <div className="p-2 flex flex-col gap-1">
            <button 
              onClick={() => openWhatsApp("Salve! Quero tirar dúvidas sobre os Kits.")}
              className="flex items-center gap-3 w-full p-3 text-sm text-zinc-600 hover:bg-green-soft hover:text-green-forest transition-colors text-left rounded-lg font-bold"
            >
              <ShoppingBag className="w-4 h-4 text-green-neon" /> Comprar Kits
            </button>
            <button 
              onClick={() => openWhatsApp("Tenho uma dúvida sobre entrega/retirada.")}
              className="flex items-center gap-3 w-full p-3 text-sm text-zinc-600 hover:bg-green-soft hover:text-green-forest transition-colors text-left rounded-lg font-bold"
            >
              <HelpCircle className="w-4 h-4 text-green-neon" /> Dúvidas / Entrega
            </button>
          </div>
        </div>
      )}

      {/* Botão Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(57,255,20,0.3)] transition-all duration-300 hover:scale-110 border-2 border-white",
          isOpen ? "bg-white text-green-forest" : "bg-green-neon text-urban-black"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  );
}