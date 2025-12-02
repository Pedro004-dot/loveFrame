interface Step3TitleProps {
  userName: string
  giftTitle: string
  onUpdate: (value: string) => void
}

export default function Step3Title({ userName, giftTitle, onUpdate }: Step3TitleProps) {
  const titleSuggestions = [
    `${userName || 'Nossa'} História de Amor 2024`,
    'Retrospectiva do Nosso Amor',
    'Um Ano de Nós Dois'
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">
          Que título vamos dar para essa retrospectiva?
        </h2>
        <p className="text-xl text-purple-600">(aparecerá no topo) 🎁</p>
      </div>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nossa História de Amor 2024..."
          value={giftTitle}
          onChange={(e) => onUpdate(e.target.value)}
          className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg text-gray-900 placeholder-gray-500"
        />
        
        <div className="grid grid-cols-1 gap-2 text-sm text-gray-500">
          {titleSuggestions.map((suggestion, index) => {
            const icons = ['📖', '💕', '✨']
            return (
              <button 
                key={index}
                onClick={() => onUpdate(suggestion)}
                className="p-2 bg-purple-50 rounded-lg hover:bg-purple-100 text-left transition-colors"
              >
                {icons[index]} {suggestion}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}