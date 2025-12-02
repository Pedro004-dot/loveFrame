'use client'

import { useState, useEffect } from 'react'

export default function PromoHeader() {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('pt-BR'))
  }, [])

  return (
    <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white text-center py-2 px-4 text-sm font-medium">
      <div className="flex items-center justify-center space-x-2">
        <span className="animate-pulse">🔥</span>
        <span>
          <strong>Somente hoje {currentDate} </strong> - todos os planos com <strong>50% de desconto</strong>, Não Perca!
        </span>
        <span className="animate-pulse">⏰</span>
      </div>
    </div>
  )
}