function start(){
  
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
  
  while(true){
    // get a block:Container
    block = new Container(1, 3)
    while(block.hasClearBuffer()){
      // move it down every 2 seconds
      Utilities.sleep(750)
      block.updatePosition()
      block.moveDown()
      SpreadsheetApp.flush()
      // after stop, get range and put 1s in the shadow boards range
    }
    block.save()
    
    // check this row
    var rowSum = getRowSum()
    if(rowSum == 15){
      animate()
     // copy paste formatting on the board and board_
      
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

