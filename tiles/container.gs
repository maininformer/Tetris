function getType(type, rotation){
  if(!rotation){rotation = 0}
  rotation = rotation % 360
  const mappings =  {
    'i':{0:'B2:D4',   90:'F2:H4',   180:'J2:L4',   270:'N2:P4'},
    'j':{0:'B6:D8',   90:'F6:H8',   180:'J6:L8',   270:'N2:P8'},
    'l':{0:'B10:D12', 90:'F10:H12', 180:'J10:L12', 270:'N10:P12'},
    'o':{0:'B14:D16', 90:'F14:H16', 180:'J14:L16', 270:'N14:P16'},
    's':{0:'B18:D20', 90:'F18:H20', 180:'J18:L20', 270:'N18:P20'},
    't':{0:'B22:D24', 90:'F22:H24', 180:'J22:L24', 270:'N22:P24'},
    'z':{0:'B26:D28', 90:'F26:H28', 180:'J26:L28', 270:'N26:P28'}
  }
  return SpreadsheetApp.getActive().getSheetByName('Tiles').getRange(mappings[type][rotation])
}

function Container(type) {
  const defaults = getDefaults()
  const board = defaults.board
  const board_ = defaults.board_
  this.numRows = 3
  this.numColumns = 3
  this.range = board.getRange(defaults.startRow, defaults.startColumn, this.numRows, this.numColumns)
  this.rotation = 0
  this.type = type
  getType(this.type, this.rotation).copyTo(this.range)
  
  this.setCurrentRange = function (range){
    this.range = range
  }
  
  this.move = function(rowOffset, columnOffset){
    this.range.setBackground('white')
    this.setCurrentRange(board.getRange(this.range.getRow() + rowOffset, this.range.getColumn() + columnOffset, this.numRows, this.numColumns))
    getType(this.type, this.rotation).copyTo(this.range)
  }
  
  this.moveDown = function (){
    this.move(1, 0)
  }
  
  this.rotate = function(){
    this.rotation = this.rotation + 90
    getType(this.type, this.rotation).copyTo(this.range)
  }
  
  this.updatePosition = function(){
    const movements = getMovements()
    if (movements.move == 'a' && this.range.getColumn() > defaults.firstColumn){
      this.move(0, -1)
    } else if (movements.move == 'd' && this.range.getColumn() + defaults.blockSize < defaults.lastColumn){
      this.move(0, 1)
    } else if (movements.move == 's' && this.range.getRow() > defaults.boardLastRow + 3){ // every 's' moves the block down by 2, we don't want it to move offscreen
      this.move(2, 0)
    } else if (movements.move == 'w'){
      this.rotate()
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
    var colorPattern = board
      .getRange(this.range.getRow(), this.range.getColumn(), this.numRows, this.numColumns)
      .getBackgrounds()
      .map(function(row){
        return row.map(function(cell){
          Logger.log(cell)
          if(cell == '#ffffff'){
            return ''
          } else {
            return 1
          }
        })
      })
    board_
      .getRange(this.range.getRow(), this.range.getColumn(), this.numRows, this.numColumns)
      .setValues(colorPattern)
    
  }
  
}