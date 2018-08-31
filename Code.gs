function start(){
  const tiles = ['i', 'j', 'l', 'o', 's', 't', 'z']
    
  function getRowSum(){
    return defaults
    .board_
    .getRange(
      block.range.getRow(),
      defaults.window.getColumn(),
      1,
      defaults.window.getNumColumns())
    .getValues()[0]
    .filter(function(a){ return a !== '' })
    .reduce(function(a, b){ return a + b}, 0)
  }
  
  upgradeRhino()
  const defaults = getDefaults()
  defaults.window.clear()
  defaults.window_.clear()
  const numColumns = defaults.window.getNumColumns()
  
  while(true){
    // get a block:Container
    block = new Container(tiles[Math.floor(Math.random() * tiles.length)])
    while(block.hasClearBuffer()){
      // move it down every T seconds
      Utilities.sleep(750)
      block.updatePosition()
      block.moveDown()
      SpreadsheetApp.flush()
      // after stop, get range and put 1s in the shadow boards range
    }
    block.save()
    
    // check this row
    var rowSum = getRowSum()
    if(rowSum == numColumns){
     animate()
     // copy paste formatting on the board and board_
     moveTheTilesDown(block)      
    }

    
  }
}


function animate(){
  const defaults = getDefaults()
  const windowColumns = defaults.window.getNumColumns()
  const row = block.range.getRow()
  
  var animationRange = defaults.board.getRange(row, defaults.window.getColumn(), 1, windowColumns)
  const colorArray = animationRange.getBackgrounds()
  animationRange.setBackgrounds(colorArray)
  for(var i=0; i < windowColumns/2; i++){
    colorArray[0][i] = 'white'
    colorArray[0][windowColumns -1 - i] = 'white'
    animationRange.setBackgrounds(colorArray)
    Utilities.sleep(100)
    SpreadsheetApp.flush()
  }
}

function moveTheTilesDown(block){
  const defaults = getDefaults()
  const board = defaults.board
  const board_ = defaults.board_
  const beginningRow = defaults.window.getRow()
  const beginningCol = defaults.window.getColumn()
  const numRowsBefore = block.range.getRow() - beginningRow
  const numRowsAfter = block.range.getRow() - beginningRow + 1
  const numCols = defaults.window.getNumColumns()
  const emptyRow = new Array(defaults.window.getNumColumns()).fill("")
  
  
  var newRangeBoard = board.getRange(beginningRow, beginningCol, numRowsBefore, numCols).getBackgrounds()
  var newRangeBoard_ = board_.getRange(beginningRow, beginningCol, numRowsBefore, numCols).getValues()
  newRangeBoard.unshift(emptyRow)
  newRangeBoard_.unshift(emptyRow)
  
  board.getRange(beginningRow, beginningCol, numRowsAfter, numCols).setBackgrounds(newRangeBoard)
  board_.getRange(beginningRow, beginningCol, numRowsAfter, numCols).setValues(newRangeBoard_)
    
}