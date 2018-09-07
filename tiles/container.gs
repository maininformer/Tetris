// TODO: if the buffer is not clear, copy the buffer, paste the block, paste the copied buffer, where this blocks buffer offset row is < 2
// The side way moves of the blocks will still be broken

function getBufferMappings(type, rotation){
  if(!rotation){rotation = 0}
  rotation = rotation % 360
  const mappings =  {  // define a buffer for each cell; there are at most 3 bottom cells in each block
    'i':{0:[[3, 0], [3, 1], [3, 2]], 90:[[3, 1]],         180:[[3, 0], [3, 1], [3, 2]], 270:[[3, 1]]},
    'j':{0:[[2, 0], [2, 1], [3, 2]], 90:[[3, 0], [3, 1]], 180:[[3, 0], [3, 1], [3, 2]], 270:[[3, 1]]},
    'l':{0:[[3, 0]],                 90:[[3, 1], [3, 2]], 180:[[3, 0], [3, 1], [3, 2]], 270:[[3, 1]]}, 
    'o':{0:[[3, 0], [3, 1]],         90:[[3, 0], [3, 1]], 180:[[3, 0], [3, 1]],         270:[[3, 0], [3, 1]]},
    's':{0:[[3, 0], [3, 1], [2, 2]], 90:[[2, 0], [3, 1]], 180:[[3, 0], [3, 1], [2, 2]], 270:[[2, 0], [3, 1]]},
    't':{0:[[2, 0], [3, 1], [2, 2]], 90:[[3, 0], [2, 2]], 180:[[3, 0], [3, 1], [3, 2]], 270:[[2, 0], [3, 1]]},
    'z':{0:[[2, 0], [3, 1], [3, 2]], 90:[[3, 0], [2, 1]], 180:[[2, 0], [3, 1], [3, 2]], 270:[[3, 0], [2, 1]]}
  }
  return mappings[type][rotation]
}

function getType(type, rotation){
  if(!rotation){rotation = 0}
  rotation = rotation % 360
  const mappings =  {
    'i':{0:['B4:D4'],              90:['G2:G4'],              180:['J4:L4'],                270:['O2:O4']},
    'j':{0:['B7:D7', 'D8:D8'],     90:['F8:F8','G6:G8'],      180:['J7:J7','J8:L8'],        270:['O6:O8', 'P6:P6']},
    'l':{0:['B12:B12', 'B11:D11'], 90:['G10:G12', 'H12:H12'], 180:['J12:L12', 'L11:L11'],   270:['O10:O12', 'N10:N10']},
    'o':{0:['B15:C15', 'B16:C16'], 90:['F15:G15', 'F16:G16'], 180:['J15:K15', 'J16:K16'],   270:['N15:O15','N16:O16']},
    's':{0:['C19:D19', 'B20:C20'], 90:['F18:F19', 'G19:G20'], 180:['K19:L19', 'J20:K20'],   270:['N18:N19', 'O19:O20']},
    't':{0:['B23:D23', 'C24:C24'], 90:['G22:G24', 'H23:H23'], 180:['J24:L24', 'K23:K23'],   270:['O22:O24', 'N23:N23']},
    'z':{0:['C19:D19', 'B20:C20'], 90:['F18:F19', 'G19:G20'], 180:['K19:L19', 'J20:K20'],   270:['N18:N19', 'O19:O20']}
  }
  
  const ranges = mappings[type][rotation].map(function(r){return SpreadsheetApp.getActive().getSheetByName('Tiles').getRange(r)})
  return ranges
}


function Container(type) {
  const defaults = getDefaults()
  const board = defaults.board
  const board_ = defaults.board_
  // TODO: this range should be gotten from a function for each shape -- start with the upper left corner of every shape
  // get the relative ranges, or range addressing, then put it on the Tiles for copying and on the board for pasting
  this.numRows = 3
  this.numColumns = 3
  this.range = board.getRange(defaults.startRow, defaults.startColumn, this.numRows, this.numColumns)
  this.rotation = 0
  this.type = type
  
  getType(this.type, this.rotation).forEach(function(r){r.copyTo(this.range)}.bind(this))
  
  this.setCurrentRange = function (range){
    this.range = range
  }
  
  this.getColumnOffset = function (side){
    return {
      'i':{0:{'right': 2, 'left':0},   90:{'right': 1, 'left':1},   180:{'right': 2, 'left':0},   270:{'right': 1, 'left':1}},
      'j':{0:{'right': 2, 'left':0},   90:{'right': 1, 'left':0},   180:{'right': 2, 'left':0},   270:{'right': 2, 'left':1}},
      'l':{0:{'right': 2, 'left':0},   90:{'right': 2, 'left':1},   180:{'right': 2, 'left':0},   270:{'right': 1, 'left':0}},
      'o':{0:{'right': 1, 'left':0},   90:{'right': 1, 'left':0},   180:{'right': 1, 'left':0},   270:{'right': 1, 'left':0}},
      's':{0:{'right': 2, 'left':0},   90:{'right': 1, 'left':0},   180:{'right': 2, 'left':0},   270:{'right': 1, 'left':0}},
      't':{0:{'right': 2, 'left':0},   90:{'right': 2, 'left':1},   180:{'right': 2, 'left':0},   270:{'right': 1, 'left':0}},
      'z':{0:{'right': 2, 'left':0},   90:{'right': 1, 'left':0},   180:{'right': 2, 'left':0},   270:{'right': 1, 'left':0}}
    }[this.type][this.rotation][side]
  }
  
  this.getRightColumnOffset = function(){
    return this.getColumnOffset('right')
  }
  
  this.getLeftColumnOffset = function(){
    return this.getColumnOffset('left')
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
    if (movements.move == 'a' && this.range.getColumn() + this.getLeftColumnOffset()> defaults.firstColumn){
      this.move(0, -1)
    } else if (movements.move == 'd' && this.range.getColumn() + this.getRightColumnOffset() < defaults.lastColumn){
      this.move(0, 1)
    } else if (movements.move == 's' && this.range.getRow() > defaults.boardLastRow + 3){ // every 's' moves the block down by 2, we don't want it to move offscreen
      this.move(2, 0)
    } else if (movements.move == 'w'){
      this.rotate()
    }
    movements.clearMovements()
  }
  
  this.getBuffers = function (){
   const buffers = []
   const addresses = getBufferMappings(this.type, this.rotation)
   const range = this.range
   return addresses.map(function(address){
     return board_.getRange(
       range.getRow() + address[0], // rows offset 
       range.getColumn() + address[1], // column offset
       1, 
       1)   
   })
  }
  
  this.hasClearBuffer = function (){
    buffers = this.getBuffers()
    for(var i=0; i<buffers.length; i++){
      buffer = buffers[i]
      bufferValues = buffer.getValues()[0] // there is always only one row in the buffer
      if(buffer.getRow() > defaults.boardLastRow){ return false }
      for(var r=0; r < bufferValues.length; r++){
        if(bufferValues[r]==1){ return false }
      }
      return true
    }
  }
  
  this.save = function() {
    var colorPattern = board
      .getRange(this.range.getRow(), this.range.getColumn(), this.numRows, this.numColumns)
      .getBackgrounds()
      .map(function(row){
        return row.map(function(cell){
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