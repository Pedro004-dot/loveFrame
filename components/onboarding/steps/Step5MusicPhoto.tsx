import { Upload } from 'lucide-react'

interface Step5MusicPhotoProps {
  musicCoverPhoto: File | null
  musicCoverPhotoUrl: string
  onFileUpload: (file: File) => void
}

export default function Step5MusicPhoto({ musicCoverPhoto, musicCoverPhotoUrl, onFileUpload }: Step5MusicPhotoProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">
          Agora vamos escolher a foto que vai aparecer
        </h2>
        <p className="text-xl text-purple-600">no player da música 📸</p>
      </div>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="musicCoverUpload"
          />
          <label htmlFor="musicCoverUpload" className="cursor-pointer">
            <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700">Clique para enviar sua foto</p>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG até 5MB</p>
          </label>
        </div>
        
        {musicCoverPhotoUrl && (
          <div className="bg-purple-50 p-4 rounded-xl">
            <p className="text-sm font-medium mb-2">📸 Foto carregada</p>
            <img 
              src={musicCoverPhotoUrl} 
              alt="Music cover photo preview" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  )
}

