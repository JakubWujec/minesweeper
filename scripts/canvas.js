const canvas = document.querySelector('#canvas');
const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
const canvasTop = canvas.offsetTop + canvas.clientTop;
const width = canvas.width;// 500
const height = canvas.height;// 300

let ROWS = 4;
let COLUMNS = 6;
let BLOCK_SIZE = 20;
let SPACE_BETWEEN = 4;

let blocks = [];

class BlockGUI{
  constructor(x, y, row, col, block_size = BLOCK_SIZE){
    this.x = x;
    this.y = y;
    this.row = row;
    this.col = col;
    this.block_size = block_size;
  }

  isWithin(x, y){
    return (this.x <= x) && (x <= this.x + this.block_size) && (this.y <= y) && (y <= this.y + this.block_size); 
  }
}

function setCanvas(){
  if(canvas.getContext) {
    let ctx = canvas.getContext('2d');
  
    // set fill and stroke styles
    ctx.fillStyle = 'gray';
    ctx.strokeStyle = 'black';
  
    // draw a rectangle with fill and stroke
    for(let row = 0; row < ROWS; row++){
      for(let col = 0; col < COLUMNS; col++){
        let x = SPACE_BETWEEN + col * (BLOCK_SIZE + SPACE_BETWEEN);
        let y = SPACE_BETWEEN + row * (BLOCK_SIZE + SPACE_BETWEEN);
        // x,y,width,height
        ctx.fillRect(
          x,
          y,
          BLOCK_SIZE, 
          BLOCK_SIZE
        );
        ctx.strokeRect(
          x,
          y,
          BLOCK_SIZE, 
          BLOCK_SIZE
        );
        blocks.push(new BlockGUI(x, y, row, col))
      }
    }
  }
}

