const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
const server = http.createServer(app)

const allowList = '*'

const options = [server, { cors: { origin: allowList } }]
const io = new Server(...options)

const messages = []
const nicknames = {}

const EVENTS = {
  CHAT_MESSAGE: 'CHAT_MESSAGE',
  USER_CONNECTED: 'USER_CONNECTED',
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/script.js', (req, res) => {
  res.sendFile(__dirname + '/script.js')
})

app.get('/data', cors({ origin: allowList }), (req, res) => {
  res.send({ messages, nicknames })
})

function addMessage({ msg, sender }) {
  messages.push({ msg, sender })
}

function addAndBroadcast(message, broadcaster) {
  addMessage(message)
  broadcaster.emit(EVENTS.CHAT_MESSAGE, message)
}

function announceUser(nicknames, broadcaster) {
  broadcaster.emit(EVENTS.USER_CONNECTED, nicknames)
}

io.on('connection', (socket) => {
  nicknames[socket.id] = `user_${socket.id.slice(0, 4)}`
  const message = {
    msg: `User ${nicknames[socket.id]} entered the server`,
    sender: 'system bot',
  }
  addAndBroadcast(message, io)
  announceUser({ ...nicknames }, socket.broadcast)

  socket.on(EVENTS.CHAT_MESSAGE, (msg) => {
    const message = { msg, sender: socket.id }
    addAndBroadcast(message, socket.broadcast)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
