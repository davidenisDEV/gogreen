import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // CAMINHOS CORRIGIDOS PARA A RAIZ (SEM SRC)
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    
    // Se você tiver pastas soltas na raiz como 'data' ou 'context', adicione aqui também:
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", 
  theme: {
    extend: {
      colors: {
        green: {
          neon: "#39FF14",    
          forest: "#064e3b",  
          soft: "#f0fdf4",    
        },
        urban: {
          black: "#121212",   
          grey: "#f4f4f5",    
        }
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"], 
        display: ["var(--font-dela)", "cursive"],
      },
      borderRadius: {
        'street': '16px',
      }
    },
  },
  plugins: [],
};
export default config;