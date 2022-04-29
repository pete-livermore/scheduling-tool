import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DatePicker from './calendar/Calendar'
import Modal from './components/Modal'

function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [userData, setUserData] = useState<{
    id: string
    name: string
    imageURL: string
    appointments: IAppointment[]
  }>({ id: '', name: 'string', imageURL: '', appointments: [] })

  const [appointments, setAppointments] = useState<IAppointment[]>([])

  interface IAppointment {
    id: number
    startDateTime: Date
    endDateTime: Date
    attendee: {}
  }
  const [error, setError] = useState<IError>({
    error: false,
    message: '',
  })
  interface IError {
    error: boolean
    message: string
  }

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const { data } = await axios.get(
          'https://scheduling-tool.free.mockoapp.net/1/appointments'
        )
        console.log(data)
        setUserData(data)
      } catch (err: any) {
        setError(err.message)
      }
    }
    getAppointments()
  }, [])

  useEffect(() => {
    const filteredApts = userData.appointments.filter((apt) => {
      return (
        new Date(apt.startDateTime).toLocaleDateString() ===
          selectedDate.toLocaleDateString() && !Object.keys(apt.attendee).length
      )
    })
    setAppointments(filteredApts)
  }, [userData, selectedDate])

  const handleTimeClick = (e: any) => {
    setShowModal(true)
    setSelectedTime(e.target.id)
  }

  return (
    <>
      <div className='pt-20'>
        <div className='max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-4xl p-8 flex flex-col'>
          <div className='flex py-4'>
            <img
              src={userData.imageURL}
              alt={userData.name}
              className='rounded-full w-20 shadow-md mr-2 border-2'
            />
            <p>Find a day that Pete is available</p>
          </div>
          <hr className='border' />
          <div className='flex justify-between py-6'>
            <div className='flex flex-col'>
              <h3>Book a 1hr meeting</h3>
              <p className='font-semibold'>
                Select an available time below to book:
              </p>
              {appointments.map((apt: IAppointment) => {
                return (
                  <button
                    key={apt.id}
                    id={String(apt.startDateTime)}
                    className='shadow-sm mb-2 bg-red-600 py-2 px-4 rounded-sm flex justify-center hover:bg-sky-700 rounded cursor-pointer'
                    onClick={handleTimeClick}
                    type='button'
                    data-modal-toggle='defaultModal'
                  >
                    {new Date(apt.startDateTime).toLocaleTimeString()}
                  </button>
                )
              })}
            </div>
            <div className='flex flex-col'>
              <DatePicker setSelectedDate={setSelectedDate} />
            </div>
          </div>
        </div>
      </div>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedTime={selectedTime}
      />
    </>
  )
}

export default App
