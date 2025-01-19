class Grid {
  constructor(gridSystem, gridWidth, gridGap) {
    this.gridSystem = gridSystem;
    this.gridWidth = gridWidth;
    this.gridGap = gridGap;
    this.displayGrid();
  }

  displayGrid() {
    const screenWidth = window.innerWidth;
    if (this.gridWidth > screenWidth) {
      this.gridGap = screenWidth / 1920 * this.gridGap;
      this.gridWidth = (this.gridWidth / 1920) * screenWidth;
    }

    if (this.gridGap > this.gridWidth / this.gridSystem) {
      this.gridGap = (this.gridWidth / this.gridSystem) * 0.2;
    }

    let existingGrid = document.getElementById('grid');
    if (existingGrid) {
      document.body.removeChild(existingGrid);
    }

    let oneGrid = this.gridWidth / this.gridSystem;
    let oneGapPercent = this.gridGap / oneGrid;
    let grid = document.createElement('div');
    grid.id = 'grid';
    grid.style.position = 'fixed';
    grid.style.top = '0';
    grid.style.left = `50%`;
    grid.style.transform = 'translateX(-50%)';
    grid.style.width = `${this.gridWidth}px`;
    grid.style.height = '100%';
    grid.style.pointerEvents = 'none';
    grid.style.zIndex = '9998';
    grid.style.backgroundSize = `${100 / this.gridSystem + 100 / this.gridSystem * oneGapPercent / this.gridSystem}% 100%`;
    grid.style.backgroundImage = `linear-gradient(to right, rgb(160 0 0 / 10%) 0, rgb(160 0 0 / 10%) ${100 - oneGapPercent * 100}%, transparent ${100 - oneGapPercent * 100}%, transparent 100%)`;
    document.body.appendChild(grid);
  }
}

class LineSegment {
  constructor(x1, y1, x2, y2, shiftPressed) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.shiftPressed = shiftPressed;
    this.drawLine();
  }

  drawLine() {
    let line = document.createElement('div');
    line.className = 'line';
    document.body.appendChild(line);

    if (this.shiftPressed) {
      if (Math.abs(this.x2 - this.x1) > Math.abs(this.y2 - this.y1)) {
        this.y2 = this.y1;
      } else {
        this.x2 = this.x1;
      }
    }

    let length = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2));
    line.style.width = `${length}px`;
    line.style.left = `${this.x1}px`;
    line.style.top = `${this.y1}px`;

    let angle = Math.atan2(this.y2 - this.y1, this.x2 - this.x1) * (180 / Math.PI);
    line.style.transform = `rotate(${angle}deg)`;

    let lengthLabel = document.createElement('span');
    lengthLabel.className = 'length-label';
    lengthLabel.innerText = `${Math.round(length)}px`;
    line.appendChild(lengthLabel);
  }
}

class GridManager {
  constructor() {
    if (!GridManager.instance) {
      this.grid = null;
      GridManager.instance = this;
    }
    return GridManager.instance;
  }

  showGrid(gridSystem, gridWidth, gridGap) {
    this.grid = new Grid(gridSystem, gridWidth, gridGap);
  }

  hideGrid() {
    let existingGrid = document.getElementById('grid');
    if (existingGrid) {
      document.body.removeChild(existingGrid);
    }
    this.grid = null;
  }

  updateGrid(gridSystem, gridWidth, gridGap) {
    if (this.grid) {
      this.grid.gridSystem = gridSystem;
      this.grid.gridWidth = gridWidth;
      this.grid.gridGap = gridGap;
      this.grid.displayGrid();
    } else {
      this.showGrid(gridSystem, gridWidth, gridGap);
    }
  }
}

const gridManager = new GridManager();

class LineSegmentManager {
  constructor() {
    this.lineSegments = [];
    this.selectedLineSegment = null;
  }

  addLineSegment(x1, y1, x2, y2, shiftPressed) {
    const lineSegment = new LineSegment(x1, y1, x2, y2, shiftPressed);
    this.lineSegments.push(lineSegment);
  }

  selectLineSegment(index) {
    if (index >= 0 && index < this.lineSegments.length) {
      this.selectedLineSegment = this.lineSegments[index];
      return this.selectedLineSegment;
    }
    return null;
  }

  selectLineSegmentByPosition(x, y) {
    let closestLineSegment = null;
    let minDistance = 15;

    this.lineSegments.forEach(lineSegment => {
      const distance = this.getDistanceToLineSegment(lineSegment, x, y);
      if (distance < minDistance) {
        minDistance = distance;
        closestLineSegment = lineSegment;
      }
    });

    if (closestLineSegment) {
      this.selectedLineSegment = closestLineSegment;
      this.highlightLineSegment(closestLineSegment);
    }

    return closestLineSegment;
  }

