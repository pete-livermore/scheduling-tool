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
  // This checks that only appointments in the future are used for the calendar
  const futureAppointments = appointments.filter((apt) => {
    return !(
      new Date(apt.startDateTime) < new Date() ||
      (new Date(apt.startDateTime).toLocaleDateString() ===
        new Date().toLocaleDateString() &&
        new Date(apt.startDateTime).toLocaleTimeString() <
          new Date().toLocaleTimeString())
    )
  })
  const datesOnly = futureAppointments.map((apt) => apt.startDateTime)
  return (
    <Calendar
      // This function selects a date when a user clicks on a calendar tile
      onClickDay={(view: Date) => {
        setSelectedDate(view)
      }}
      // This adds a class to the tiles corresponding to dates where there are appointments available
      tileClassName={({ date }) => {
        if (
          datesOnly.some(
            (item) =>
              new Date(item).toLocaleDateString() === date.toLocaleDateString()
          )
        )
          return 'bg-emerald-400 text-white text-bold px-2 hover:bg-emerald-600 cursor-pointer active:text-white'
        else return ''
      }}
    />
  )
}
