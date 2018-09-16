function start(){
  const tiles = ['i', 'j', 'l', 'o', 's', 't', 'z']
    
  function getRowSums(){
    return defaults
    .board_
    .getRange(
      defaults.window.getRow(),
      defaults.window.getColumn(),
      defaults.window.getNumRows(),
      defaults.window.getNumColumns())
    .getValues()
    .map(function(row){
      return row
        .filter(function(a){ return a !== '' })
        .reduce(function(a, b){ return a + b}, 0)
    })
  }
  
  upgradeRhino()
  const defaults = getDefaults()
  defaults.window.clear()
  defaults.window_.clear()
  defaults.score.setValue(0)
  const numColumns = defaults.window.getNumColumns()
  
  while(true){
    // get a block:Container
    block = new Container(tiles[Math.floor(Math.random() * tiles.length)])
    while(block.hasClearBuffer()){
      // move it down every T seconds
      Utilities.sleep(1000)
      block.updatePosition()
      block.moveDown()
      SpreadsheetApp.flush()
      // after stop, get range and put 1s in the shadow boards range
    }
    block.save()
    
    // check the rows sums
    getRowSums()
      .forEach(function(rowSum, rowIndex){ // add the offset index to the rowIndexes
        if (rowSum == numColumns){
          var index = rowIndex + defaults.window.getRow()
          animate(index)
          moveTheTilesDown(index)
        }
      })
  }
}


function animate(row){
  const defaults = getDefaults()
  const windowColumns = defaults.window.getNumColumns()
  
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
  defaults.score.setValue(defaults.score.getValue() + defaults.scoreIncrement)
}

function moveTheTilesDown(rowIndex){
  const defaults = getDefaults()
  const board = defaults.board
  const board_ = defaults.board_
  const beginningRow = defaults.window.getRow()
  const beginningCol = defaults.window.getColumn()
  const numRowsBefore = rowIndex - beginningRow
  const numRowsAfter = rowIndex - beginningRow + 1
  const numCols = defaults.window.getNumColumns()
  const emptyRow = new Array(defaults.window.getNumColumns()).fill("")
  
  
  var newRangeBoard = board.getRange(beginningRow, beginningCol, numRowsBefore, numCols).getBackgrounds()
  var newRangeBoard_ = board_.getRange(beginningRow, beginningCol, numRowsBefore, numCols).getValues()
  newRangeBoard.unshift(emptyRow)
  newRangeBoard_.unshift(emptyRow)
  
  board.getRange(beginningRow, beginningCol, numRowsAfter, numCols).setBackgrounds(newRangeBoard)
  board_.getRange(beginningRow, beginningCol, numRowsAfter, numCols).setValues(newRangeBoard_)
    
}