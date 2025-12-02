export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-rose-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center items-center space-x-2">
              <span className="text-4xl">💕</span>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                LoveFrame
              </h1>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-4">
              <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                Crie a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Retrospectiva</span>
                <br />do Seu Relacionamento
              </h2>
              
              {/* Animated Taglines */}
              <div className="text-xl sm:text-2xl text-gray-600 space-y-2">
                <p className="opacity-90">Como o Spotify Wrapped, mas do seu amor 💝</p>
                <p className="opacity-80">Transforme memórias em presente digital</p>
                <p className="opacity-70">6 stories personalizadas da sua história</p>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="space-y-4">
              <a href="/create">
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                  ✨ Criar Nossa História de Amor
                </button>
              </a>
              <p className="text-sm text-gray-500">Comece grátis • 2 minutos para criar</p>
            </div>
            
            {/* Demo Video Placeholder */}
            <div className="mt-12">
              <div className="max-w-3xl mx-auto bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-xl p-6 text-center">
                  <span className="text-6xl mb-4 block">📱</span>
                  <p className="text-gray-600 text-lg">Preview da retrospectiva aparecerá aqui</p>
                  <p className="text-sm text-gray-500 mt-2">Stories interativas • Música de fundo • Personalizado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="flex justify-center items-center space-x-8 text-gray-600">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">1.500+</div>
                <div className="text-sm">Casais Apaixonados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">4.9⭐</div>
                <div className="text-sm">Avaliação Média</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-600">95%</div>
                <div className="text-sm">Recomendariam</div>
              </div>
            </div>
            
            {/* Testimonials */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl">
                <p className="text-gray-700 italic">"Meu namorado chorou de emoção quando viu nossa retrospectiva 🥺"</p>
                <p className="text-sm text-gray-500 mt-2">- Ana, 24 anos</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <p className="text-gray-700 italic">"Melhor presente digital que já ganhei! Muito mais especial que qualquer Spotify Wrapped"</p>
                <p className="text-sm text-gray-500 mt-2">- Carlos, 28 anos</p>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-purple-50 p-6 rounded-xl">
                <p className="text-gray-700 italic">"Criamos juntos e foi a experiência mais fofa do mundo 💕"</p>
                <p className="text-sm text-gray-500 mt-2">- Marina, 26 anos</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-xl text-gray-600">Crie sua retrospectiva em 4 passos simples</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">1</div>
              <h3 className="text-xl font-semibold">Conte Sua História</h3>
              <p className="text-gray-600">Nome do casal + data que se conheceram</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-rose-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">2</div>
              <h3 className="text-xl font-semibold">Personalize</h3>
              <p className="text-gray-600">Fotos, músicas e memórias especiais</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">3</div>
              <h3 className="text-xl font-semibold">Escolha 6 Stories</h3>
              <p className="text-gray-600">Entre +15 opções: jogos, estatísticas, momentos...</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">4</div>
              <h3 className="text-xl font-semibold">Compartilhe o Amor</h3>
              <p className="text-gray-600">Link único + QR Code para surpreender</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">O Que Torna Especial</h2>
            <p className="text-xl text-gray-600">Funcionalidades pensadas para o seu amor</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl text-center">
              <span className="text-4xl mb-4 block">📱</span>
              <h3 className="font-semibold text-gray-900">Stories Interativas</h3>
              <p className="text-sm text-gray-600 mt-2">Como Instagram Stories</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl text-center">
              <span className="text-4xl mb-4 block">🎵</span>
              <h3 className="font-semibold text-gray-900">Com Sua Música</h3>
              <p className="text-sm text-gray-600 mt-2">Trilha sonora personalizada</p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-purple-50 p-6 rounded-xl text-center">
              <span className="text-4xl mb-4 block">🎮</span>
              <h3 className="font-semibold text-gray-900">Mini-Games do Casal</h3>
              <p className="text-sm text-gray-600 mt-2">Diversão interativa</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl text-center">
              <span className="text-4xl mb-4 block">📸</span>
              <h3 className="font-semibold text-gray-900">Galeria de Fotos</h3>
              <p className="text-sm text-gray-600 mt-2">Seus momentos especiais</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-rose-50 p-6 rounded-xl text-center">
              <span className="text-4xl mb-4 block">📊</span>
              <h3 className="font-semibold text-gray-900">Estatísticas Fofas</h3>
              <p className="text-sm text-gray-600 mt-2">Dados do relacionamento</p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-xl text-center">
              <span className="text-4xl mb-4 block">💌</span>
              <h3 className="font-semibold text-gray-900">Mensagem Especial</h3>
              <p className="text-sm text-gray-600 mt-2">Palavras do coração</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl text-center">
              <span className="text-4xl mb-4 block">🔗</span>
              <h3 className="font-semibold text-gray-900">Link Permanente</h3>
              <p className="text-sm text-gray-600 mt-2">Nunca expira</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl text-center">
              <span className="text-4xl mb-4 block">📱</span>
              <h3 className="font-semibold text-gray-900">100% Mobile</h3>
              <p className="text-sm text-gray-600 mt-2">Otimizado para celular</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Preços Especiais de Lançamento</h2>
            <p className="text-xl text-gray-600">Oferta limitada para os primeiros casais</p>
          </div>
          
          <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
            
            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-8 shadow-xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">🔥 MAIS POPULAR</span>
              </div>
              <div className="text-center space-y-4 text-white">
                <h3 className="text-2xl font-bold">Retrospectiva Completa</h3>
                <div className="space-y-2">
                  <div className="text-lg line-through opacity-75">R$ 49,90</div>
                  <div className="text-4xl font-bold">R$ 27,90</div>
                  <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold inline-block">43% OFF - Natal</div>
                </div>
                
                <ul className="space-y-3 text-left">
                  <li className="flex items-center"><span className="text-yellow-400 mr-2">✓</span>6 stories personalizadas</li>
                  <li className="flex items-center"><span className="text-yellow-400 mr-2">✓</span>Link permanente</li>
                  <li className="flex items-center"><span className="text-yellow-400 mr-2">✓</span>Música de fundo</li>
                  <li className="flex items-center"><span className="text-yellow-400 mr-2">✓</span>QR Code personalizado</li>
                  <li className="flex items-center"><span className="text-yellow-400 mr-2">✓</span>Suporte prioritário</li>
                </ul>
                
                <a href="/create" className="block">
                  <button className="w-full bg-white text-purple-600 hover:bg-yellow-50 font-bold py-3 px-6 rounded-full transition-colors">
                    💕 Criar Nossa História
                  </button>
                </a>
                <p className="text-sm opacity-90">Pagamento único • Acesso para sempre</p>
              </div>
            </div>
          </div>
          
          {/* Countdown */}
          <div className="text-center mt-8">
            <p className="text-lg text-gray-600">⏰ Oferta de Natal termina em: <span className="font-bold text-red-600">2 dias</span></p>
          </div>
        </div>
      </section>
      
      {/* Demo Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Veja a Demo</h2>
            <p className="text-xl text-gray-600">Assim fica a retrospectiva do seu relacionamento</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-8 shadow-xl">
              <div className="bg-white rounded-xl p-8 text-center space-y-6">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-2xl font-bold text-gray-900">Demo Interativa</h3>
                <p className="text-gray-600">Navegue pelas stories • Ouça a música • Sinta a emoção</p>
                
                <div className="grid grid-cols-3 gap-4 my-6">
                  <div className="bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg p-4">
                    <div className="text-2xl mb-2">💕</div>
                    <div className="text-sm font-semibold">Story 1</div>
                    <div className="text-xs text-gray-600">Abertura</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-200 to-rose-200 rounded-lg p-4">
                    <div className="text-2xl mb-2">⏰</div>
                    <div className="text-sm font-semibold">Story 2</div>
                    <div className="text-xs text-gray-600">Tempo Juntos</div>
                  </div>
                  <div className="bg-gradient-to-br from-rose-200 to-pink-200 rounded-lg p-4">
                    <div className="text-2xl mb-2">📸</div>
                    <div className="text-sm font-semibold">Story 3</div>
                    <div className="text-xs text-gray-600">Fotos</div>
                  </div>
                </div>
                
                <a href="/create">
                  <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-200">
                    ▶️ Ver Demo Completa
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Dúvidas Frequentes</h2>
            <p className="text-xl text-gray-600">Tudo que você precisa saber</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">O link da retrospectiva expira?</h3>
              <p className="text-gray-600">Não! Na versão premium, o link é permanente e nunca expira. Vocês podem reviver a retrospectiva sempre que quiserem.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Posso editar depois de criar?</h3>
              <p className="text-gray-600">Sim! Você tem 7 dias para fazer alterações na sua retrospectiva após a criação.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Funciona bem no celular?</h3>
              <p className="text-gray-600">Perfeitamente! Nossa retrospectiva é 100% responsiva e otimizada para uma experiência perfeita no mobile.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">E se eu não ficar satisfeito?</h3>
              <p className="text-gray-600">Oferecemos garantia de satisfação de 7 dias. Se não amar sua retrospectiva, devolvemos seu dinheiro.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-pink-500 via-purple-500 to-rose-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-white">
            <h2 className="text-5xl sm:text-6xl font-bold leading-tight">
              Transforme Seu Amor em
              <br />
              <span className="text-yellow-300">Uma História Inesquecível</span>
            </h2>
            
            <p className="text-xl sm:text-2xl opacity-90 max-w-3xl mx-auto">
              Porque algumas histórias merecem ser eternizadas de forma especial. 
              Crie a retrospectiva que fará seu amor chorar de emoção. 💕
            </p>
            
            <div className="space-y-4">
              <a href="/create">
                <button className="bg-white text-purple-600 hover:bg-yellow-50 font-bold py-4 px-8 rounded-full text-lg shadow-xl transform hover:scale-105 transition-all duration-200">
                  💝 Começar Nossa História - 50% OFF
                </button>
              </a>
              <p className="text-sm opacity-90">💯 Satisfação garantida ou seu dinheiro de volta</p>
              <p className="text-xs opacity-75">⏰ Últimas horas da promoção de lançamento</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center items-center space-x-2">
              <span className="text-2xl">💕</span>
              <span className="text-2xl font-bold">LoveFrame</span>
            </div>
            <p className="text-gray-400">Transformando relacionamentos em histórias digitais inesquecíveis</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
              <a href="#" className="hover:text-white transition-colors">Suporte</a>
            </div>
            <p className="text-xs text-gray-500">© 2024 LoveFrame. Feito com 💕 para casais apaixonados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}