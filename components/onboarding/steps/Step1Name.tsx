interface Step1NameProps {
  userName: string
  partnerName: string
  onUpdateUser: (value: string) => void
  onUpdatePartner: (value: string) => void
}

export default function Step1Name({ userName, partnerName, onUpdateUser, onUpdatePartner }: Step1NameProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">
          Para começar a criar este presente especial, me conta... 
        </h2>
        <p className="text-xl text-purple-600">quem são vocês dois? 💕</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Seu primeiro nome
          </label>
          <input
            type="text"
            placeholder="Seu primeiro nome..."
            value={userName}
            onChange={(e) => onUpdateUser(e.target.value)}
            className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg text-gray-900 placeholder-gray-500"
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nome do seu amor
          </label>
          <input
            type="text"
            placeholder="Nome do seu amor..."
            value={partnerName}
            onChange={(e) => onUpdatePartner(e.target.value)}
            className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>
    </div>
  )
}