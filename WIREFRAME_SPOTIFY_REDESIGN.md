# Wireframe: Redesign do Player de Música - Estilo Spotify

## 📱 Layout Atual vs. Layout Proposto

### **Layout Atual (PreviewCard.tsx)**

```
┌─────────────────────────────────┐
│  Header: Título + Menu         │
├─────────────────────────────────┤
│                                 │
│  [Imagem de Fundo]              │
│  (aspect-ratio 4/3)             │
│                                 │
│  Overlay: gradiente escuro      │
│                                 │
│  Player (parte inferior):       │
│  - Título e Artista (branco)    │
│  - Barra de progresso           │
│  - Controles (play, skip)       │
│                                 │
├─────────────────────────────────┤
│  Contador de Tempo              │
├─────────────────────────────────┤
│  Mensagem Especial              │
├─────────────────────────────────┤
│  Galeria de Fotos               │
└─────────────────────────────────┘
```

### **Layout Proposto (Estilo Spotify - Inspirado nas Imagens)**

```
┌─────────────────────────────────┐
│  Header: ← | Título ❤️ | ⋮     │
│  (Fundo escuro/azul)            │
├─────────────────────────────────┤
│                                 │
│  [IMAGEM GRANDE DE FUNDO]       │
│  (aspect-ratio ~16/9 ou maior)  │
│  - Blur/desfoque aplicado        │
│  - Overlay escuro sutil         │
│                                 │
│  [Conteúdo sobreposto]           │
│                                 │
│  ┌─────────────────────────┐    │
│  │  TÍTULO DA MÚSICA       │    │
│  │  (Grande, branco, bold) │    │
│  │                         │    │
│  │  Artista                │    │
│  │  (Menor, branco, light) │    │
│  │                         │    │
│  │  ✓ (checkmark)          │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │  [━━━━━━━━━━━━━━━━━━━━] │    │
│  │  0:00          -3:46    │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │  [⏮] [▶] [⏭]           │    │
│  │      (botão play grande)│    │
│  └─────────────────────────┘    │
│                                 │
├─────────────────────────────────┤
│  Sobre o casal                  │
│  [Foto do casal]                │
│  Nome e Nome                    │
│  Juntos desde 2022              │
│                                 │
│  [Grid de Estatísticas]          │
│  ┌─────┬─────┬─────┐           │
│  │ 2   │ 11  │ 16  │           │
│  │Anos │Meses│Dias │           │
│  ├─────┼─────┼─────┤           │
│  │ 18  │ 44  │ 46  │           │
│  │Horas│Min  │Seg  │           │
│  └─────┴─────┴─────┘           │
└─────────────────────────────────┘
```

---

## 🎨 Mudanças Principais

