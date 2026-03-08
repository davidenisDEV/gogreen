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

  // Gestão de Imagens e SVGs
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

  // Textos estáticos do layout
  ui: {
    altTexts: {
      heroSvg: "Hero 3D Elements",
      kitSvg: "Kit Box 3D",
      vitrineSvg: "Store 3D",
    }
  },

  // Configurações da Secção "Community Wall"
  community: {
    title: "Família",
    hashtag: "#GoGreen",
    subtitle: "A nossa vibe urbana. Junte-se à comunidade.",
    instagramHandle: "gogreenheadshop",
    profileImage: "https://ui-avatars.com/api/?name=GG&background=22c55e&color=000",
    defaultPostText: "Unboxing do dia: Kit Start. 📦🔥 Aperte o play e sinta o peso desse kit.",
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
        img: "/instafeed/kitstart.webp",
        likes: "2.4k",
        text: "A braba tá aqui! Chega mais pra conferir as novidades e salvar o seu kit perfeito pro rolê. 💨"
      },
    ]
  },

  // Configurações da Secção de FAQ (Dúvidas Frequentes)
  faqs: [
    {
      question: "Quanto tempo demora a entrega?",
      answer: "As entregas são feitas via Uber Flash para toda a região de Fortaleza, chegando geralmente em até 30 minutos após a confirmação do pagamento e montagem do kit."
    },
    {
      question: "Quais são as formas de pagamento?",
      answer: "Aceitamos PIX (com aprovação imediata) e cartões de crédito/débito. Tudo processado de forma segura."
    },
    {
      question: "A embalagem é discreta mesmo?",
      answer: "Sim! Usamos caixas e envelopes pardos padrão. O motoca não sabe o que está a entregar e não há logos na parte externa."
    },
    {
      question: "Como funciona o Clube VIP?",
      answer: "Ao criar a sua conta gratuitamente, todas as suas compras geram pontos. Esses pontos podem ser trocados por sedas, isqueiros ou descontos na aba de Recompensas do seu perfil."
    }
  ],
  // Configurações de Playlists do Spotify
  playlists: [
    {
      title: "TRAP BRASILEIRO",
      src: "https://open.spotify.com/embed/playlist/25oQpGLAzIxqqLsOmspUks?utm_source=generator"
    },
    {
      title: "REGGAE ROOTS",
      src: "https://open.spotify.com/embed/playlist/0g8FqbcJwqvuaoXnEMHULV?utm_source=generator"
    }
  ]
};
