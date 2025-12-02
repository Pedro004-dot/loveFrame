interface Step7SpecialMessageProps {
  specialMessage: string
  onUpdate: (value: string) => void
  userName?: string
  partnerName?: string
}

export default function Step7SpecialMessage({ 
  specialMessage, 
  onUpdate,
  userName,
  partnerName 
}: Step7SpecialMessageProps) {
  const messageSuggestions = [
    `E pensar que tudo começou do nada... ✨ Olha só pra gente agora: escrevendo nossa própria história, que só tende a ficar mais bonita a cada dia.`,
    `Cada momento ao seu lado é um presente. Cada risada, cada abraço, cada "eu te amo" - tudo isso faz parte da nossa história única. 💕`,
    `Do primeiro olhar até hoje, cada segundo foi especial. Nossa história é feita de pequenos momentos que se transformaram em memórias inesquecíveis. 🌟`
  ]

  const maxLength = 500
  const remainingChars = maxLength - specialMessage.length

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">
          Escreva uma mensagem especial
        </h2>
        <p className="text-xl text-purple-600">para essa retrospectiva 💌</p>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <textarea
            placeholder="Conte o que essa retrospectiva significa para vocês..."
            value={specialMessage}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                onUpdate(e.target.value)
              }
            }}
            className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg text-gray-900 placeholder-gray-500 min-h-[200px] resize-y"
            rows={6}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {remainingChars} caracteres restantes
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">💡 Sugestões de mensagens:</p>
          <div className="grid grid-cols-1 gap-2">
            {messageSuggestions.map((suggestion, index) => {
              const icons = ['✨', '💕', '🌟']
              return (
                <button 
                  key={index}
                  onClick={() => onUpdate(suggestion)}
                  className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 text-left transition-colors text-sm"
                >
                  <span className="mr-2">{icons[index]}</span>
                  {suggestion.substring(0, 80)}...
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