### **1. Header**
- **Atual**: Fundo branco/transparente, texto rosa
- **Proposto**: 
  - Fundo escuro (azul escuro #1e1e2e ou preto #000000)
  - Texto branco
  - Botão voltar (←) à esquerda
  - Título centralizado com coração
  - Menu (⋮) à direita

### **2. Área do Player de Música**

#### **2.1 Imagem de Fundo**
- **Atual**: aspect-ratio 4/3, overlay gradiente
- **Proposto**:
  - Imagem maior (aspect-ratio ~16/9 ou full height)
  - Blur/desfoque aplicado na imagem (backdrop-filter: blur)
  - Overlay escuro mais sutil (rgba(0,0,0,0.4) ou similar)
  - Imagem ocupa ~60-70% da altura da tela

#### **2.2 Informações da Música**
- **Atual**: Título e artista pequenos, sobrepostos no overlay
- **Proposto**:
  - Título grande (text-3xl ou text-4xl), branco, bold
  - Artista menor (text-lg), branco, opacity 0.9
  - Checkmark (✓) ao lado do título (indicando selecionado)
  - Posicionado no topo da área do player (não no bottom)

#### **2.3 Barra de Progresso**
- **Atual**: Barra simples
- **Proposto**:
  - Barra mais fina e elegante
  - Tempo atual à esquerda (0:00)
  - Tempo restante à direita (-3:46) com sinal negativo
  - Cor branca/cinza claro
  - Indicador circular no ponto atual

#### **2.4 Controles de Música**
- **Atual**: Botões pequenos
- **Proposto**:
  - Botão play central grande (círculo branco com triângulo rosa/roxo)
  - Botões skip (⏮ ⏭) menores nas laterais
  - Espaçamento adequado entre botões
  - Efeito hover/active
  - Opcional: shuffle e repeat nas extremidades

### **3. Seção "Sobre o Casal"**

#### **3.1 Layout**
- **Atual**: Cards separados
- **Proposto**:
  - Seção com fundo escuro/cinza escuro
  - Título "Sobre o casal" em branco
  - Foto do casal em formato retangular
  - Nomes grandes abaixo da foto
  - Data "Juntos desde XXXX"

#### **3.2 Estatísticas de Tempo**
- **Atual**: Contador único
- **Proposto**:
  - Grid 3x2 com cards arredondados
  - Cada card mostra: valor + unidade (ex: "2 Anos")
  - Cores alternadas (rosa e roxo claro)
  - Texto escuro/escuro para contraste
  - Cards com sombra sutil

### **4. Mensagem Especial**
- **Atual**: Card com gradiente
- **Proposto**:
  - Manter estilo atual ou ajustar para combinar com o novo design
  - Fundo azul (#1DB954 - verde Spotify ou rosa/roxo do app)
  - Botão branco para expandir/colapsar

---

## 🔧 Implementação Técnica

### **Estrutura HTML Proposta**

```tsx
<div className="bg-gray-900 min-h-screen">
  {/* Header */}
  <header className="bg-gray-900 px-4 py-3 flex items-center">
    <button>←</button>
    <h1 className="flex-1 text-center text-white">Título ❤️</h1>
    <button>⋮</button>
  </header>

  {/* Player Section */}
  <div className="relative">
    {/* Background Image with Blur */}
    <div className="relative h-[60vh] overflow-hidden">
      <img 
        src={musicCoverPhotoUrl} 
        className="w-full h-full object-cover blur-md scale-110"
      />
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
        {/* Top: Song Info */}
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-bold">Título da Música</h2>
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <span className="text-green-500">✓</span>
            </div>
          </div>
          <p className="text-xl mt-2 opacity-90">Artista</p>
        </div>

        {/* Bottom: Player Controls */}
        <div className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>0:00</span>
              <span>-3:46</span>
            </div>
            <div className="h-1 bg-white/30 rounded-full">
              <div className="h-1 bg-white rounded-full" style={{ width: '0%' }} />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <button>⏮</button>
            <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-pink-600" />
            </button>
            <button>⏭</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* About Section */}
  <div className="bg-gray-800 px-6 py-8">
    <h3 className="text-white text-xl font-bold mb-4">Sobre o casal</h3>
    <img src={couplePhoto} className="w-full h-48 object-cover rounded-lg mb-4" />
    <h4 className="text-white text-2xl font-bold">Nome e Nome</h4>
    <p className="text-gray-400">Juntos desde 2022</p>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-3 gap-3 mt-6">
      {stats.map(stat => (
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.unit}</div>
        </div>
      ))}
    </div>
  </div>
</div>
```

### **Classes Tailwind Principais**

```css
/* Header */
bg-gray-900 (ou bg-black)
text-white

/* Background Image */
blur-md (backdrop-filter)
scale-110 (para efeito zoom)
bg-black/40 (overlay)

/* Player Controls */
bg-white rounded-full (botão play)
text-pink-600 (cor do ícone play)

/* Stats Grid */
bg-gray-700 (cards)
rounded-lg
```

---

## 📋 Checklist de Implementação

- [ ] Atualizar header para fundo escuro
- [ ] Aumentar tamanho da imagem de fundo
- [ ] Aplicar blur na imagem de fundo
- [ ] Reposicionar título e artista no topo
- [ ] Adicionar checkmark ao lado do título
- [ ] Redesenhar barra de progresso (tempo atual/restante)
- [ ] Criar botão play grande e centralizado
- [ ] Ajustar botões skip
- [ ] Criar seção "Sobre o casal" com fundo escuro
- [ ] Implementar grid de estatísticas 3x2
- [ ] Ajustar cores e espaçamentos
- [ ] Testar responsividade mobile
- [ ] Aplicar animações suaves

---

## 🎯 Prioridades

1. **Alta**: Header escuro, imagem com blur, player controls
2. **Média**: Seção "Sobre o casal", grid de estatísticas
3. **Baixa**: Animações, efeitos extras

---

## 💡 Notas de Design

- **Cores**: Manter paleta rosa/roxo do app, mas usar mais preto/cinza escuro para contraste
- **Tipografia**: Títulos grandes e bold, textos secundários menores
- **Espaçamento**: Mais respiração entre elementos
- **Imagens**: Blur sutil mas visível, manter qualidade
- **Interatividade**: Hover states, transições suaves

