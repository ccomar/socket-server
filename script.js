const socket = io()

const EVENTS = {
  CHAT_MESSAGE: 'CHAT_MESSAGE',
  USER_CONNECTED: 'USER_CONNECTED',
}
let names = {}

const form = document.getElementById('form')
const input = document.getElementById('input')

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
    appendMessage({ msg: input.value, sender: socket.id })
    socket.emit(EVENTS.CHAT_MESSAGE, input.value)
    input.value = ''
  }
})

socket.on(EVENTS.USER_CONNECTED, (nicknames) => (names = { ...nicknames }))
socket.on(EVENTS.CHAT_MESSAGE, appendMessage)

function appendMessage({ msg, sender }) {
  const item = document.createElement('li')
  const sndr = sender === socket.id ? 'me' : sender
  item.innerHTML = `<strong class="w-md">${names[sndr] ?? sndr}</strong> ${msg}`

  messages.appendChild(item)
  window.scrollTo({
    left: 0,
    top: document.body.scrollHeight,
    behavior: 'smooth',
  })
}
