'use client'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import type { TimeData } from '@/types/onboarding'

interface Step2RelationshipProps {
  userName: string
  relationshipStart: string
  relationshipTime: string
  timeData: TimeData
  onUpdateDate: (value: string) => void
  onUpdateTime: (value: string) => void
}

export default function Step2Relationship({ 
  userName, 
  relationshipStart, 
  relationshipTime, 
  timeData,
  onUpdateDate, 
  onUpdateTime 
}: Step2RelationshipProps) {
  return (
    <div className="space-y-8">
      {/* Panda Character */}
      <div className="flex items-start space-x-3 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
          🐼
        </div>
        <div className="flex-1 bg-gray-100 rounded-xl p-4 relative">
          <div className="absolute left-0 top-4 w-0 h-0 border-l-0 border-r-4 border-t-4 border-b-4 border-transparent border-r-gray-100 -ml-1"></div>
          <p className="text-gray-700 text-base leading-relaxed">
            Que lindo! Agora, me diz uma coisa, {userName || 'Pedro'}, há quanto tempo vocês estão juntos?
          </p>
        </div>
      </div>

      {/* Date and Time Inputs */}
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Dia que vocês começaram o relacionamento
          </label>
          <div className="relative">
            <DatePicker
              selected={relationshipStart ? new Date(relationshipStart) : null}
              onChange={(date: Date | null) => {
                if (date) {
                  onUpdateDate(date.toISOString().split('T')[0])
                }
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione a data especial..."
              className="w-full  text-black p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-base pl-12 "
              maxDate={new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              locale="pt-BR"
              
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-lg pointer-events-none">
          
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Horário que vocês começaram o relacionamento
          </label>
          <div className="relative">
            <input
              type="time"
              value={relationshipTime}
              onChange={(e) => onUpdateTime(e.target.value)}
              className="w-full text-black p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-base pl-12"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-lg">
              ⏰
            </div>
          </div>
        </div>
      </div>

      {/* Live Counter */}
      {relationshipStart && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
          <p className="text-center text-gray-600 font-medium mb-4">
            Uau, vocês estão juntos há
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-lg p-2 text-center shadow-sm">
              <div className="text-lg font-bold text-purple-600">{timeData.years}</div>
              <div className="text-xs text-gray-500">Anos</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center shadow-sm">
              <div className="text-lg font-bold text-purple-600">{timeData.months}</div>
              <div className="text-xs text-gray-500">Meses</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center shadow-sm">
              <div className="text-lg font-bold text-purple-600">{timeData.days}</div>
              <div className="text-xs text-gray-500">Dias</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="bg-white rounded-lg p-2 text-center shadow-sm">
              <div className="text-lg font-bold text-purple-600">{timeData.hours}</div>
              <div className="text-xs text-gray-500">Horas</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center shadow-sm">
              <div className="text-lg font-bold text-purple-600">{timeData.minutes}</div>
              <div className="text-xs text-gray-500">Minutos</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center shadow-sm">
              <div className="text-lg font-bold text-purple-600">{timeData.seconds}</div>
              <div className="text-xs text-gray-500">Segundos</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}