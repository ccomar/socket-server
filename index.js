const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  path: '/test-socket/',
  serveClient: false,
  cors: { origin: ['http://localhost:3000', 'http://localhost:3001'] },
})

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
