'use strict'

const express = require('express')
const { Server } = require('http')
const mongoose = require('mongoose')
const socketio = require('socket.io')

const app = express()
const server = Server(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000
const MONGODB_URL =  process.env.MONGODB_URL || 'mongodb://localhost:27017/mancala'

app.use(express.static('client'))

mongoose.Promise = Promise
mongoose.connect(MONGODB_URL, () => {
  server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))
})

const Game = mongoose.model('game', {
  board: {
    player1Turn: Boolean,
    p1Pit: Number,
    p2Pit: Number,
    p1Row: [Number,Number,Number,Number,Number,Number],
    p2Row: [Number,Number,Number,Number,Number,Number]
  }
})



io.on('connect', socket => {
  console.log(`Socket connected: ${socket.id}`)
  Game.create({
                board : {
                  player1Turn: true,
                  p1Pit: 0,
                  p2Pit: 0,
                  p1Row: [4,4,4,4,4,4],
                  p2Row: [4,4,4,4,4,4]
                }
  })
    .then(g =>{
      socket.game = g
      socket.emit('new game', g)
    })
    .catch(err => {
      socket.emit('error', err)
      console.error(err)
    })
   socket.on('make move', ({ row, col }) => {
     socket.game.board = {
                  player1Turn: true,
                  p1Pit: 99,
                  p2Pit: 99,
                  p1Row: [4,4,4,4,4,4],
                  p2Row: [4,4,4,4,4,4]
                }
     socket.game.markModified('board') // trigger mongoose change detection
     socket.game.save().then(g => socket.emit('move made', g))
   })
  socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`))
  socket.on('something', (msg) => { console.log("here is", msg)})
})















