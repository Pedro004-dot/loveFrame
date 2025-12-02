import { Upload, X } from 'lucide-react'

interface Step8CoupleGalleryProps {
  coupleGalleryPhotos: File[]
  coupleGalleryPhotoUrls: string[]
  onPhotosUpload: (files: File[]) => void
  onPhotoRemove: (index: number) => void
}

export default function Step8CoupleGallery({ 
  coupleGalleryPhotos, 
  coupleGalleryPhotoUrls,
  onPhotosUpload,
  onPhotoRemove
}: Step8CoupleGalleryProps) {
  const minPhotos = 3
  const maxPhotos = 6
  const currentCount = coupleGalleryPhotos.length
  const canAddMore = currentCount < maxPhotos

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const remainingSlots = maxPhotos - currentCount
    const filesToAdd = files.slice(0, remainingSlots)
    
    if (filesToAdd.length > 0) {
      onPhotosUpload([...coupleGalleryPhotos, ...filesToAdd])
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">
          Adicione fotos especiais do casal
        </h2>
        <p className="text-xl text-purple-600">para a galeria ({minPhotos}-{maxPhotos} fotos) 📸</p>
      </div>
      
      <div className="space-y-4">
        {/* Photo Grid */}
        {coupleGalleryPhotoUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {coupleGalleryPhotoUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt={`Gallery photo ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => onPhotoRemove(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover foto"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Area */}
        {canAddMore && (
          <div className="border-2 border-dashed border-purple-200 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="galleryUpload"
            />
            <label htmlFor="galleryUpload" className="cursor-pointer">
              <Upload className="w-10 h-10 text-purple-400 mx-auto mb-3" />
              <p className="text-base font-semibold text-gray-700">
                {currentCount === 0 
                  ? 'Clique para adicionar fotos' 
                  : `Adicionar mais fotos (${currentCount}/${maxPhotos})`
                }
              </p>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG até 5MB cada</p>
            </label>
          </div>
        )}

        {/* Status Message */}
        <div className={`p-3 rounded-lg text-sm ${
          currentCount < minPhotos 
            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {currentCount < minPhotos ? (
            <p>⚠️ Adicione pelo menos {minPhotos} fotos para continuar ({currentCount}/{minPhotos})</p>
          ) : (
            <p>✅ {currentCount} foto{currentCount !== 1 ? 's' : ''} adicionada{currentCount !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>
    </div>
  )
}

