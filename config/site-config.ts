export const siteConfig = {
  name: "GoGreen Headshop",
  description: "Cultura Urbana, Tabacaria e Redução de Danos. Os melhores kits com entrega rápida em Fortaleza.",
  url: "https://gogreen-headshop.vercel.app", 
  ogImage: "/og-image.png",
  
  // Links Sociais e Contato
  links: {
    instagram: "https://instagram.com/Gogreenheadshop",
    whatsapp: "https://wa.me/5585996699921",
  },
  
  contact: {
    phone: "85 99669-9921",
    whatsappNumber: "5585996699921",
    address: "Fortaleza, Ceará",
    pixKey: "85996699921", 
  },

  // Configurações do Negócio
  business: {
    minAge: 18,
    deliveryArea: "Fortaleza e Região Metropolitana",
    openHours: "Todos os dias, das 10h às 00h",
    minOrderValue: 20, 
    freeShippingThreshold: 100, 
  },

  // Gestão de Imagens e SVGs (Deixe "" para desativar a exibição)
  assets: {
    svgs: {
      hero: "/svg/hero-3d.svg",
      kit: "/svg/kit-box.svg",
      vitrine: "",
      loyalty: "/svg/coin.svg",
      faqLeft: "",
      faqRight: "",
    }
  },

  // Textos estáticos do layout para facilitar manutenção
  ui: {
    altTexts: {
      heroSvg: "Hero 3D Elements",
      kitSvg: "Kit Box 3D",
      vitrineSvg: "Store 3D",
    }
  },

  // Configurações da Secção "Community Wall" (Instagram)
  // Configurações da Secção "Community Wall" (Instagram)
  community: {
    title: "Família",
    hashtag: "#GoGreen",
    subtitle: "A nossa vibe urbana. Junte-se à comunidade.",
    instagramHandle: "gogreenheadshop",
    profileImage: "https://ui-avatars.com/api/?name=GG&background=22c55e&color=000",
    defaultPostText: "Unboxing do dia: Kit Start. 📦🔥Aperte o play e sinta o peso desse kit. O essencial para quem não abre mão de estilo e eficiência na hora de bolar.",
    posts: [
      { 
        type: 'reel', 
        link: "https://www.instagram.com/p/DUoun_xDwYj/",
        img: "/instafeed/kitfire.webp",
        likes: "1.2k",
        text: "O Kit Fire está de volta e o novo Clipper tá roubando a cena, o kit por apenas 20,00R$."
      },
      { 
        type: 'photo', 
        link: "https://www.instagram.com/p/DUYzWFXAcNy/?img_index=1",
        img: "/instafeed/kit.webp",  
        likes: "856",
        text: "Piteiras de vidros chegaram! 🔥 O upgrade que o seu kit estava pedindo acabou de pousar na Go Green."
      },
      { 
        type: 'reel', 
        link: "https://www.instagram.com/p/DT1UrfNj47H/",
        img: "/instafeed/kitstart.webp", // Coloque o nome exato da sua imagem webp 3
        likes: "2.4k",
        text: "A braba tá aqui! Chega mais pra conferir as novidades e salvar o seu kit perfeito pro rolê. 💨"
      },
    ]
  }
} 