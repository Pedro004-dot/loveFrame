# PRD - LoveFrame
**Micro SaaS de Retrospectiva de Relacionamento**

---

## 📋 **1. Visão Geral do Produto**

### **Objetivo**
Criar uma plataforma digital que permite casais criarem retrospectivas personalizadas de seus relacionamentos no estilo "Spotify Wrapped", oferecendo uma experiência emocional e compartilhável.

### **Problema que Resolve**
- Casais querem maneiras criativas de celebrar marcos de relacionamento
- Falta de ferramentas digitais para criar presentes personalizados e memoráveis
- Demanda crescente por experiências digitais no formato "wrapped" para final de ano

### **Público-Alvo**
- **Primário:** Casais jovens (18-35 anos) que querem presentear o parceiro
- **Secundário:** Pessoas em relacionamentos de longa distância
- **Terciário:** Casais comemorando aniversários/datas especiais

---

## 🎯 **2. Funcionalidades Principais**

### **2.1 MVP - Versão Mínima Viável**

#### **Onboarding Flow (Hook para Conversão)**
1. **5 Etapas Emocionais:**
   - Step 1: "Para começar a criar este presente especial, me conta... quem é você? 💕"
   - Step 2: "Que lindo! Agora me conta, [Nome], há quanto tempo vocês estão juntos? ⏰"
   - Step 3: "Perfeito! Agora, que nome vamos dar para esse presente lindo? 🎁"
   - Step 4: "Toda história de amor tem uma trilha sonora... qual música representa vocês? 🎵"
   - Step 5: "Agora vamos adicionar a foto que captura a essência de vocês como casal 📸"

2. **Layout Split com Preview:**
   - Formulário à esquerda com etapas sequenciais
   - Preview ao vivo à direita que atualiza em tempo real
   - Timer de relacionamento calculado automaticamente

#### **Fase Premium - Stories do Wrapped (6 Stories)**
**Story 1 - Abertura:**
- Foto do casal + contador de tempo juntos
- Música de fundo

**Story 2 - Horas Juntos:**
- Estatística visual: "Vocês passaram X dias criando memórias"
- Animação de contagem

**Story 3 - Galeria Principal:**
- Upload de 6 fotos especiais
- Transições suaves entre imagens

**Story 4 - Top 3 Músicas:**
- Seleção de 3 músicas do relacionamento
- Preview player para cada música

**Story 5 - Mini-Game:**
- Quiz "Quanto vocês se conhecem?"
- 5 perguntas personalizáveis
- Score final

**Story 6 - Finalização:**
- Mensagem especial
- QR Code para compartilhamento
- Link permanente

### **2.2 Opções de Stories para Escolha**
O usuário poderá escolher entre diferentes tipos de stories:

**Categoria "Memórias":**
- Linha do Tempo (marcos importantes)
- Galeria de Fotos (6 fotos temáticas)
- Primeiro Encontro (história detalhada)

**Categoria "Estatísticas":**
- Horas Juntos
- Lugares Visitados
- Conquistas do Relacionamento

**Categoria "Diversão":**
- Mini-Games do Casal
- Quiz de Personalidades
- "Quem é mais..." (comparações fofas)

**Categoria "Futuro":**
- Planos para Próximo Ano
- Bucket List do Casal
- Promessas/Metas Juntos

---

## 🔄 **3. Fluxo do Usuário**

### **3.1 Estrutura de Páginas**

**1. Landing Page** (`/`)
- Homepage atual com CTA para onboarding

**2. Onboarding Page** (`/create`)
- Layout split: Formulário (esquerda) + Preview ao vivo (direita)
- 5 etapas sequenciais com progressão emocional
- Preview atualiza em tempo real conforme usuário preenche

**3. Checkout Page** (`/checkout`) 
- Fluxo de pagamento após completar onboarding
- Mostra preview do que será desbloqueado

**4. Story Builder** (`/stories`)
- Seleção e configuração de stories pós-pagamento
- Templates de stories estilo Instagram para escolher

**5. Story Viewer** (`/view/[id]`)
- Experiência final de visualização da retrospectiva

### **3.2 Jornada Detalhada**

```
1. Landing Page (/)
   ↓ [CTA Button Click]
2. Onboarding Page (/create)
   ├─ Step 1: "Quem é você?" (Nome)
   ├─ Step 2: "Há quanto tempo juntos?" (Data início)
   ├─ Step 3: "Nome do presente?" (Título personalizado)
   ├─ Step 4: "Qual sua música?" (Seleção musical)
   ├─ Step 5: "Foto do casal?" (Upload imagem)
   ↓ [Completed Onboarding]
3. Checkout Page (/checkout)
   - Preview do que será criado
   - Pagamento R$ 27,90
   ↓ [Payment Success]
4. Story Builder (/stories)
   - Seleção de 6 stories entre categorias
   - Configuração de cada story escolhida
   ↓ [Stories Completed]
5. Story Viewer (/view/[unique-id])
   - Retrospectiva final em formato stories
   - Link permanente para compartilhamento
```

