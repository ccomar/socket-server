const socket = io()

const EVENTS = {
  CHAT_MESSAGE: 'CHAT_MESSAGE',
  USER_CONNECTED: 'USER_CONNECTED',
}
let names = {}

const form = document.getElementById('form')
const input = document.getElementById('input')

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
