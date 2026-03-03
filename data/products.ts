import { supabase } from "@/lib/supabase";

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost?: number; 
  category: string;
  image: string;
  isNew?: boolean;
  stock?: number;
};

// CATEGORIAS ATUALIZADAS
export const categories = [
  { id: "kits", name: "Kits Salva-Rolê", icon: "📦" },
  { id: "papelaria", name: "Papelaria", icon: "📜" },
  { id: "fogo", name: "Fogo", icon: "🔥" },
  { id: "fumos", name: "Fumos & Tabacos", icon: "🌿" },
  { id: "vidros", name: "Vidros & Bongs", icon: "🔮" },
  { id: "ferramentas", name: "Ferramentas", icon: "✂️" },
  { id: "armazenamento", name: "Armazenamento", icon: "🏺" },
  { id: "vaporizadores", name: "Vaporizadores", icon: "💨" },
  { id: "lifestyle", name: "Lifestyle", icon: "🧢" },
];

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  
  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }

  return data.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    cost: p.cost,
    category: p.category, 
    image: p.image_url || '/products/placeholder.png', 
    stock: p.stock,
    isNew: p.is_new || false
  })) as Product[];
}

export const products: Product[] = [];