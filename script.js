const socket = io()

const EVENTS = {
  CHAT_MESSAGE: 'CHAT_MESSAGE',
  USER_CONNECTED: 'USER_CONNECTED',
  NEW_DATA: 'NEW_DATA',
}
let names = {}

const form = document.getElementById('form')
const input = document.getElementById('input')
const sendDataBtn = document.getElementById('send-data')
const dataType = document.querySelector('select[name=dataType]')

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getPrintableDate(time) {
  const d = new Date(time)
  const day = d.getDay()
  const hour = d.getHours() > 12 ? d.getHours() - 13 : d.getHours()
  const minutes = d.getMinutes()
  return `${days[day]} ${hour}:${minutes.toString().padStart(2, '0')}${
    d.getHours() > 12 ? ' PM' : 'AM'
  }`
}

fetch('/data')
  .then((d) => d.json())
  .then(({ messages, nicknames }) => {
    if (messages?.length) {
      messages.forEach(appendMessage)
    }
    names = { ...nicknames }
  })

form.addEventListener('submit', function (e) {
  e.preventDefault()

  if (input.value) {
    const message = { msg: input.value, time: new Date() }
    socket.emit(EVENTS.CHAT_MESSAGE, message)
    appendMessage({ ...message, sender: socket.id })
    input.value = ''
  }
})

socket.on(EVENTS.USER_CONNECTED, (nicknames) => (names = { ...nicknames }))
socket.on(EVENTS.CHAT_MESSAGE, appendMessage)

function appendMessage({ msg, sender, time }) {
  const item = document.createElement('li')
  const sndr = sender === socket.id ? 'me' : sender
  item.innerHTML = `
  <div class="sender">
  <strong>${names[sndr] ?? sndr}</strong>
  <div>${getPrintableDate(time)}</div>
  </div>

   ${msg}`

  messages.appendChild(item)
  window.scrollTo({
    left: 0,
    top: document.body.scrollHeight,
    behavior: 'smooth',
  })
}
function randomInt() {
  return Math.round(Math.random() * 100)
}
function bubbleData() {
  return [
    { x: randomInt() },
    { x: randomInt() },
    { x: randomInt() },
    { x: randomInt() },
    { x: randomInt() },
    { x: randomInt() },
  ]
}

function dotsData() {
  return [
    [
      { y: randomInt(), x: new Date(2020, 8, 3) },
      { y: randomInt(), x: new Date(2020, 11, 2) },
      { y: randomInt(), x: new Date(2021, 2, 7) },
      { y: randomInt(), x: new Date(2021, 4, 16) },
      { y: randomInt(), x: new Date(2021, 6, 26) },
      { y: randomInt(), x: new Date(2021, 10, 12) },
    ],
    [
      { y: randomInt(), x: new Date(2020, 8, 2) },
      { y: randomInt(), x: new Date(2020, 11, 1) },
      { y: randomInt(), x: new Date(2021, 2, 6) },
      { y: randomInt(), x: new Date(2021, 4, 15) },
      { y: randomInt(), x: new Date(2021, 6, 25) },
      { y: randomInt(), x: new Date(2021, 10, 11) },
    ],
  ]
}

sendDataBtn.addEventListener('click', () => {
  let data = {}
  switch (dataType.value) {
    case 'bubble': {
      data = bubbleData()
      break
    }

    case 'dots': {
      data = dotsData()
      break
    }

    default:
      return
  }
  socket.emit(EVENTS.NEW_DATA, { type: dataType.value, data })
})
