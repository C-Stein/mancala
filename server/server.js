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
      if(socket.game.board.player1Turn && row === 1){
        let marbles = socket.game.board.p1Row[col-1]
        //console.log(`There are ${marbles} marbles`)
        socket.game.board = player1Move(marbles, col, socket.game.board)
        //console.log("board", board)
      }
       
     socket.game.markModified('board') // trigger mongoose change detection
     socket.game.save().then(g => socket.emit('move made', g))
   })
  socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`))
  socket.on('something', (msg) => { console.log("here is", msg)})
})

function player1Move(marbles, row, updatedGameBoard){
  let baseArray = [   updatedGameBoard.p1Row[0], 
                      updatedGameBoard.p1Row[1],
                      updatedGameBoard.p1Row[2],
                      updatedGameBoard.p1Row[3],
                      updatedGameBoard.p1Row[4],
                      updatedGameBoard.p1Row[5],
                      updatedGameBoard.p1Pit,
                      updatedGameBoard.p2Row[0],
                      updatedGameBoard.p2Row[1],
                      updatedGameBoard.p2Row[2],
                      updatedGameBoard.p2Row[3],
                      updatedGameBoard.p2Row[4],
                      updatedGameBoard.p2Row[5]
  ]

    console.log("baseArray", baseArray)
    for (var i = 0; i < marbles; i++) {
      baseArray[row - 1] = 0
      if((row + i) >= baseArray.length){
        let arrayIndex = row + i - baseArray.length
        baseArray[arrayIndex] ++
      } else {
        baseArray[row + i] ++
      }
    }

    updatedGameBoard.p1Row = baseArray.slice(0, 6)
    updatedGameBoard.p1Pit = baseArray[6]
    updatedGameBoard.p2Row = baseArray.slice(7, 13)
    updatedGameBoard.player1Turn= false;

    return updatedGameBoard
  }













