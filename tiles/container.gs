function Container(numRows, numColumns) {
  const defaults = getDefaults()
  const board = defaults.board
  const board_ = defaults.board_
  this.numRows = numRows
  this.numColumns = numColumns
  this.range = board.getRange(defaults.startRow, defaults.startColumn, this.numRows, this.numColumns)
  this.range.setBackground('red')
  
  this.setCurrentRange = function (range){
    this.range = range
  }
  
  this.move = function(rowOffset, columnOffset){
    this.range.setBackground('white')
    this.setCurrentRange(board.getRange(this.range.getRow() + rowOffset, this.range.getColumn() + columnOffset, this.numRows, this.numColumns))
    this.range.setBackground('red')
  }
  
  this.moveDown = function (){
    this.move(1, 0)
  }
  
  this.updatePosition = function(){
    const movements = getMovements()
    if (movements.move == 'a'){
      this.move(0, -1)
    } else if (movements.move == 'd'){
      this.move(0, 1)
    } else if (movements.move == 's'){
      this.move(2, 0)
    }
    movements.clearMovements()
  }
  
  this.getBuffer = function (){
   return board_.getRange(
     this.range.getRow() + this.numRows, 
     this.range.getColumn(),
     1, 
     this.numColumns)
  }
  
  this.hasClearBuffer = function (){
    buffer = this.getBuffer()
    bufferValues = buffer.getValues()[0] // there is always only one row in the buffer
    if(buffer.getRow() > defaults.boardLastRow){ return false }
    for(var r=0; r < bufferValues.length; r++){
      if(bufferValues[r]==1){ return false }
    }
    return true
  }
  
  this.save = function() {
    board_
      .getRange(this.range.getRow(), this.range.getColumn(), numRows, numColumns)
      .setValues(new Array(this.numRows).fill(new Array(this.numColumns).fill(1))) // NOTE: polyfills must be enabled before this succeeds
    
  }
  
}


function test(){
  upgradeRhino()
  Logger.log(new Array(5).fill(new Array(5).fill(1)))
}