const Pusher = require('pusher')

const pusher = new Pusher({
  appId: '1282332',
  key: '336279862c548e2062a0',
  secret: 'dda1ea6f257a5af8f9cb',
  cluster: 'eu',
  useTLS: true,
})

module.exports = { pusher }
