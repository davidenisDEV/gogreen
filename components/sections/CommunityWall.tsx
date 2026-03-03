import { Instagram, Play } from "lucide-react";

export function CommunityWall() {
  // Substitua os links pelas capas dos seus Reels reais depois
  const posts = [
    { type: 'reel', img: "https://www.instagram.com/p/DUEgjdnAbar/" },
    { type: 'photo', img: "https://www.instagram.com/p/DUYzWFXAcNy/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    { type: 'reel', img: "https://www.instagram.com/reel/DUoun_xDwYj/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==" },
  ];

  return (
    <section className="py-20 bg-urban-black text-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl uppercase italic mb-2">
              Família <span className="text-green-neon">#GoGreen</span>
            </h2>
            <p className="text-zinc-400 font-medium">Siga a nossa vibe urbana e fique de olho nos drops.</p>
          </div>
          <a 
            href="https://www.instagram.com/gogreenheadshop/" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold uppercase text-sm hover:scale-105 transition-transform"
          >
            <Instagram className="w-5 h-5" /> @gogreenheadshop
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {posts.map((post, i) => (
            <a 
              key={i} 
              href="https://www.instagram.com/gogreenheadshop/" 
              target="_blank" 
              rel="noreferrer"
              className="group relative aspect-[4/5] bg-zinc-900 rounded-3xl overflow-hidden block border border-zinc-800 hover:border-green-neon transition-colors"
            >
              <img src={post.img} alt="Comunidade GoGreen" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                {post.type === 'reel' && (
                  <div className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white ml-1" />
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}