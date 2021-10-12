const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const options = [
  server,
  {
    path: '/test-socket/',
    serveClient: false,
    cors: { origin: '*' },
  },
]
const io = new Server(...options)

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg)
    io.emit('chat message', socket.id + ' ' + msg)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
