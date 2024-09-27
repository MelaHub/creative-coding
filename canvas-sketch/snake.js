const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const colormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  canvas: document.getElementById('snake'),
};

const squaresRows = 5;
const squaresCols = 5;
const blocksPerSquareSide = 10;
const blockLineWidth = 7;
const speed = 1;

const colors = colormap({
  colormap: 'rainbow-soft',
});

let squares = [];

class Block {

  constructor(x, y, size, idx, arrivingFromDir, fillColor) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.idx = idx;
    this.used = false;
    this.arrivingFromDir = arrivingFromDir;
    this.fillColor = fillColor;
  }

  draw(context) {
    context.beginPath();
    context.lineWidth = blockLineWidth;
    context.strokeStyle = 'white';
    context.fillStyle = this.fillColor;
    context.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);    
    context.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
    context.strokeStyle = this.fillColor;
    switch(this.arrivingFromDir) {
      case 'right': 
        context.moveTo(this.x * this.size, this.y * this.size + blockLineWidth / 2);
        context.lineTo(this.x * this.size, this.y * this.size + this.size - blockLineWidth / 2);
        break;
      case 'left': 
        context.moveTo(this.x * this.size + this.size, this.y * this.size + blockLineWidth / 2);
        context.lineTo(this.x * this.size + this.size, this.y * this.size + this.size - blockLineWidth / 2);
        break;
      case 'down':
        context.moveTo(this.x * this.size + blockLineWidth / 2, this.y * this.size);
        context.lineTo(this.x * this.size + this.size - blockLineWidth / 2, this.y * this.size);
        break;
      case 'up':
        context.moveTo(this.x * this.size + blockLineWidth / 2, this.y * this.size + this.size);
        context.lineTo(this.x * this.size + this.size - blockLineWidth / 2, this.y * this.size + this.size);
        break;
    }
    context.stroke();
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
      if (availableBlocks.length > 0) {
        this.movingFrom = random.pick(availableBlocks);
        this.movingFrom.used = true;
        this.movingFrom.fillColor = random.pick(colors);
      }
    }

    if (this.movingFrom) {
      if (!this.movingTo) {
        this.pickNextBlock();
        this.currentBlock = new Block(this.movingFrom.x, this.movingFrom.y, this.movingFrom.size, this.movingFrom.idx, this.movingFrom.arrivingFromDir, this.movingFrom.fillColor);
      } else {
        const updateBlockPosition = (direction, speed, currentBlock, movingFrom) => {
          switch (direction) {
            case 'left':
              return new Block(currentBlock.x - speed, currentBlock.y, currentBlock.size, movingFrom.idx, movingFrom.arrivingFromDir);
            case 'right':
              return new Block(currentBlock.x + speed, currentBlock.y, currentBlock.size, movingFrom.idx, movingFrom.arrivingFromDir);
            case 'up':
              return new Block(currentBlock.x, currentBlock.y - speed, currentBlock.size, movingFrom.idx, movingFrom.arrivingFromDir);
            case 'down':
              return new Block(currentBlock.x, currentBlock.y + speed, currentBlock.size, movingFrom.idx, movingFrom.arrivingFromDir);
            default:
              return currentBlock;
          }
        };

        this.currentBlock = updateBlockPosition(this.currDir, speed, this.currentBlock, this.movingFrom);
      }

      this.currentBlock.draw(context);

      if (this.movingTo) {
        console.log("Moving from", this.movingFrom.x, this.movingFrom.y, "to", this.movingTo.x, this.movingTo.y, "via", this.currentBlock.x, this.currentBlock.y, "dir", this.currDir);
      } else {
        this.movingFrom = null;
      }

      if (this.movingTo && Math.abs(this.currentBlock.x - this.movingTo.x) <= speed && Math.abs(this.currentBlock.y - this.movingTo.y) <= speed) {
        this.movingFrom = new Block(this.movingTo.x, this.movingTo.y, this.movingTo.size, this.movingTo.idx, this.movingTo.arrivingFromDir, this.movingFrom.fillColor);
        this.movingTo.used = true;
        this.movingTo = null;
      }
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
