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
  { id: "kits", name: "Kits Salva-Role", icon: "📦", desc: "Kits completos" },
  { id: "sedas", name: "Papelaria", icon: "📜", desc: "Sedas e Piteiras" },
  { id: "fogo", name: "Fogo", icon: "🔥", desc: "Isqueiros e Maçaricos" },
  { id: "fumos", name: "Fumos & Tabacos", icon: "🌿", desc: "Kumbaya e Tabacos" },
  { id: "vidros", name: "Vidros & Bongs", icon: "💨", desc: "Bongs e Pipes" },
  { id: "ferramentas", name: "Ferramentas", icon: "✂️", desc: "Tesouras e Dichavadores" },
  { id: "acessorios", name: "Lifestyle", icon: "🧢", desc: "Bonés e Adesivos" },
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