### **3.3 Fluxo de Visualização (Destinatário)**

```
1. Acesso via Link/QR Code
   ↓
2. Carregamento com música de fundo
   ↓
3. Stories sequenciais (formato Instagram)
   - Tap para avançar
   - Hold para pausar
   ↓
4. Finalização com opção de "Criar o Meu"
```

---

## 💰 **4. Modelo de Monetização**

### **4.1 Pricing**

**Gratuito:**
- Setup básico apenas
- Preview limitado
- 3 dias de acesso ao link

**Premium - R$ 27,90:**
- Wrapped completo (6 stories)
- Link permanente
- QR Code personalizado
- Download em alta qualidade

**Deluxe - R$ 19,90 (Futuro):**
- Todas funcionalidades Premium
- PDF para impressão
- Stories ilimitadas
- Customização visual avançada

### **4.2 Estratégia de Lançamento**
- **Black Friday:** Promoção R$ 4,90 (50% off)
- **Dezembro:** Preço normal para demanda de final de ano
- **Dia dos Namorados:** Campanhas específicas

---

## 🛠 **5. Requisitos Técnicos**

### **5.1 Stack Tecnológica Sugerida**

**Frontend:**
- Next.js 14 (React)
- Tailwind CSS
- Framer Motion (animações)
- React Hook Form

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Supabase)

**Storage:**
- Cloudinary (imagens/música)
- Vercel (deploy)

**Pagamento:**
- Stripe/Mercado Pago

**Audio:**
- YouTube Data API v3 (música completa em background)
- Web Audio API (controles customizados)

### **5.2 Funcionalidades Técnicas Principais**

1. **Upload e Processamento de Mídia**
   - Otimização automática de imagens
   - Suporte a MP3/streaming de áudio
   - Preview em tempo real

2. **Geração Dinâmica de Conteúdo**
   - Stories renderizadas dinamicamente
   - Links únicos por retrospectiva
   - QR Code generation

3. **Sistema de Pagamento**
   - Integração com gateway de pagamento
   - Gestão de assinaturas
   - Controle de acesso por link

---

## 📊 **6. Métricas de Sucesso**

### **6.1 KPIs Principais**
- **Taxa de Conversão:** Setup Gratuito → Premium (Meta: 15%)
- **NPS:** Satisfação do usuário (Meta: 70+)
- **Tempo na Página:** Engajamento durante criação (Meta: 8+ min)
- **Compartilhamentos:** Links compartilhados por retrospectiva (Meta: 3+)

### **6.2 Metas de Negócio (3 meses)**
- **Usuários Cadastrados:** 1.000
- **Conversões Premium:** 150 (15%)
- **MRR:** R$ 1.500
- **Viral Coefficient:** 1.2 (cada usuário traz 1.2 novos)

---

## 🚀 **7. Roadmap de Desenvolvimento**

### **✅ Sprint 1 (Semana 1-2): MVP Core - CONCLUÍDO**
- ✅ Setup do projeto Next.js
- ✅ Landing page + formulário básico  
- ✅ Upload de imagens
- ✅ Preview em tempo real
- ✅ Integração YouTube Data API
- ✅ Player de música em background
- ✅ 5 etapas de onboarding funcionais

### **✅ Sprint 2 (Semana 3-4): Stories & Payment - PARCIALMENTE CONCLUÍDO**
- ✅ Sistema de stories (estrutura básica)
- ✅ Integração de pagamento (mock)
- ✅ Geração de links únicos
- ❌ **UX de Stories precisa ser redesenhada** (identificado problema)

### **🔄 Sprint 2.5 (Pendente): Melhoria UX Stories - PRIORIDADE ALTA**
- **Problema identificado:** Interface de seleção de stories está confusa
- **Solução proposta:** 
  - Configuração individual por story (um por vez)
  - Modal/popup para configuração de cada story
  - Componente específico para cada tipo de story
  - Preview em tempo real durante configuração
  - Fluxo mais linear e intuitivo

### **Sprint 3 (Semana 5-6): Polish & Launch**
- Animações e transições
- Testes de performance
- Deploy e lançamento beta

### **Sprint 4 (Semana 7-8): Growth Features**
- Analytics
- A/B testing
- Campanhas de marketing

---

## 🔍 **8. Validação e Testes**

### **8.1 Hipóteses a Validar**
1. Casais estão dispostos a pagar R$ 9,90 por retrospectiva digital
2. Formato de stories é mais engajador que página única
3. Música de fundo aumenta tempo de permanência
4. Preview em tempo real melhora taxa de conversão

### **8.2 Testes Planejados**
- **MVP Testing:** 50 casais beta testers
- **A/B Testing:** Diferentes preços (R$ 7,90 vs R$ 9,90)
- **UX Testing:** Fluxo de criação vs visualização

---

**Status:** Aprovado para desenvolvimento
**Data:** Dezembro 2024
**Próximo Passo:** Iniciar desenvolvimento do MVP


senha db tiPpen-juzwi3-rymcyt