function getDefaults() {
  const BOARD_NAME = 'Board'
  const BOARD__NAME = 'Board_'
  const WINDOW_ADDRESS = 'F1:T24'
  
  const board = SpreadsheetApp.getActive().getSheetByName(BOARD_NAME)
  const board_ = SpreadsheetApp.getActive().getSheetByName(BOARD__NAME)
  const window = board.getRange(WINDOW_ADDRESS)
  const window_ = board_.getRange(WINDOW_ADDRESS)
  
  return {
    board: board,
    board_: board_,
    boardLastRow: 15,
    startColumn: 11,
    startRow: 1,
    window: window,
    window_: window_
  }
}


function getMovements(){
  const BOARD_NAME = 'Board'
  const board = SpreadsheetApp.getActive().getSheetByName(BOARD_NAME)
  
  const MOVE_ADDRESS = 'W23'
  
  const move = board.getRange(MOVE_ADDRESS)
  const clearMovements = function(){
    move.setValue('')
  }
  
  return {
    clearMovements: clearMovements,
    move: move.getValue(),
  }
}