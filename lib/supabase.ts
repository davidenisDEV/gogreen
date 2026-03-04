import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,      // Mantém o usuário/admin logado ao fechar a aba
    autoRefreshToken: true,    // Renova o token de segurança automaticamente
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'x-client-info': 'gogreen-web' 
    }
  }
});