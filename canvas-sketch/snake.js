const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  fps: 1,
};

const numSquares = 1;
const blocksPerSquareSide = 9;
const blockSize = 105;
const squareSideSize = blockSize * blocksPerSquareSide;
const blockLineWidth = 10;

class Block {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.next = null;
    this.previous = null;
    this.partOfSnake = false;
    this.freeColor = 'white';
    this.snakeColor = 'red';
    this.strokeStyle = 'lightgray';
  }

  otherNodeIsOnTheLeft(that) {
    return that && 
      that.x == this.x - 1 && 
      that.y == this.y;
  }

  drawLeftSide(context) {
    if (!this.otherNodeIsOnTheLeft(this.previous) && !this.otherNodeIsOnTheLeft(this.next)) { 
      context.strokeStyle = this.strokeStyle;
    } else {
      context.strokeStyle = this.snakeColor;
    }
    context.moveTo(this.x * this.size, this.y * this.size);
    context.lineTo(this.x * this.size, this.y * this.size + this.size);
    context.stroke();
  }

  otherNodeIsOnTheRight(that) {
    return that && 
      that.x == this.x + 1 && 
      that.y == this.y;
  }

  drawRightSide(context) {
    if (!this.otherNodeIsOnTheRight(this.previous) && !this.otherNodeIsOnTheRight(this.next)) { 
      context.strokeStyle = this.strokeStyle;
    } else {
      context.strokeStyle = this.snakeColor;
    }
    context.moveTo(this.x * this.size + this.size, this.y * this.size);
    context.lineTo(this.x * this.size + this.size, this.y * this.size + this.size);
    context.stroke();
  }

  otherNodeIsAbove(that) {
    return that && 
      that.x == this.x && 
      that.y == this.y - 1;
  }

  drawUpperSide(context) {
    if (!this.otherNodeIsAbove(this.previous) && !this.otherNodeIsAbove(this.next)) { 
      context.strokeStyle = this.strokeStyle;
    } else {
      context.strokeStyle = this.snakeColor;
    }
    context.moveTo(this.x * this.size, this.y * this.size);
    context.lineTo(this.x * this.size + this.size, this.y * this.size);
    context.stroke();
  }

  otherNodeIsBelow(that) {
    return that && 
      that.x == this.x && 
      that.y == this.y + 1;
  }

  drawBtoomoSide(context) {
    if (!this.otherNodeIsBelow(this.previous) && !this.otherNodeIsBelow(this.next)) { 
      context.strokeStyle = this.strokeStyle;
    } else {
      context.strokeStyle = this.snakeColor;
    }
    context.moveTo(this.x * this.size, this.y * this.size + this.size);
    context.lineTo(this.x * this.size + this.size, this.y * this.size + this.size);
    context.stroke();
  }


  draw(context) {
    context.lineWidth = blockLineWidth;
    context.strokeStyle = this.strokeStyle;
    context.fillStyle = this.partOfSnake ? this.snakeColor : this.freeColor;
    if (this.partOfSnake) {
      context.beginPath();
      this.drawLeftSide(context);
      this.drawRightSide(context);
      this.drawUpperSide(context);
      this.drawBtoomoSide(context);
      context.fill();
      context.stroke();
    }
  }
}

const blocks = [];
const snakesStart = [];

const sketch = ({context, width, height}) => {
  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);

  for (let i = 0; i < blocksPerSquareSide; i++) {
    for (let j = 0; j < blocksPerSquareSide; j++) {
      const block = new Block(i, j, blockSize);
      blocks.push(block);
    }
  }

  blocks[0].partOfSnake = true;
  snakesStart.push(blocks[0]);

  return ({ context, width, height, frame }) => {
    context.translate(width / 2 - blocksPerSquareSide * blockSize / 2, height / 2 - blocksPerSquareSide * blockSize / 2);
    updateSnakes(context);
    context.save();
    blocks.forEach(block => {
      console.log(block.x, block.y);
      block.draw(context)
    });
    context.restore();
  };
};

const updateSnakes = (context) => {
  const lastSnakeStart = snakesStart[snakesStart.length - 1];
  let lastSnakeBlock = lastSnakeStart;

  while (lastSnakeBlock.next) {
    lastSnakeBlock = lastSnakeBlock.next;
  }

  let availableDirections = ['left', 'right', 'up', 'down'];
  let nextBlock = null;
  let isNextInsideSquare = false;
  let newBlockIndex = null;
  while (availableDirections.length > 0 && !nextBlock) {
    const nextDir = random.pick(availableDirections);
    newBlockIndex = lastSnakeBlock.x * blocksPerSquareSide + lastSnakeBlock.y;
    switch (nextDir) {
      case 'left':
        isNextInsideSquare = lastSnakeBlock.x > 0;
        nextBlockIdx = newBlockIndex - 1;
        break;
      case 'right':
        isNextInsideSquare = lastSnakeBlock.x < blocksPerSquareSide - 1;
        nextBlockIdx = newBlockIndex + 1;
        break;
      case 'up':
        isNextInsideSquare = lastSnakeBlock.y > 0;
        nextBlockIdx = newBlockIndex - blocksPerSquareSide;
        break;
      case 'down':
        isNextInsideSquare = lastSnakeBlock.y < blocksPerSquareSide - 1;
        nextBlockIdx = newBlockIndex + blocksPerSquareSide;
        break;
    }
    if (isNextInsideSquare) {
      const maybeNextBlock = blocks[nextBlockIdx];
      if (maybeNextBlock && !maybeNextBlock.partOfSnake) {
        nextBlock = maybeNextBlock;
      }
    }
    availableDirections.pop(nextDir);
  }

  if (nextBlock) {
    lastSnakeBlock.next = nextBlock;
    nextBlock.previous = lastSnakeBlock;
    nextBlock.partOfSnake = true;
  }
};

canvasSketch(sketch, settings);
