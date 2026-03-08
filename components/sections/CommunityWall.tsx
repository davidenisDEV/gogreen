"use client";

import { Instagram, Play, Heart, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site-config"; 

export function CommunityWall() {
  const { title, hashtag, subtitle, instagramHandle, profileImage, defaultPostText, posts } = siteConfig.community;
  const instagramUrl = siteConfig.links.instagram;

  return (
    <section className="py-24 bg-[#080a09] text-white relative overflow-hidden">
      {/* LUZ DE FUNDO GLASMORPHISM */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-green-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div>
            <h2 className="font-display text-4xl md:text-5xl uppercase mb-3">
              {title} <span className="text-green-500 italic">{hashtag}</span>
            </h2>
            <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">
              {subtitle}
            </p>
          </div>
          <a 
            href={instagramUrl} 
            target="_blank" 
            rel="noreferrer"
            className="group flex items-center gap-3 bg-white/[0.05] border border-white/[0.1] backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-green-500 hover:text-black hover:border-green-500 transition-all duration-300 shadow-lg"
          >
            <Instagram className="w-5 h-5" /> Seguir @{instagramHandle}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <a 
              key={i} 
              href={post.link} 
              target="_blank" 
              rel="noreferrer"
              className="group relative flex flex-col bg-white/[0.02] border border-white/[0.05] rounded-[32px] overflow-hidden backdrop-blur-md transition-all duration-500 hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:-translate-y-2"
            >
              {/* CABEÇALHO ESTILO INSTAGRAM */}
              <div className="flex items-center justify-between p-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 p-0.5 border border-green-500 flex items-center justify-center overflow-hidden">
                    <img src={profileImage} alt={siteConfig.name} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="font-bold text-sm tracking-wide">{instagramHandle}</span>
                </div>
                <Instagram className="w-4 h-4 text-zinc-500 group-hover:text-green-500 transition-colors" />
              </div>

              {/* ÁREA DA IMAGEM */}
              <div className="relative aspect-square overflow-hidden bg-zinc-900">
                <img 
                  src={post.img} 
                  alt={`${siteConfig.name} Comunidade`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                />
                
                {/* Degradê que sobe no hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080a09]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {post.type === 'reel' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-green-500 group-hover:border-green-500 transition-all duration-500 shadow-2xl">
                      <Play className="w-6 h-6 text-white group-hover:text-black ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* RODAPÉ ESTILO INSTAGRAM */}
              <div className="p-5">
                <div className="flex items-center gap-4 mb-3">
                  <Heart className="w-6 h-6 text-white group-hover:text-red-500 group-hover:fill-red-500 transition-all duration-300" />
                  <MessageCircle className="w-6 h-6 text-white group-hover:text-green-500 transition-colors duration-300" />
                </div>
                <p className="text-sm font-bold mb-1">{post.likes} curtidas</p>
                <p className="text-sm text-zinc-400 line-clamp-2">
                  <span className="font-bold text-white mr-2">{instagramHandle}</span>
                  {/* LÓGICA DO TEXTO INDIVIDUAL AQUI: */}
                  {post.text || defaultPostText}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}