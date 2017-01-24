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

let gameBoard = {
  player1Turn: true,
  p1Pit: 0,
  p2Pit: 0,
  p1Row: [4,4,4,4,4,4],
  p2Row: [4,4,4,4,4,4]
}

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
const table= document.querySelector('table')
  table.addEventListener('click', (e)=> {
    onClick(e)
  })
}

drawBoard(gameBoard)



let onClick = (e) =>{
  const col = e.target.cellIndex
  const row = e.target.closest('tr').rowIndex
  let board;
  if (col === 0 || col === 7){
    console.log("you clicked the pit")
  } else {
    console.log(`you clicked ${row}, ${col}`)
    console.log(`gameBoard`, gameBoard)
    if(gameBoard.player1Turn && row === 1){
      let marbles = gameBoard.p1Row[col-1]
      //console.log(`There are ${marbles} marbles`)
      board = loopWay(marbles, col, gameBoard)
      //console.log("board", board)
    }
    drawBoard(board)
  }

}

// let makeMove = (row, col) => {
//   let  marbles;
//   let updatedGameBoard = gameBoard;
//   if(gameBoard.player1Turn && row === 1){
//     marbles = gameBoard.p1Row[col-1]
//     console.log(`There are ${marbles} marbles`)
//   }
//   switch (marbles) {
//     case 0: 
//       //do this
//       console.log(0)
//       break;
//     case 1:
//       console.log(1)
//       //do this
//       break;
//     case 4:
//       console.log(4)
//       if(col === 1){
//         console.log("col 1")
//         updatedGameBoard.player1Turn= false, //come back to this
//         updatedGameBoard.p1Row[0] = 0
//         updatedGameBoard.p1Row[1] = gameBoard.p1Row[1] + 1
//         updatedGameBoard.p1Row[2] = gameBoard.p1Row[2] + 1
//         updatedGameBoard.p1Row[3] = gameBoard.p1Row[3] + 1
//         updatedGameBoard.p1Row[4] = gameBoard.p1Row[4] + 1
//       }
//       break;
//   }
//   console.log(`updatedGameBoard.p1Row ${updatedGameBoard.p1Row}`)
//   return updatedGameBoard
// }
/////////////////////////////////////////////////////////////////////

function loopWay(marbles, row, updatedGameBoard){
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
      console.log("baseArray[row - 1]", baseArray[row - 1])
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

    console.log("baseArray", baseArray)
    return updatedGameBoard
  }

