import React, { SetStateAction } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

interface DatePickerProps {
  setSelectedDate: React.Dispatch<SetStateAction<Date>>
}

export default function DatePicker({ setSelectedDate }: DatePickerProps) {
  const handleDayClick = (view: Date) => {
    setSelectedDate(view)
  }

  return (
    <Calendar
      onClickDay={(view) => {
        handleDayClick(view)
      }}
    />
  )
}
