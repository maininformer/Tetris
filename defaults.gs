function getDefaults() {
  const BOARD_NAME = 'Board'
  const BOARD__NAME = 'Board_'
  const TILES_NAME = 'Tiles'
  const WINDOW_ADDRESS = 'Q4:AE24'
  const SCORE_ADDRESS = 'J5'
  
  const board = SpreadsheetApp.getActive().getSheetByName(BOARD_NAME)
  const board_ = SpreadsheetApp.getActive().getSheetByName(BOARD__NAME)
  const tiles = SpreadsheetApp.getActive().getSheetByName(TILES_NAME)
  const window = board.getRange(WINDOW_ADDRESS)
  const window_ = board_.getRange(WINDOW_ADDRESS)
  const score = board.getRange(SCORE_ADDRESS)
  
  return {
    blockSize: 2,
    board: board,
    board_: board_,
    boardLastRow: 24,
    scoreIncrement: 25,
    firstColumn: 17,
    lastColumn: 31,
    score: score,
    startColumn: 23, // V
    startRow: 5,
    tiles: tiles,
    window: window,
    window_: window_
  }
}


function getMovements(){
  const BOARD_NAME = 'Board'
  const board = SpreadsheetApp.getActive().getSheetByName(BOARD_NAME)
  
  const MOVE_ADDRESS = 'AH24'
  
  const move = board.getRange(MOVE_ADDRESS)
  const clearMovements = function(){
    move.setValue('')
  }
  
  return {
    clearMovements: clearMovements,
    move: move.getValue(),
  }
}