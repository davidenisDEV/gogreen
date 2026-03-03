"use client";

import { TrendingUp, Users, Package, DollarSign, Download, Activity, PieChart, BarChart3 } from "lucide-react";

export function AdminDashboard({ metrics, salesData, inventoryData }: any) {
  
  // Função para exportar Inventário Completo em CSV
  const exportInventoryCSV = () => {
    const headers = ["Produto", "Categoria", "Estoque Atual", "Preço Venda", "Custo Unit.", "Valor total em Gôndola"];
    const rows = (inventoryData || []).map((p: any) => [
      p.name, 
      p.category, 
      p.stock, 
      `R$ ${Number(p.price).toFixed(2)}`, 
      `R$ ${Number(p.cost).toFixed(2)}`, 
      `R$ ${(Number(p.price) * Number(p.stock)).toFixed(2)}`
    ]);

    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Relatorio_Inventario_GoGreen_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Cards de Indicadores de Desempenho (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><DollarSign className="w-5 h-5 text-emerald-600" /></div>
            <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">Caixa Bruto</span>
          </div>
          <p className="text-sm text-zinc-500 font-medium">Faturamento Total</p>
          <p className="text-2xl font-bold text-zinc-900 mt-1">
            R$ {(metrics?.totalRevenue ?? 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
            <span className="text-[10px] font-black text-blue-600 tracking-widest uppercase">Comunidade</span>
          </div>
          <p className="text-sm text-zinc-500 font-medium">Membros VIP</p>
          <p className="text-2xl font-bold text-zinc-900 mt-1">{metrics?.totalMembers ?? 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex justify-between mb-4">
            <div className="p-2 bg-zinc-100 rounded-lg"><Activity className="w-5 h-5 text-zinc-600" /></div>
            <span className="text-[10px] font-black text-zinc-400 tracking-widest uppercase">Volume</span>
          </div>
          <p className="text-sm text-zinc-500 font-medium">Vendas Realizadas</p>
          <p className="text-2xl font-bold text-zinc-900 mt-1">{metrics?.salesCount ?? 0}</p>
        </div>

        <div className={`p-6 rounded-2xl border shadow-sm transition-colors ${metrics?.lowStockCount > 0 ? 'border-red-200 bg-red-50' : 'border-zinc-200 bg-white'}`}>
          <div className="flex justify-between mb-4">
            <div className="p-2 bg-white rounded-lg"><Package className="w-5 h-5 text-red-600" /></div>
            <span className="text-[10px] font-black text-red-600 tracking-widest uppercase">Estoque</span>
          </div>
          <p className="text-sm text-zinc-600 font-medium">Itens Críticos</p>
          <p className="text-2xl font-bold text-zinc-900 mt-1">{metrics?.lowStockCount ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 2. Gráfico de Circulação por Categoria (Barras) */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm md:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Distribuição de Vendas (Circulação)
            </h3>
            <button onClick={exportInventoryCSV} className="text-[10px] font-bold uppercase text-zinc-400 hover:text-zinc-900 flex items-center gap-1 border border-zinc-100 px-3 py-1.5 rounded-lg transition-colors bg-zinc-50">
               <Download className="w-3 h-3" /> Gerar Relatório de Gestão
            </button>
          </div>
          <div className="flex items-end gap-4 h-48 px-2">
            {(salesData || []).map((data: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[10px] px-2 py-1 rounded font-bold">
                   {data.count} itens
                </div>
                <div className="w-full bg-zinc-50 rounded-t-xl relative overflow-hidden h-full border-x border-t border-zinc-100">
                  <div className="absolute bottom-0 w-full bg-zinc-900 group-hover:bg-green-500 transition-all duration-700" style={{ height: `${data.percent}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase truncate w-full text-center">{data.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Saúde e Patrimônio (Donut) */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <PieChart className="w-4 h-4" /> Saúde Operacional
          </h3>
          <div className="relative w-36 h-36 mx-auto mb-8">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-zinc-100" strokeWidth="3" />
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-zinc-900" strokeWidth="3.5" strokeDasharray={`${metrics?.stockHealth ?? 0}, 100`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-zinc-900">{metrics?.stockHealth ?? 0}%</span>
              <span className="text-[9px] uppercase text-zinc-400 font-black">Em Dia</span>
            </div>
          </div>
          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1">Patrimônio em Gôndola</p>
            <p className="text-xl font-bold text-zinc-900">R$ {(metrics?.totalStockValue ?? 0).toFixed(2)}</p>
          </div>
        </div>

        {/* 4. Top Itens da Curadoria */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm md:col-span-3">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">Curadoria: Itens com maior Giro de Estoque</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {(metrics?.topProducts || []).map((prod: any, i: number) => (
              <div key={i} className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 relative overflow-hidden group hover:border-zinc-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                   <p className="font-bold text-zinc-900 text-sm">{prod.name}</p>
                   <span className="text-[10px] font-black text-zinc-400">{prod.stock} un</span>
                </div>
                <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-900 rounded-full group-hover:bg-green-500 transition-all duration-500" style={{ width: `${Math.min((prod.stock / 50) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}