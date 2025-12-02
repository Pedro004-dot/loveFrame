import { Upload, X } from 'lucide-react'

interface Step6TimePhotoProps {
  timeCounterPhoto: File | null
  timeCounterPhotoUrl: string
  onFileUpload: (file: File) => void
  onSkip: () => void
}

export default function Step6TimePhoto({ 
  timeCounterPhoto, 
  timeCounterPhotoUrl, 
  onFileUpload,
  onSkip 
}: Step6TimePhotoProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const handleRemove = () => {
    onSkip()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">
          Quer adicionar uma foto especial acima
        </h2>
        <p className="text-xl text-purple-600">do contador de tempo? (Opcional) 📷</p>
      </div>
      
      <div className="space-y-4">
        {!timeCounterPhotoUrl ? (
          <>
            <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="timeCounterUpload"
              />
              <label htmlFor="timeCounterUpload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700">Clique para enviar sua foto</p>
                <p className="text-sm text-gray-500 mt-1">JPG, PNG até 5MB</p>
              </label>
            </div>
            
            <button
              onClick={onSkip}
              className="w-full py-3 px-4 text-gray-600 hover:text-gray-800 font-medium border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
              Pular esta etapa
            </button>
          </>
        ) : (
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">📸 Foto carregada</p>
              <button
                onClick={handleRemove}
                className="text-red-600 hover:text-red-700 p-1"
                title="Remover foto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img 
              src={timeCounterPhotoUrl} 
              alt="Time counter photo preview" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  )
}

