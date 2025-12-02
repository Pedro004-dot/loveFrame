E# 🎨 Wireframe - Retrospectiva LoveFrame (Produto Final)

## 📱 Estrutura Completa - Landing Page Vertical (Scroll Down)

### **Paleta de Cores:**
- **Background Principal**: Dark Blue/Grey (#0F172A, #1E293B)
- **Cards**: Dark Grey (#1E293B, #334155)
- **Acentos**: Pink/Purple/Orange gradients
- **Texto**: Branco (#FFFFFF) e cinza claro (#E2E8F0)

---

## 🎯 SEÇÃO 1: Header com Navegação

```
┌─────────────────────────────────────┐
│ [←]  Juntos para sempre ❤️    [⋯] │  ← Header fixo (dark blue)
└─────────────────────────────────────┘
```

**Elementos:**
- Botão voltar (esquerda)
- Título centralizado: "Juntos para sempre ❤️" ou título personalizado
- Menu (3 pontos) direita

---

## 🎯 SEÇÃO 2: Hero Card - Foto do Casal + Player de Música

```
┌─────────────────────────────────────┐
│                                     │
│    [FOTO DO CASAL - Full Width]    │
│    (Beach sunset, romantic)        │
│                                     │
│    ┌─────────────────────────┐     │
│    │  Player Overlay         │     │
│    │  ┌───────────────────┐ │     │
│    │  │ Still Loving You   │ │     │
│    │  │ Scorpions      [✓] │ │     │
│    │  │ ────────────────   │ │     │
│    │  │ 0:00        -4:48  │ │     │
│    │  │ [◀] [⏸] [▶] [🔁]  │ │     │
│    │  └───────────────────┘ │     │
│    └─────────────────────────┘     │
│                                     │
└─────────────────────────────────────┘
```

**Características:**
- Foto do casal em full width (aspect ratio ~16:9)
- Player de música sobreposto na parte inferior
- Gradiente escuro sobre a foto para legibilidade
- Controles de música funcionais

---

## 🎯 SEÇÃO 3: Sobre o Casal

```
┌─────────────────────────────────────┐
│  Sobre o casal                       │
│  ─────────────────────────────────  │
│                                     │
│  [Foto do casal - Close up]        │
│                                     │
│  Leonardo e Yasmin                  │
│  Juntos desde 2022                  │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐           │
│  │ 3   │ │ 2   │ │ 21  │           │
│  │Anos │ │Meses│ │Dias │           │
│  └─────┘ └─────┘ └─────┘           │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐           │
│  │ 14  │ │ 32  │ │ 47  │           │
│  │Horas│ │Min. │ │Seg. │           │
│  └─────┘ └─────┘ └─────┘           │
└─────────────────────────────────────┘
```

**Elementos:**
- Título "Sobre o casal"
- Foto romântica do casal
- Nomes do casal em destaque
- "Juntos desde [ANO]"
- Grid 3x2 com estatísticas de tempo:
  - Primeira linha: Anos, Meses, Dias
  - Segunda linha: Horas, Minutos, Segundos

---

## 🎯 SEÇÃO 4: Mensagem Especial

```
┌─────────────────────────────────────┐
│  Mensagem especial                   │
│  ─────────────────────────────────  │
│                                     │
│  E pensar que tudo começou          │
│  do nada... ✨                      │
│                                     │
│  Olha só pra gente agora:            │
│  escrevendo nossa própria           │
│  história, que-                      │
│                                     │
│  [Mostrar Mensagem]                 │
└─────────────────────────────────────┘
```

**Características:**
- Background: Gradiente azul/roxo
- Texto branco
- Mensagem truncada com "..." 
- Botão "Mostrar Mensagem" para expandir
- Quando expandido, mostra mensagem completa

---

## 🎯 SEÇÃO 5: Conheça [Nomes do Casal]

```
┌─────────────────────────────────────┐
│  Conheça Leonardo e Yasmin          │
│  ─────────────────────────────────  │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │      │ │      │ │      │        │
│  │Foto 1│ │Foto 2│ │Foto 3│        │
│  │      │ │      │ │      │        │
│  │Dates │ │Random│ │Viagem│        │
│  └──────┘ └──────┘ └──────┘        │
│                                     │
│  [Scroll horizontal]                │
└─────────────────────────────────────┘
```

**Elementos:**
- Título "Conheça [Nome1] e [Nome2]"
- Galeria horizontal scrollável
- Cards com fotos e títulos:
  - "Nossos Dates"
  - "Fotos aleatórias"
  - "Primeira viagem"
  - (Mais fotos conforme configurado)

---

## 🎯 SEÇÃO 6: CTA - Seu Relacionamento Wrapped

```
┌─────────────────────────────────────┐
│                                     │
│  Seu Relacionamento Wrapped         │
│                                     │
│  Explore o seu tempo em casal      │
│                                     │
│  [Gráficos decorativos]             │
│  (Ribbons pink/red)                 │
│                                     │
│         [Vamos lá]                  │
│                                     │
└─────────────────────────────────────┘
```

**Características:**
- Background: Preto sólido
- Título grande e impactante
- Subtítulo descritivo
- Elementos gráficos decorativos (ribbons)
- Botão CTA "Vamos lá" (azul/verde)
- Ao clicar, inicia stories/wrapped

---

## 🎯 SEÇÃO 7: Footer/Compartilhamento (Opcional)

```
┌─────────────────────────────────────┐
│  [Compartilhar] [Download] [QR Code] │
│                                     │
│  Criar a minha retrospectiva        │
└─────────────────────────────────────┘
```

---

## 📐 Especificações Técnicas

### **Layout:**
- **Tipo**: Landing page vertical (scroll down)
- **Largura**: Full width mobile, max-width desktop
- **Espaçamento**: Padding consistente entre seções
- **Scroll**: Suave, com scroll snap opcional

### **Responsividade:**
- **Mobile**: Full width, cards empilhados
- **Desktop**: Max-width centralizado, cards maiores

### **Animações:**
- Fade-in ao scroll (scroll reveal)
- Hover effects nos cards
- Transições suaves entre seções

### **Interatividade:**
- Player de música funcional
- Galeria scrollável horizontal
- Botão "Mostrar Mensagem" expande/colapsa
- CTA "Vamos lá" inicia wrapped/stories

---

## 🎨 Inspiração Visual

**Baseado em:**
- Spotify Wrapped (formato de retrospectiva)
- LovePanda (estrutura e layout)
- Instagram Stories (visual moderno)

**Tom:**
- Emocional e romântico
- Premium e moderno
- Dark theme elegante
- Gradientes vibrantes

---

## ✅ Checklist de Implementação

- [ ] Header fixo com navegação
- [ ] Hero card com foto + player sobreposto
- [ ] Seção "Sobre o casal" com estatísticas
- [ ] Seção "Mensagem especial" expansível
- [ ] Galeria "Conheça o casal" horizontal
- [ ] CTA "Seu Relacionamento Wrapped"
- [ ] Footer com compartilhamento
- [ ] Responsividade mobile/desktop
- [ ] Animações e transições
- [ ] Integração com dados reais

