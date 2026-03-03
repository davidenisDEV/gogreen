"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Mail, Phone, Shield } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (data) setUsers(data);
    }
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display text-urban-black flex items-center gap-3">
        <Users className="text-green-forest" /> Base de Clientes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length === 0 ? (
             <p className="text-zinc-500">Nenhum usuário cadastrado via site ainda.</p>
        ) : users.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-urban-black rounded-full flex items-center justify-center text-green-neon font-display text-xl shrink-0">
              {user.full_name ? user.full_name[0] : "?"}
            </div>
            
            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold text-lg truncate">{user.full_name || "Usuário Sem Nome"}</h3>
              
              <div className="mt-3 space-y-2 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> 
                  <span className="uppercase text-xs font-bold bg-zinc-100 px-2 py-0.5 rounded">{user.role}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}