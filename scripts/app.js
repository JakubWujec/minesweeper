function onCanvasClick(event){
  let clickedX = event.pageX - canvasLeft;
  let clickedY = event.pageY - canvasTop;
  let clickedBlock = blocks.filter(block => block.isWithin(clickedX, clickedY))[0];
  if(clickedBlock){
    console.log(event.x, event.y, clickedBlock);
  } else{
    console.log('miss');
  }
}

setCanvas();
canvas.addEventListener('click', onCanvasClick);