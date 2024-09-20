const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  // animate: true,
  // fps: 1,
};

const squaresRows = 2;
const squaresCols = 1;
const blocksPerSquareSide = 9;
const blockSize = 105;
const blockLineWidth = 10;

let squares = [];

class Square {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  init(context) {
    context.save();
    context.translate(this.x, this.y); 
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.strokeRect(0, 0, this.size, this.size);
    context.restore();
  }
}

const sketch = ({context, width, height}) => {

  const squareSideSize = Math.floor(Math.min(width / squaresCols, height / squaresRows));
  const gridX = (width - squareSideSize * squaresCols) / 2;
  const gridY = (height - squareSideSize * squaresRows) / 2;

  for (let i = 0; i < squaresRows; i++) {
    for (let j = 0; j < squaresCols; j++) {
      const square = new Square(j * squareSideSize + gridX, i * squareSideSize + gridY, squareSideSize);
      squares.push(square);
      square.init(context);
    }
  }

  return ({ context }) => {
    console.log('drawing');
  };
}

canvasSketch(sketch, settings);

  /* for (let i = 0; i < blocksPerSquareSide; i++) {
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


/* class Square {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.blocks = [];
    this.movingFrom = null;
    this.movingTo = null;
    this.currentBlock = null;
    this.currDir = null;
    this.speed = 0.1;

    for (let i = 0; i < blocksPerSquareSide; i++) {
      for (let j = 0; j < blocksPerSquareSide; j++) {
        let block = new Block(i, j, blockSize);
        this.blocks.push(block);
      }
    }
  }

  update(context) {
    let nextDir = null;
    if (!this.movingFrom) {
      this.movingFrom = random.pick(this.blocks);
      this.movingFrom.partOfSnake = true;
      this.currentBlock = new Block(this.movingFrom.x, this.movingFrom.y, blockSize);
    } else if (!this.movingTo) {
      let availableDirections = ['left', 'right', 'up', 'down'];
      let isNextInsideSquare = false;
      let newBlockIndex = null;
      let nextBlockIdx = null;
      while (availableDirections.length > 0 && !this.movingTo) {
        nextDir = random.pick(availableDirections);
        newBlockIndex = this.movingFrom.x * blocksPerSquareSide + this.movingFrom.y;
        switch (nextDir) {
          case 'left':
            isNextInsideSquare = this.movingFrom.x > 0;
            nextBlockIdx = newBlockIndex - 1;
            break;
          case 'right':
            isNextInsideSquare = this.movingFrom.x < blocksPerSquareSide - 1;
            nextBlockIdx = newBlockIndex + 1;
            break;
          case 'up':
            isNextInsideSquare = this.movingFrom.y > 0;
            nextBlockIdx = newBlockIndex - blocksPerSquareSide;
            break;
          case 'down':
            isNextInsideSquare = this.movingFrom.y < blocksPerSquareSide - 1;
            nextBlockIdx = newBlockIndex + blocksPerSquareSide;
            break;
        }
        if (isNextInsideSquare) {
          const maybeNextBlock = this.blocks[nextBlockIdx];
          if (maybeNextBlock && !maybeNextBlock.partOfSnake) {
            this.movingTo = maybeNextBlock;
          }
        }
        availableDirections.pop(nextDir);
      }

      if (this.movingTo) {
        this.movingFrom.next = this.movingTo;
        this.movingTo.previous = this.movingFrom;
        this.movingTo.partOfSnake = true;
        this.currDir = nextDir;
      }
    }
    if (this.movingTo) {
      switch (this.currDir) {
        case 'left':
          this.currentBlock.x -= this.speed;
          break;
        case 'right':
          this.currentBlock.x += this.speed;
          break;
        case 'up':
          this.currentBlock.y -= this.speed;
          break;
        case 'down':
          this.currentBlock.y += this.speed;
          break;
      }
      if (this.currentBlock.x == this.movingTo.x && this.currentBlock.y == this.movingTo.y) {
        this.movingFrom = this.movingTo;
        this.movingTo = null;
      }
    }
    console.log(this.currDir, 'moving from', this.movingFrom.x, this.movingFrom.y, ' to ', this.movingTo.x, this.movingTo.y, ' via ', this.currentBlock.x, this.currentBlock.y);
    this.currentBlock.draw(context);
  }

  init(context) {
    context.moveTo(this.x, this.y); 
    context.fillStyle = 'white';
    context.fillRect(this.x, this.y, this.size, this.size);
  }
}

class Block {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.previous = null;
    this.next = null;
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

  drawBottomSide(context) {
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
    context.beginPath();
    this.drawLeftSide(context);
    this.drawRightSide(context);
    this.drawUpperSide(context);
    this.drawBottomSide(context);
    context.fill();
    context.stroke();
  }
}

const blocks = [];
const snakesStart = [];

const sketch = ({context, width, height}) => {
  const squares = new Square(0, 0, width);
  squares.init(context);

  return ({ context }) => {
    // context.translate(width / 2 - blocksPerSquareSide * blockSize / 2, height / 2 - blocksPerSquareSide * blockSize / 2);
    // context.save();
    squares.update(context);
    // context.restore();
  };

  /* for (let i = 0; i < blocksPerSquareSide; i++) {
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
*/