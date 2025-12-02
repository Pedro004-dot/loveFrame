import { useState, useEffect } from 'react'
import type { TimeData } from '@/types/onboarding'

export function useTimeCalculator(relationshipStart: string, relationshipTime: string): TimeData {
  const [timeData, setTimeData] = useState<TimeData>({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0
  })

  useEffect(() => {
    const calculateTime = () => {
      if (!relationshipStart) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
      
      let start = new Date(relationshipStart)
      
      if (relationshipTime) {
        const [hours, minutes] = relationshipTime.split(':')
        start.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      }
      
      const now = new Date()
      const diffInMs = now.getTime() - start.getTime()
      
      if (diffInMs < 0) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
      
      const years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365))
      const months = Math.floor((diffInMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
      const days = Math.floor((diffInMs % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000)
      
      return { years, months, days, hours, minutes, seconds }
    }

    const updateTimer = () => {
      setTimeData(calculateTime())
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    
    return () => clearInterval(interval)
  }, [relationshipStart, relationshipTime])

  return timeData
}