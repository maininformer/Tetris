function getOffsetOrBuffer(type, rotation, bOro){
    if(!rotation){rotation = 0}
    rotation = rotation % 360
    
    const up    =  [-1, 0]
    const down  =  [1, 0]
    const right =  [0, 1]
    const left  =  [0, -1]
    const ul    =  [-1, -1]
    const ll    =  [1, -1]
    const lr    =  [1, 1]
    const ur    =  [-1, 1]
    
    const d2  = [2, 0]
    const d2r = [2, 1]
    const d2l = [2, -1]
    
    const offsets = {  // [[cells], [buffers]]
    'i':{0:[[left, right], [ll, down, lr]],        90:[[up, down], [d2]],               180:[[left, right], [ll, down, lr]],     270:[[up, down], [d2]]},
    'j':{0:[[left, right, lr], [ll, down, d2r]],   90:[[up, down, ll], [d2, d2l]],      180:[[right, left, ul], [ll, down, lr]], 270:[[up, down, ur], [right, lr, d2]]},
    'l':{0:[[right, left, ll], [d2l, down, lr]],   90:[[up, down, ul], [left, ll, d2]], 180:[[right, left, ur], [ll, down, lr]], 270:[[up, down, lr], [ll, d2, d2r]]},
    'o':{0:[[left, ll, down], [d2l, d2]],          90:[[left, ll, down], [d2l, d2]],    180:[[left, ll, down], [d2l, d2]],       270:[[left, ll, down], [d2l, d2]]},
    's':{0:[[left, up, ur], [ll, down, right]],    90:[[up, right, lr], [down, d2r]],   180:[[left, up, ur], [ll, down, right]], 270:[[up, right, lr], [down, d2r]]},
    't':{0:[[right, left, down], [ll, d2, lr]],    90:[[left, up, down], [ll, d2]],     180:[[up, right, left], [ll, down, lr]], 270:[[up, down, right], [d2, lr]]},
    'z':{0:[[up, ul, right], [left, down, lr]],    90:[[down, right, ur], [d2l, down]], 180:[[up, ul, right], [left, down, lr]], 270:[[down, right, ur], [d2l, down]]} 
  }
  if (bOro == 'b'){
    return offsets[type][rotation][1]
  } else {
    return offsets[type][rotation][0]
  }
}

function getBufferMappings(type, rotation){
  return getOffsetOrBuffer(type, rotation, 'b')
}

function getOffsets(type, rotation){
    return getOffsetOrBuffer(type, rotation, 'o')
}

function getOriginalStartPoint(type, rotation){
  // the positions from which relative addressing is used for the whole block, left first and then up first corner
  const types = {  
    'i': 3,
    'j': 7,
    'l': 11,
    'o': 15,
    's': 19,
    't': 23,
    'z': 28
  }
  const rotations = {
    0:   3,
    90:  7,
    180: 11,
    270: 15
  }  
  return [types[type], rotations[rotation]]
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
    tileHinge.copyTo(this.hinge)
    getOffsets(this.type, this.rotation)
    .forEach(function(offset){
      const newRange = this.hinge.offset(offset[0], offset[1])
      tileHinge.offset(offset[0], offset[1]).copyTo(newRange)
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
    this.hinge.setBackground('white')
    getOffsets(this.type, this.rotation)
      .map(function(offset){
        this.hinge
          .offset(offset[0], offset[1])
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
    this.clearTile()
    this.rotation = (this.rotation + 90) % 360
    this.pasteTile()
  }
  
  this.updatePosition = function(){
    const movements = getMovements()
    if (movements.move == 'a' && this.hinge.getColumn() + this.getLeftColumnOffset()> defaults.firstColumn){
      this.move(0, -1)
    } else if (movements.move == 'd' && this.hinge.getColumn() + this.getRightColumnOffset() < defaults.lastColumn){
      this.move(0, 1)
    } else if (movements.move == 's' && this.hinge.getRow() > defaults.boardLastRow + 3){ // every 's' moves the block down by 2, we don't want it to move offscreen
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