import React, { SetStateAction } from 'react'
import Calendar from 'react-calendar'
import './Calendar.css'
import { IAppointment } from '../interfaces/Interfaces'

interface DatePickerProps {
  setSelectedDate: React.Dispatch<SetStateAction<Date>>
  appointments: IAppointment[]
}

export default function DatePicker({
  setSelectedDate,
  appointments,
}: DatePickerProps) {
  const datesOnly = appointments.map((apt) => apt.startDateTime)
  return (
    <Calendar
      // This function selects a date when a user clicks on a calendar tile
      onClickDay={(view: Date) => {
        setSelectedDate(view)
      }}
      // This adds a class to the tiles corresponding to dates where there are appointments available
      tileClassName={({ date }) => {
        if (
          datesOnly.find(
            (item) =>
              new Date(item).toLocaleDateString() === date.toLocaleDateString()
          )
        ) {
          return 'bg-green-500 px-2 hover:bg-green-600 cursor-pointer active:text-white'
        } else return null
      }}
    />
  )
}
