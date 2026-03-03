"use client";
import { Star, MessageCircle, CheckCircle2 } from "lucide-react";
const REVIEWS = [
  { id: 1, name: "João P.", text: "Mano, entrega bizarramente rápida! Salvou o rolê de sexta. Kit completasso.", verified: true },
  { id: 2, name: "Ana C.", text: "Primeira vez comprando e a experiência foi 10/10. O motoca chegou em 20 min.", verified: true },
  { id: 3, name: "Marcos T.", text: "Atendimento VIP no zap, me ajudaram a montar o kit perfeito.", verified: true }
];

export function SocialProof() {
  return (
    <section className="py-20 border-y border-zinc-900 bg-zinc-950/50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="bg-green-neon/10 text-green-neon border border-green-neon/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> A Voz da Galera
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-white uppercase italic leading-tight">Quem conhece, <span className="text-green-neon">recomenda.</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div key={review.id} className="bg-zinc-900 p-8 rounded-[32px] border border-zinc-800 hover:border-green-neon/50 hover:-translate-y-1 transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-green-neon text-green-neon" />))}
              </div>
              <p className="text-zinc-400 font-medium mb-6 italic leading-relaxed">"{review.text}"</p>
              <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                <span className="font-bold text-white text-sm uppercase">{review.name}</span>
                {review.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-green-neon font-bold uppercase tracking-wider bg-green-neon/10 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> Verificada</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}