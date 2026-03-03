"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BookOpen, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type EduContent = {
  id: string;
  title: string;
  content: string;
  display_type: 'card' | 'dropdown';
  image_url: string;
};

export function Educational() {
  const [items, setItems] = useState<EduContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchContent() {
      try {
        const { data, error } = await supabase
          .from("educational_content")
          .select("*")
          .eq("is_active", true)
          .order("order_index", { ascending: true });
        
        if (error) throw error;
        if (isMounted && data) setItems(data);
      } catch (error) {
        console.error("Erro na Escolinha:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchContent();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-green-neon" /></div>;
  if (items.length === 0) return null; // Não mostra a secção se não houver conteúdo

  return (
    <section className="bg-zinc-900 rounded-[32px] p-8 md:p-10 border border-zinc-800 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-soft rounded-2xl">
          <BookOpen className="w-6 h-6 text-green-forest" />
        </div>
        <div>
          <h2 className="font-display text-2xl uppercase italic text-urban-black">Escolinha <span className="text-green-forest">GoGreen</span></h2>
          <p className="text-zinc-500 text-sm">Aprenda com os mestres da cultura urbana.</p>
        </div>
      </div>

      <div className="space-y-6">
        {items.map((item) => {
          // RENDERIZAÇÃO TIPO: CARD
          if (item.display_type === 'card') {
            return (
              <div key={item.id} className="bg-zinc-50 rounded-[24px] overflow-hidden border border-zinc-100 group flex flex-col md:flex-row">
                {item.image_url && (
                  <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <h3 className="font-display text-xl text-urban-black uppercase mb-3">{item.title}</h3>
                  <p className="text-zinc-600 leading-relaxed text-sm">{item.content}</p>
                </div>
              </div>
            );
          }

          // RENDERIZAÇÃO TIPO: DROPDOWN (ACCORDION)
          return (
            <div key={item.id} className="border border-zinc-800 rounded-2xl overflow-hidden transition-all bg-zinc-900">
              <button 
                onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-zinc-50 transition-colors"
              >
                <span className="font-display text-lg text-urban-black uppercase">{item.title}</span>
                <ChevronDown className={cn("w-5 h-5 text-green-forest transition-transform duration-300", openDropdownId === item.id && "rotate-180")} />
              </button>
              <div 
                className={cn("px-5 overflow-hidden transition-all duration-300", openDropdownId === item.id ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0")}
              >
                <div className="w-full h-px bg-zinc-100 mb-4"></div>
                <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">{item.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}