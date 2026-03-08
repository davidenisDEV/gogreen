"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site-config"; 

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Puxa as perguntas direto do seu arquivo de configuração
  const faqs = siteConfig.faqs;

  return (
    <section className="py-24 bg-[#080a09] relative overflow-hidden border-t border-white/[0.05]">
      {/* Efeito de Luzes / Glasmorphism background */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-green-500/5 blur-[150px] rounded-full animate-breath pointer-events-none"></div>
      
      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <div className="text-center mb-16">
          <span className="bg-white/[0.05] text-green-500 border border-green-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-flex items-center gap-2 backdrop-blur-md">
            <MessageCircleQuestion className="w-4 h-4" /> Dúvidas Frequentes
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white uppercase">
            Tudo o que precisa de saber.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={cn(
                "border rounded-[24px] overflow-hidden transition-all duration-500 backdrop-blur-md",
                openIndex === i 
                  ? "bg-white/[0.04] border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.05)]" 
                  : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]"
              )}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left outline-none"
              >
                <span className="font-bold text-white text-lg pr-4">{faq.question}</span>
                <div className={cn(
                  "p-2 rounded-full transition-colors duration-300", 
                  openIndex === i ? "bg-green-500/10" : "bg-white/[0.05]"
                )}>
                  <ChevronDown className={cn("w-5 h-5 transition-transform duration-500", openIndex === i ? "rotate-180 text-green-500" : "text-zinc-400")} />
                </div>
              </button>
              
              {/* Animação suave de revelar texto */}
              <div 
                className={cn(
                  "px-6 overflow-hidden transition-all duration-500 ease-in-out", 
                  openIndex === i ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <p className={cn(
                  "text-zinc-400 text-sm md:text-base leading-relaxed transition-all duration-500 delay-100",
                  openIndex === i ? "translate-y-0" : "translate-y-4"
                )}>
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}