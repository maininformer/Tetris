function getDefaults() {
  const BOARD_NAME = 'Board'
  const BOARD__NAME = 'Board_'
  const WINDOW_ADDRESS = 'Q4:AE24'
  
  const board = SpreadsheetApp.getActive().getSheetByName(BOARD_NAME)
  const board_ = SpreadsheetApp.getActive().getSheetByName(BOARD__NAME)
  const window = board.getRange(WINDOW_ADDRESS)
  const window_ = board_.getRange(WINDOW_ADDRESS)
  
  return {
    blockSize: 2,
    board: board,
    board_: board_,
    boardLastRow: 24,
    firstColumn: 17,
    lastColumn: 31,
    startColumn: 23, // V
    startRow: 4, 
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