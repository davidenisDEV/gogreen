"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Quanto tempo demora a entrega?",
    a: "As entregas são feitas via Uber Flash para toda a região de Fortaleza, chegando geralmente em até 30 minutos após a confirmação do pagamento e montagem do kit."
  },
  {
    q: "Quais são as formas de pagamento?",
    a: "Aceitamos PIX (com aprovação imediata) e cartões de crédito/débito. Tudo processado de forma segura."
  },
  {
    q: "A embalagem é discreta mesmo?",
    a: "Sim! Usamos caixas e envelopes pardos padrão. O motoca não sabe o que está a entregar e não há logos na parte externa."
  },
  {
    q: "Como funciona o Clube VIP?",
    a: "Ao criar a sua conta gratuitamente, todas as suas compras geram pontos. Esses pontos podem ser trocados por sedas, isqueiros ou descontos na aba de Recompensas do seu perfil."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-urban-black border-t border-zinc-900">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <span className="bg-zinc-900 text-green-neon border border-zinc-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-flex items-center gap-2">
            <MessageCircleQuestion className="w-4 h-4" /> Dúvidas Frequentes
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-white uppercase italic">
            Tudo o que precisa de saber.
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/50">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-zinc-800/50 transition-colors"
              >
                <span className="font-bold text-white text-lg">{faq.q}</span>
                <ChevronDown className={cn("w-5 h-5 text-green-neon transition-transform", openIndex === i && "rotate-180")} />
              </button>
              <div className={cn("px-6 overflow-hidden transition-all duration-300", openIndex === i ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0")}>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}