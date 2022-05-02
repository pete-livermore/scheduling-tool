import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DatePicker from './calendar/Calendar'
import Modal from './components/Modal'
import {
  IAppointment,
  ICalendar,
  IDateSubmitted,
} from './interfaces/Interfaces'
import {
  formatFullDateTime,
  formatTimeString,
  formatDateOnly,
} from './helpers/Helpers'

function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [calendar, setCalendar] = useState<ICalendar>({
    _id: '',
    owner: { _id: '', name: '', imageURL: '', attending: [''] },
    appointments: [],
  })
  const [dateSubmitted, setDateSubmitted] = useState<IDateSubmitted>({
    submitted: false,
    date: new Date(),
  })

  const [filteredAppointments, setFilteredAppointments] = useState<
    IAppointment[]
  >([])

  const [error, setError] = useState<IError>({
    error: false,
    message: '',
  })
  interface IError {
    error: boolean
    message: string
  }

  // The get request to get a specific users 'calendar' - it gets all the available appointments for that user
  useEffect(() => {
    const getAppointments = async () => {
      try {
        // The meeting organiser would share the URL to attendees, which would contain the user ID as a parameter. The user ID could then be accessed using useParams so that it could be used in the GET request URL
        const userId = 'ae82018e43b37fa077320d6f'
        const { data } = await axios.get(
          `https://scheduling-tool.free.mockoapp.net/calendars/${userId}`
        )
        setCalendar(data)
      } catch (err: any) {
        setError(err.message)
      }
    }
    getAppointments()
  }, [])

  // This filters the users appointments, to display on those available for the day that the user has clicked on and which are in the future
  useEffect(() => {
    const availableApts = calendar.appointments.filter((apt) => {
      return (
        new Date(apt.startDateTime).toLocaleDateString() ===
          selectedDate.toLocaleDateString() && !Object.keys(apt.attendee).length
      )
    })
    if (selectedDate.toLocaleDateString() === new Date().toLocaleDateString())
      setFilteredAppointments(
        availableApts.filter(
          (apt) =>
            new Date(apt.startDateTime).toLocaleTimeString() >
            new Date().toLocaleTimeString()
        )
      )
    else setFilteredAppointments(availableApts)
  }, [calendar, selectedDate])

  // This opens the modal when a user clicks on a time slot
  const handleTimeClick = (e: any) => {
    setShowModal(true)
    setSelectedTime(e.target.id)
  }

  return (
    <div className='p-4 lg:pt-20'>
      <div className='max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-5xl p-4 md:p-8 flex flex-col'>
        {/* Here there is conditional rendering - once a date has been confirmed, the UI changes to a success message */}
        {!dateSubmitted.submitted ? (
          <>
            <div className='flex py-4'>
              {Object.keys(calendar.owner) ? (
                <>
                  <img
                    src={calendar.owner.imageURL}
                    alt={calendar.owner.name}
                    className='rounded-full shadow-md mr-4 border-2 w-20 md:w-20 max-h-20'
                  />
                  <div className='flex flex-col grow justify-between'>
                    <h3>Find a day that {calendar.owner.name} is available</h3>
                    <div className='flex'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 mr-2'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <p className='inline'> 1 hour</p>
                    </div>
                    <div className='flex'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 mr-2'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path d='M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z' />
                      </svg>
                      <p className='inline'>Zoom.us</p>
                    </div>
                  </div>
                </>
              ) : error.error ? (
                <p>Sorry there was an error behind the scenes!</p>
              ) : (
                <svg
                  role='status'
                  className='w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
                  viewBox='0 0 100 101'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                    fill='currentColor'
                  ></path>
                  <path
                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                    fill='currentFill'
                  ></path>
                </svg>
              )}
            </div>
            <hr className='border' />
            <div className='flex flex-col lg:flex-row justify-between py-6'>
              <div className='flex flex-col order-1'>
                <h3 className='mb-3'>Book a 1 hour meeting</h3>
                <p className='font-semibold mb-3'>
                  Select an available time below to book:
                </p>
                <p className='mt-6 mb-4 text-center'>
                  {formatDateOnly(selectedDate)}
                </p>
                <div className='flex flex-col items-stretch md:items-center lg:items-stretch'>
                  {filteredAppointments.length ? (
                    filteredAppointments.map((apt: IAppointment) => {
                      return (
                        <button
                          key={apt._id}
                          id={String(apt.startDateTime)}
                          className='shadow-sm mb-2 bg-green-500 py-2 px-14 rounded-sm flex justify-center hover:bg-sky-700 rounded cursor-pointer max-w-none md:max-w-xs lg:max-w-none'
                          onClick={handleTimeClick}
                          type='button'
                          data-modal-toggle='defaultModal'
                        >
                          {formatTimeString(String(apt.startDateTime))} &#8211;{' '}
                          {formatTimeString(String(apt.endDateTime))}
                        </button>
                      )
                    })
                  ) : (
                    <p className='mt-4'>
                      Sorry, no appointments available on this day!
                    </p>
                  )}
                </div>
              </div>
              <div className='flex flex-col items-center pt-4 lg:pt-0 order-2'>
                <DatePicker
                  setSelectedDate={setSelectedDate}
                  appointments={calendar.appointments}
                />
              </div>
            </div>
            <Modal
              showModal={showModal}
              setShowModal={setShowModal}
              selectedTime={selectedTime}
              appointments={calendar.appointments}
              setDateSubmitted={setDateSubmitted}
              owner={calendar.owner}
            />
          </>
        ) : (
          <div className='p-4 flex'>
            <div className='grow'>
              <h3 className='mb-4'>Success!</h3>
              <p>
                Your appointment has been confirmed for{' '}
                {formatFullDateTime(String(dateSubmitted.date))}
              </p>
            </div>
            <div className='w-40 flex flex-col justify-center items-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-14 w-14 text-green-500 '
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
