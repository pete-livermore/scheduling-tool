import React, { SetStateAction, ReactNode, useState } from 'react'
import axios from 'axios'
import { IAppointment, IDateSubmitted } from '../interfaces/Interfaces'
import { formatFullDateTime } from '../helpers/Helpers'

interface ModalProps {
  showModal: ReactNode
  setShowModal: React.Dispatch<SetStateAction<boolean>>
  setDateSubmitted: React.Dispatch<SetStateAction<IDateSubmitted>>
  selectedTime: ReactNode
  appointments: IAppointment[]
}

export default function Modal({
  showModal,
  setShowModal,
  selectedTime,
  appointments,
  setDateSubmitted,
}: ModalProps) {
  const apts = [...appointments]
  const user = {
    userId: '3f82018e43b87fa066320d6f',
    name: 'Dave User',
  }

  const [error, setError] = useState<IError>({
    error: false,
    message: '',
  })
  interface IError {
    error: boolean
    message: string
  }

  const handleConfirmClick = () => {
    const updatedAppointment = apts.map((apt) => {
      return String(apt.startDateTime) === selectedTime
        ? { ...apt, attendee: user }
        : apt
    })
    const updateAppointment = async () => {
      try {
        await axios.put(
          'https://scheduling-tool.free.mockoapp.net/calendars/ae82018e43b37fa077320d6f',
          updatedAppointment
        )
        setShowModal(false)
        setDateSubmitted({
          submitted: true,
          date: updatedAppointment[0].startDateTime,
        })
      } catch (err: any) {
        setError({ error: true, message: err.message })
      }
    }
    updateAppointment()
  }

  return (
    <>
      {showModal ? (
        <>
          <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-auto my-6 mx-auto max-w-3xl'>
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                <div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                  <h3 className='font-semibold'>
                    Are you sure you want to book this slot?
                  </h3>
                  <button
                    className='p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                    onClick={() => setShowModal(false)}
                  >
                    <span className='bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none'>
                      ×
                    </span>
                  </button>
                </div>
                <div className='relative p-6 flex-auto'>
                  <p className='my-4 text-slate-500 text-lg leading-relaxed'>
                    {formatFullDateTime(String(selectedTime))}
                  </p>
                </div>
                <div className='flex items-center justify-end p-6 rounded-b'>
                  <button
                    className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                    type='button'
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className='bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                    type='button'
                    onClick={handleConfirmClick}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='opacity-60 fixed inset-0 z-40 bg-black'></div>
        </>
      ) : null}
    </>
  )
}
