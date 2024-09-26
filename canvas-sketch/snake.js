const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  // fps: 1,
};

const squaresRows = 5;
const squaresCols = 5;
const blocksPerSquareSide = 5;
const blockLineWidth = 10;
const speed = 1;

let squares = [];

class Block {

  constructor(x, y, size, idx, arrivingFromDir) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.idx = idx;
    this.used = false;
    this.arrivingFromDir = arrivingFromDir;
  }

  draw(context) {
    context.lineWidth = blockLineWidth;
    context.strokeStyle = 'gray';
    context.fillStyle = 'green';
    if (!this.arrivingFromDir) {
      context.fillStyle = 'blue';
    } 
    context.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);    
    context.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
    context.strokeStyle = 'green';
    switch(this.arrivingFromDir) {
      case 'right': 
        context.moveTo(this.x * this.size, this.y * this.size);
        context.lineTo(this.x * this.size, this.y * this.size + this.size);
        break;
      case 'left': 
        context.moveTo(this.x * this.size + this.size, this.y * this.size);
        context.lineTo(this.x * this.size + this.size, this.y * this.size + this.size);
        break;
      case 'down':
        context.moveTo(this.x * this.size, this.y * this.size);
        context.lineTo(this.x * this.size + this.size, this.y * this.size);
        break;
      case 'up':
        context.moveTo(this.x * this.size, this.y * this.size + this.size);
        context.lineTo(this.x * this.size + this.size, this.y * this.size + this.size);
        break;
    }
    context.stroke()
  }
}

class Square {
  constructor(x, y, size, blocksPerSquareSide) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.blocksPerSquareSide = blocksPerSquareSide;
    this.blocks = [];
    this.used = false;
    this.movingFrom = null;
    this.movingTo = null;
    this.currentBlock = null;
    this.currDir = null;
    this.blockSize = this.size / this.blocksPerSquareSide;
    
  }

  init(context) {
    context.save();
    context.translate(this.x, this.y); 

    for (let i = 0; i < this.blocksPerSquareSide; i++) {
      for (let j = 0; j < this.blocksPerSquareSide; j++) {
        let block = new Block(j, i, this.blockSize, i * this.blocksPerSquareSide + j);
        this.blocks.push(block);
      }
    }

    context.strokeStyle = 'black';
    context.strokeRect(0, 0, this.size, this.size);
    context.restore();
  }

  pickNextBlock() {
    let availableDirections = ['left', 'right', 'up', 'down'];
    let isNextInsideSquare = false;
    let nextBlockIdx = null;

    while (availableDirections.length > 0 && !this.movingTo) {
      let nextDir = random.pick(availableDirections);
      switch (nextDir) {
        case 'up':
          isNextInsideSquare = this.movingFrom.y > 0;
          nextBlockIdx = this.movingFrom.idx - this.blocksPerSquareSide;
          break;
        case 'down':
          isNextInsideSquare = this.movingFrom.y < this.blocksPerSquareSide - 1;
          nextBlockIdx = this.movingFrom.idx + this.blocksPerSquareSide;
          break;
        case 'left':
          isNextInsideSquare = this.movingFrom.x > 0;
          nextBlockIdx = this.movingFrom.idx - 1;
          break;
        case 'right':
          isNextInsideSquare = this.movingFrom.x < this.blocksPerSquareSide - 1;
          nextBlockIdx = this.movingFrom.idx + 1;
          break;       
      }
      if (isNextInsideSquare) {
        const maybeNextBlock = this.blocks[nextBlockIdx];
        if (maybeNextBlock && !maybeNextBlock.used) {
          this.movingTo = maybeNextBlock;
          this.movingTo.arrivingFromDir = nextDir;
          this.currDir = nextDir;
        }
      }
      availableDirections = availableDirections.filter(dir => dir !== nextDir);
    }

  }

  update(context) {
    context.save();
    context.translate(this.x, this.y); 

    if (!this.movingFrom) {
      let availableBlocks = this.blocks.filter(block => !block.used);
      this.movingFrom = random.pick(availableBlocks);
      this.movingFrom.used = true;
      this.movingFrom.isHead = true;
    }
    if (!this.movingTo) {
      this.pickNextBlock();
      this.currentBlock = new Block(this.movingFrom.x, this.movingFrom.y, this.movingFrom.size, this.movingFrom.idx, this.movingFrom.arrivingFromDir, this.movingFrom.isHead);
    } else {
      switch (this.currDir) {
        case 'left':
          this.currentBlock = new Block(this.currentBlock.x - speed, this.currentBlock.y, this.currentBlock.size, this.movingFrom.idx, this.movingFrom.arrivingFromDir);
          break;
        case 'right':
          this.currentBlock = new Block(this.currentBlock.x + speed, this.currentBlock.y, this.currentBlock.size, this.movingFrom.idx, this.movingFrom.arrivingFromDir);
          break;
        case 'up':
          this.currentBlock = new Block(this.currentBlock.x, this.currentBlock.y - speed, this.currentBlock.size, this.movingFrom.idx, this.movingFrom.arrivingFromDir);
          break;
        case 'down':
          this.currentBlock = new Block(this.currentBlock.x, this.currentBlock.y + speed, this.currentBlock.size, this.movingFrom.idx, this.movingFrom.arrivingFromDir);
          break;
      }
    }
    this.currentBlock.draw(context);
    if (this.movingTo) {
      console.log("Moving from", this.movingFrom.x, this.movingFrom.y, "to", this.movingTo.x, this.movingTo.y, "via", this.currentBlock.x, this.currentBlock.y, "dir", this.currDir);
    }
    if (this.movingTo && Math.abs(this.currentBlock.x - this.movingTo.x) <= speed && Math.abs(this.currentBlock.y - this.movingTo.y) <= speed) {
      this.movingFrom = new Block(this.movingTo.x, this.movingTo.y, this.movingTo.size, this.movingTo.idx, this.movingTo.arrivingFromDir);
      this.movingTo.used = true;
      this.movingTo = null;
    }
    context.restore();
  }
}

const sketch = ({context, width, height}) => {

  const squareSideSize = Math.floor(Math.min(width / squaresCols, height / squaresRows));
  const gridX = (width - squareSideSize * squaresCols) / 2;
  const gridY = (height - squareSideSize * squaresRows) / 2;

  const blockSize = squareSideSize / blocksPerSquareSide;

  for (let i = 0; i < squaresCols; i++) {
    for (let j = 0; j < squaresRows; j++) {
      const square = new Square(i * squareSideSize + gridX, j * squareSideSize + gridY, squareSideSize, blocksPerSquareSide);
      squares.push(square);
      square.init(context);
    }
  }

  return ({ context }) => {
    squares.forEach(square => {
        square.update(context);
    });
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