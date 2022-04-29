export const formatTimeString = (input: string) => {
  return `${new Date(input).getHours()}:${
    new Date(input).getMinutes() < 10 ? '0' : ''
  }${new Date(input).getMinutes()}`
}

export const formatFullDateTime = (input: string) => {
  return `${new Date(input).toLocaleDateString('en-gb', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })} ${formatTimeString(input)}`
}
