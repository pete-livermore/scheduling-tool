export interface IAppointment {
  id: number
  startDateTime: Date
  endDateTime: Date
  attendee: {}
}

export interface ICalendar {
  _id: string
  owner: IUser
  appointments: IAppointment[]
}

export interface IUser {
  _id: string
  name: string
  imageURL: string
  attending: string[]
}

export interface IDateSubmitted {
  submitted: boolean
  date: Date
}
