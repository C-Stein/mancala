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

//drawBoard(gameBoard)



let onClick = (e) =>{
  const col = e.target.cellIndex
  const row = e.target.closest('tr').rowIndex
  let board;
  let marbles;
  if (col === 0 || col === 7){
    console.log("you clicked the pit")
  } else {
    console.log(`you clicked ${row}, ${col}`)
    console.log(`gameBoard`, gameBoard)
    if(gameBoard.player1Turn && row === 1){
      marbles = gameBoard.p1Row[col-1]
      //console.log(`There are ${marbles} marbles`)
      board = player1Move(marbles, col, gameBoard)
      //console.log("board", board)
      drawBoard(board)
    } else if (!gameBoard.player1Turn && row === 0){
      switch(col){
        case 1: marbles = gameBoard.p2Row[5]; break;
        case 2: marbles = gameBoard.p2Row[4]; break;
        case 3: marbles = gameBoard.p2Row[3]; break;
        case 4: marbles = gameBoard.p2Row[2]; break;
        case 5: marbles = gameBoard.p2Row[1]; break;
        case 6: marbles = gameBoard.p2Row[0]; break;
      }
      //console.log("column", column)
      //marbles = gameBoard.p2Row[column - 1]
      console.log(`There are ${marbles} marbles`)
      board = player2Move(marbles, col, gameBoard)
      drawBoard(board)
    }
  }

}

/////////////////////////////////////////////////////////////////////

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

function player2Move(marbles, row, updatedGameBoard){
  let baseArray = [   
                      updatedGameBoard.p2Row[0],
                      updatedGameBoard.p2Row[1],
                      updatedGameBoard.p2Row[2],
                      updatedGameBoard.p2Row[3],
                      updatedGameBoard.p2Row[4],
                      updatedGameBoard.p2Row[5],
                      updatedGameBoard.p2Pit,
                      updatedGameBoard.p1Row[0], 
                      updatedGameBoard.p1Row[1],
                      updatedGameBoard.p1Row[2],
                      updatedGameBoard.p1Row[3],
                      updatedGameBoard.p1Row[4],
                      updatedGameBoard.p1Row[5]
  ]
  let rightRow;
  switch(row){
  case 1: rightRow = 5; break;
  case 2: rightRow = 4; break;
  case 3: rightRow = 3; break;
  case 4: rightRow = 2; break;
  case 5: rightRow = 1; break;
  case 6: rightRow = 0; break;
  }

    console.log("baseArray", baseArray)
      baseArray[rightRow] = 0
    
    for (var i = 0; i < marbles; i++) {
      if((rightRow + i + 1) >= baseArray.length){
        let arrayIndex = rightRow + i - baseArray.length
        baseArray[arrayIndex] ++
      } else {
        baseArray[rightRow + i + 1] ++
      }
    }

    updatedGameBoard.p2Row = baseArray.slice(0, 6)
    updatedGameBoard.p2Pit = baseArray[6]
    updatedGameBoard.p1Row = baseArray.slice(7, 13)
    updatedGameBoard.player1Turn= true;

    return updatedGameBoard
  }

