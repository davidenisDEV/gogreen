
# 🍁 GoGreen Headshop & SaaS

Uma plataforma híbrida de **E-commerce e Ponto de Venda (PDV)** moderna, estratégica e orientada à conversão. Criada para unir cultura urbana, redução de danos e alta tecnologia em um único ecossistema digital.

A GoGreen não é apenas um site. É uma operação comercial completa pensada para gerar autoridade, gerenciar clientes e escalar vendas físicas e online.

---

## 🚀 Sobre o Projeto

A **GoGreen** foi desenvolvida do zero como uma solução full-stack para resolver os gargalos de uma tabacaria moderna. O sistema atua em duas frentes:

1. **Vitrine para o Cliente:** Uma loja virtual rápida, com verificação de idade (Age Gate), montador de kits dinâmico, clube de fidelidade e checkout direto para o WhatsApp.
2. **Painel Admin (SaaS):** Um back-office seguro para o lojista gerenciar o estoque, atualizar pontos VIP dos clientes (CRM), faturar vendas de balcão (PDV) e acompanhar métricas em tempo real.

O projeto combina um design *Dark Mode* imersivo com uma arquitetura de software robusta, preparada para performance e escalabilidade.

## ⚙️ Funcionalidades e Arquitetura

A plataforma foi estruturada em microsserviços para garantir fluidez e escalabilidade:

- **Vitrine e Conversão:** Verificação de idade (Age Gate), montador interativo de kits, clube de vantagens e checkout otimizado direto para o WhatsApp.
- **Admin SaaS e PDV:** Frente de caixa digital para vendas físicas, CRM com gestão de pontos VIP, controle de inventário em tempo real e exportação de relatórios financeiros em formato `.CSV`.

---

## 🛠️ Stack de Tecnologias

Projeto desenvolvido com o ecossistema mais moderno e performático do mercado:

- **Framework:** Next.js 14 (App Router, Server Components)
- **Linguagens/Estilo:** TypeScript e Tailwind CSS (Dark Theme nativo)
- **Backend (BaaS):** Supabase (PostgreSQL relacional)
- **Segurança e Nuvem:** Autenticação Google OAuth, Row Level Security (RLS) e Supabase Storage para imagens.

---

## 🚀 Como Executar Localmente

Para rodar o projeto na sua máquina para testes ou desenvolvimento:

1. Clone o repositório para o seu computador.
2. Abra o terminal na pasta do projeto e rode o comando `npm install` para baixar as dependências.
3. Crie um arquivo chamado `.env.local` na raiz do projeto e insira as suas chaves do banco de dados (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Inicie o servidor local com o comando `npm run dev` e acesse no navegador.

## 💼 Para Quem é a GoGreen?

Ideal para:

- Startups sustentáveis  
- Negócios digitais  
- Empresas de tecnologia  
- Marcas que desejam reforçar posicionamento ecológico  
- Projetos que precisam validar uma ideia com uma landing profissional  

---

## 🧠 Diferenciais

✔ Design moderno e minimalista  
✔ Estrutura focada em conversão  
✔ Comunicação estratégica  
✔ Visual premium  
✔ Base preparada para expansão futura  

---

## 🌍 Visão

A GoGreen representa a união entre:

**Tecnologia + Sustentabilidade + Performance**

Um modelo de landing page adaptável para diferentes nichos, mantendo identidade forte e foco em resultado.

## 🗺️ Roadmap (Próximos Passos)

Como um ecossistema em evolução constante, as próximas atualizações previstas para a arquitetura da GoGreen incluem:

- [ ] **Integração de Gateway de Pagamento:** Webhooks com Mercado Pago/Stripe para aprovação automática e baixa instantânea de estoque.
- [ ] **WebSockets (Real-time):** Atualização do Kanban de pedidos no Painel Admin em tempo real via Supabase Subscriptions, sem necessidade de *refresh*.
- [ ] **Business Intelligence Avançado:** Implementação de bibliotecas de gráficos (como Recharts) para visualização de lucros, giro de estoque e retenção de clientes VIP.

---

## 📞 Contato & Links

Projeto projetado e desenvolvido por **David Denis** como demonstração de arquitetura Full-Stack, UI/UX orientada à conversão e integração de banco de dados em nuvem (SaaS).

- **Projeto ao Vivo:** [Acessar GoGreen](https://gogreen-4fmn.vercel.app/)
- **Meu Portfólio:** [Acessar Portfólio](https://master-wbcr.vercel.app/) 
- **LinkedIn:** [Conectar no LinkedIn](https://www.linkedin.com/in/daviddenisdev/) 

---

## 📝 Licença

Este é um projeto desenvolvido com foco em portfólio e demonstração técnica. Sinta-se à vontade para explorar o código, analisar a arquitetura ou utilizar a base para os seus próprios estudos de Next.js e Supabase.
