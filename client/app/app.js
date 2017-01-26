'use strict'
console.log("app.js")


const infoBox = document.getElementById('infoBox')
const socket = io()

document.getElementById('button').addEventListener('click', () => {
  console.log("buttn cicked")
  socket.emit('something', "this is something")
})

socket.on('connect', () => console.log(`Socket connected: ${socket.id}`))
socket.on('disconnect', () => console.log('Socket disconnected'))

socket.on('error', console.error)
socket.on('new game', game => drawBoard(game.board))
socket.on('move made', game => drawBoard(game.board))

const drawBoard = (boardState) => {
  document.getElementById('board').innerHTML = `
    <table>
      <tr>
        <td>p2Pit: ${boardState.p2Pit}</td>
        <td>six: ${boardState.p2Row[5]}</td>
        <td>five: ${boardState.p2Row[4]}</td>
        <td>four: ${boardState.p2Row[3]}</td>
        <td>three: ${boardState.p2Row[2]}</td>
        <td>two: ${boardState.p2Row[1]}</td>
        <td>one:${boardState.p2Row[0]}</td>
        <td>(empty)</td>
      </tr>
      <tr>
        <td>(empty)</td>
        <td>one: ${boardState.p1Row[0]}</td>
        <td>two: ${boardState.p1Row[1]}</td>
        <td>three: ${boardState.p1Row[2]}</td>
        <td>four: ${boardState.p1Row[3]}</td>
        <td>five: ${boardState.p1Row[4]}</td>
        <td>six: ${boardState.p1Row[5]}</td>
        <td>p1Pit: ${boardState.p1Pit}</td>
      </tr>
    </table>
  `
  console.log("table updated")
  const table = document.querySelector('table')
    table.addEventListener('click', (e)=> {
      onClick(e)
  })
}


let onClick = (e) =>{
  const col = e.target.cellIndex
  const row = e.target.closest('tr').rowIndex
  let board;
  let marbles;
  if (col === 0 || col === 7){
    console.log("you clicked the pit")
  } else {
    socket.emit('make move', { row, col })/////////////////socket/////////
  }

}
 

