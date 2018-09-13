function getBufferMappings(type, rotation){
  if(!rotation){rotation = 0}
  rotation = rotation % 360
  const mappings =  {  // [rowOffset, colOffset] from the hinge
    'i':{0:[[1, 0], [1, 1], [1, 2]], 90:[[3, 0]],         180:[[1, 0], [1, 1], [1, 2]], 270:[[3, 0]]},
    'j':{0:[[1, 0], [1, 1], [2, 2]], 90:[[3, -1], [3, 0]],180:[[2, 0], [2, 1], [2, 2]], 270:[[3, 0],[1, 1]]},
    'l':{0:[[2, 0], [1, 1], [1, 2]], 90:[[3, 0], [3, 1]], 180:[[1, 0], [1, 1], [1, 2]], 270:[[1, 0], [3, 1]]}, 
    'o':{0:[[2, 0], [2, 1]],         90:[[2, 0], [2, 1]], 180:[[2, 0], [2, 1]],         270:[[2, 0], [2, 1]]},
    's':{0:[[2, -1], [2, 0], [2, 1]],90:[[2, 0], [3, 1]], 180:[[2, -1], [2, 0], [2, 1]],270:[[2, 0], [3, 1]]},
    't':{0:[[1, 0], [2, 1], [1, 2]], 90:[[3, 0], [2, 1]], 180:[[1, 0], [1, 1], [1, 2]], 270:[[3, -1], [3, 0]]},
    'z':{0:[[1, 0], [2, 1], [2, 2]], 90:[[2, 0], [1, 1]], 180:[[1, 0], [2, 1], [2, 2]], 270:[[2, 0], [1, 1]]}
  }
  return mappings[type][rotation]
}

function getOffsets(type, rotation){
    const offsets = {  // [rowOffset, colOffset, numRows, numCols]
    'i':{0:[[0, 0, 1, 3]],                90:[[0, 0, 3, 1]],                 180:[[0, 0, 1, 3]],                  270:[[0, 0, 3, 1]]},
    'j':{0:[[0, 0, 1, 3], [1, 2, 1, 1]],  90:[[0, 0, 1, 1], [-2, 1, 3, 1]],  180:[[0, 0, 1, 1], [1, 0, 1, 3]],    270:[[0, 1, 1, 1], [0, 0, 3, 1]]},  // TODO: fill the rest
    'l':{0:[[1, 0, 1, 1], [0, 0, 1, 3]],  90:[[0, 0, 3, 1], [2, 1, 1, 1]],   180:[[0, 0, 1, 3], [-1, 2, 1, 1]],   270:[[0, 0, 1, 1], [0, 1, 3, 1]]},
    'o':{0:[[0, 0, 2, 2]],                90:[[0, 0, 2, 2]],                 180:[[0, 0, 2, 2]],                  270:[[0, 0, 2, 2]]},
    's':{0:[[0, 0, 1, 2], [1, -1, 1, 2]], 90:[[0, 0, 2, 1], [1, 1, 2, 1]],   180:[[0, 0, 1, 2], [1, -1, 1, 2]],   270:[[0, 0, 2, 1], [1, 1, 2, 1]]},
    't':{0:[[0, 0, 1, 3], [1, 1, 1, 1]],  90:[[0, 0, 3, 1], [1, 1, 1, 1]],   180:[[0, 0, 1, 3], [-1, 1, 1, 1]],   270:[[0, 0, 3, 1], [1, -1, 1, 1]]},
    'z':{0:[[0, 0, 1, 2], [1, 1, 1, 2]],  90:[[0, 0, 2, 1], [1, -1, 2, 1]],  180: [[0, 0, 1, 2], [1, 1, 1, 2]],   270:[[0, 0, 2, 1], [1, -1, 2, 1]]}
  }
  return offsets[type][rotation]
}


function getOriginalStartPoint(type, rotation){
  // the positions from which relative addressing is used for the whole block, left first and then up first corner
  const originalHinges = {  // [row, column]
    'i':{0:[4, 2],  90:[2, 7],  180:[4, 10],    270:[2, 15]},
    'j':{0:[7, 2],  90:[6, 7],  180:[7, 10],    270:[6, 15]},
    'l':{0:[11, 2], 90:[10, 7], 180:[12, 10],   270:[10, 15]},
    'o':{0:[15, 2], 90:[15, 6], 180:[15, 10],   270:[15, 14]},
    's':{0:[19, 3], 90:[18, 6], 180:[19, 11],   270:[18, 14]},
    't':{0:[23, 2], 90:[22, 7], 180:[24, 11],   270:[22, 15]},
    'z':{0:[27, 2], 90:[26, 7], 180:[27, 2],    270:[26, 7]}
  }
  
  return originalHinges[type][rotation]
}


function Container(type) {
  const defaults = getDefaults()
  const board = defaults.board
  const board_ = defaults.board_
  const tiles = defaults.tiles
  this.hinge = board.getRange(defaults.startRow, defaults.startColumn, 1, 1)
  this.rotation = 0
  this.type = type
  
  this.pasteTile= function(){
    // Copy a tile from tileHinge, using offsets, to this.hinge using same offsets
    const tileHinge = tiles.getRange(getOriginalStartPoint(this.type, this.rotation)[0], getOriginalStartPoint(this.type, this.rotation)[1])  
    getOffsets(this.type, this.rotation)
    .forEach(function(offset){
      const newRange = this.hinge.offset(offset[0], offset[1], offset[2], offset[3])
      tileHinge.offset(offset[0], offset[1], offset[2], offset[3]).copyTo(newRange)
    }, this)
  }

  this.pasteTile()
  this.setHinge = function (hinge){
    this.hinge = hinge
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
  
  this.clearTile = function(){
    getOffsets(this.type, this.rotation)
      .map(function(offset){
        this.hinge
          .offset(offset[0], offset[1], offset[2], offset[3])
          .setBackground('white') 
      }, this)
  }
  
  this.move = function(rowOffset, columnOffset){
    this.clearTile()
    this.setHinge(board.getRange(this.hinge.getRow() + rowOffset, this.hinge.getColumn() + columnOffset))
    this.pasteTile()
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
   const hinge = this.hinge
   return addresses.map(function(address){
     offset = hinge.offset(address[0], address[1])
     return board_.getRange(
       offset.getRow(),   // rows offset 
       offset.getColumn() // column offset
     )   
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