  getDistanceToLineSegment(lineSegment, x, y) {
    const { x1, y1, x2, y2 } = lineSegment;
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = len_sq !== 0 ? dot / len_sq : -1;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  highlightLineSegment(lineSegment) {
    const lineElements = document.getElementsByClassName('line');
    for (let i = 0; i < lineElements.length; i++) {
      lineElements[i].classList.remove('highlighted');
    }

    const index = this.lineSegments.indexOf(lineSegment);
    if (index !== -1) {
      lineElements[index].classList.add('highlighted');
    }
  }

  deleteLineSegment(index) {
    if (index >= 0 && index < this.lineSegments.length) {
      const lineSegment = this.lineSegments[index];
      document.body.removeChild(lineSegment);
      this.lineSegments.splice(index, 1);
    }
  }

  updateLineSegment(index, x1, y1, x2, y2, shiftPressed) {
    if (index >= 0 && index < this.lineSegments.length) {
      const lineSegment = this.lineSegments[index];
      lineSegment.x1 = x1;
      lineSegment.y1 = y1;
      lineSegment.x2 = x2;
      lineSegment.y2 = y2;
      lineSegment.shiftPressed = shiftPressed;
      lineSegment.drawLine();
    }
  }
}

const lineSegmentManager = new LineSegmentManager();

let ruler = document.createElement('div');
ruler.id = 'ruler';
document.body.appendChild(ruler);

let horizontalLine = document.createElement('div');
horizontalLine.id = 'horizontal-line';
document.body.appendChild(horizontalLine);

let startX, startY, endX, endY;
let isDrawing = false;
let shiftPressed = false;
let drawingEnabled = true;
let tempLine = null;
let snappingEnabled = false;
let snappingRange = 10;
let snapDot = null;

chrome.storage.local.get(['drawingEnabled', 'snappingEnabled', 'snappingRange'], (result) => {
  drawingEnabled = result.drawingEnabled !== undefined ? result.drawingEnabled : true;
  snappingEnabled = result.snappingEnabled !== undefined ? result.snappingEnabled : false;
  snappingRange = result.snappingRange !== undefined ? result.snappingRange : 10;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'toggleDrawing') {
    drawingEnabled = message.drawingEnabled;
    sendResponse({ status: 'success' });
  } else if (message.type === 'toggleSnapping') {
    snappingEnabled = message.snappingEnabled;
    sendResponse({ status: 'success' });
  } else if (message.type === 'updateSnappingRange') {
    snappingRange = message.snappingRange;
    sendResponse({ status: 'success' });
  } else if (message.type === 'updateGrid') {
    gridManager.updateGrid(message.gridSystem, message.gridWidth, message.gridGap);
    sendResponse({ status: 'success' });
  }
});

document.addEventListener('mousemove', (e) => {
  horizontalLine.style.top = `${e.clientY}px`;
  if (isDrawing && tempLine) {
    updateTempLine(e.clientX, e.clientY);
  }
  if (snappingEnabled) {
    updateSnapDot(e.clientX, e.clientY);
  }
});

document.addEventListener('mousedown', (e) => {
  if (!drawingEnabled) return;
  startX = e.clientX + window.scrollX;
  startY = e.clientY + window.scrollY;
  isDrawing = true;
  createTempLine(startX, startY);
});

document.addEventListener('mouseup', (e) => {
  if (!drawingEnabled) return;
  if (isDrawing) {
    endX = e.clientX + window.scrollX;
    endY = e.clientY + window.scrollY;
    if (snappingEnabled) {
      const snapPosition = getSnapPosition(endX, endY);
      endX = snapPosition.x;
      endY = snapPosition.y;
    }
    lineSegmentManager.addLineSegment(startX, startY, endX, endY, shiftPressed);
    isDrawing = false;
    removeTempLine();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Shift') {
    shiftPressed = true;
  }
  if (e.key === 'Backspace' || e.key === 'Delete') {
    if (lineSegmentManager.selectedLineSegment) {
      const index = lineSegmentManager.lineSegments.indexOf(lineSegmentManager.selectedLineSegment);
      if (index !== -1) {
        lineSegmentManager.deleteLineSegment(index);
      }
    }
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'Shift') {
    shiftPressed = false;
  }
});

document.addEventListener('click', (e) => {
  const x = e.clientX + window.scrollX;
  const y = e.clientY + window.scrollY;
  lineSegmentManager.selectLineSegmentByPosition(x, y);
});

function createTempLine(x, y) {
  tempLine = document.createElement('div');
  tempLine.className = 'temp-line';
  document.body.appendChild(tempLine);
  tempLine.style.left = `${x}px`;
  tempLine.style.top = `${y}px`;
}

function updateTempLine(x, y) {
  if (!tempLine) return;

  let length = Math.sqrt(Math.pow(x + window.scrollX - startX, 2) + Math.pow(y + window.scrollY - startY, 2));
  tempLine.style.width = `${length}px`;

  let angle = Math.atan2(y + window.scrollY - startY, x + window.scrollX - startX) * (180 / Math.PI);
  tempLine.style.transform = `rotate(${angle}deg)`;
}

function removeTempLine() {
  if (tempLine) {
    document.body.removeChild(tempLine);
    tempLine = null;
  }
}

function getSnapPosition(x, y) {
  const elements = document.elementsFromPoint(x, y);
  let closestEdge = { x, y, distance: snappingRange };

  elements.forEach(element => {
    const rect = element.getBoundingClientRect();
    const edges = [
      { x: rect.left, y: rect.top },
      { x: rect.right, y: rect.top },
      { x: rect.left, y: rect.bottom },
      { x: rect.right, y: rect.bottom }
    ];

    edges.forEach(edge => {
      const distance = Math.sqrt(Math.pow(edge.x - x, 2) + Math.pow(edge.y - y, 2));
      if (distance < closestEdge.distance) {
        closestEdge = { x: edge.x, y: edge.y, distance };
      }
    });
  });

  return closestEdge;
}

function updateSnapDot(x, y) {
  const snapPosition = getSnapPosition(x, y);
  if (!snapDot) {
    snapDot = document.createElement('div');
    snapDot.id = 'snap-dot';
    document.body.appendChild(snapDot);
  }
  snapDot.style.left = `${snapPosition.x}px`;
  snapDot.style.top = `${snapPosition.y}px`;
}

// Set the default grid system to 12 grid and display it initially
gridManager.showGrid(12, 1680, 28);
