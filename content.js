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

class CommandManager {
  constructor() {
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.isDrawing = false;
    this.shiftPressed = false;
    this.drawingEnabled = true;
    this.tempLine = null;
    this.snappingEnabled = false;
    this.snappingRange = 10;
    this.snapDot = null;

    chrome.storage.local.get(['drawingEnabled', 'snappingEnabled', 'snappingRange'], (result) => {
      this.drawingEnabled = result.drawingEnabled !== undefined ? result.drawingEnabled : true;
      this.snappingEnabled = result.snappingEnabled !== undefined ? result.snappingEnabled : false;
      this.snappingRange = result.snappingRange !== undefined ? result.snappingRange : 10;
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'toggleDrawing') {
        this.drawingEnabled = message.drawingEnabled;
        sendResponse({ status: 'success' });
      } else if (message.type === 'toggleSnapping') {
        this.snappingEnabled = message.snappingEnabled;
        sendResponse({ status: 'success' });
      } else if (message.type === 'updateSnappingRange') {
        this.snappingRange = message.snappingRange;
        sendResponse({ status: 'success' });
      } else if (message.type === 'updateGrid') {
        gridManager.updateGrid(message.gridSystem, message.gridWidth, message.gridGap);
        sendResponse({ status: 'success' });
      }
    });

    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    document.addEventListener('click', (e) => this.handleClick(e));
  }

  handleMouseMove(e) {
    horizontalLine.style.top = `${e.clientY}px`;
    if (this.isDrawing && this.tempLine) {
      this.updateTempLine(e.clientX, e.clientY);
    }
    if (this.snappingEnabled) {
      this.updateSnapDot(e.clientX, e.clientY);
    }
  }

  handleMouseDown(e) {
    if (!this.drawingEnabled) return;
    this.startX = e.clientX + window.scrollX;
    this.startY = e.clientY + window.scrollY;
    this.isDrawing = true;
    this.createTempLine(this.startX, this.startY);
  }

  handleMouseUp(e) {
    if (!this.drawingEnabled) return;
    if (this.isDrawing) {
      this.endX = e.clientX + window.scrollX;
      this.endY = e.clientY + window.scrollY;
      if (this.snappingEnabled) {
        const snapPosition = this.getSnapPosition(this.endX, this.endY);
        this.endX = snapPosition.x;
        this.endY = snapPosition.y;
      }
      const distance = Math.sqrt(Math.pow(this.endX - this.startX, 2) + Math.pow(this.endY - this.startY, 2));
      if (distance < 1) {
        // Click action
        lineSegmentManager.selectLineSegmentByPosition(this.endX, this.endY);
      } else {
        // Drag action
        lineSegmentManager.addLineSegment(this.startX, this.startY, this.endX, this.endY, this.shiftPressed);
      }
      this.isDrawing = false;
      this.removeTempLine();
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Shift') {
      this.shiftPressed = true;
    }
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (lineSegmentManager.selectedLineSegment) {
        const index = lineSegmentManager.lineSegments.indexOf(lineSegmentManager.selectedLineSegment);
        if (index !== -1) {
          lineSegmentManager.deleteLineSegment(index);
        }
      }
    }
  }

  handleKeyUp(e) {
    if (e.key === 'Shift') {
      this.shiftPressed = false;
    }
  }

  handleClick(e) {
    const x = e.clientX + window.scrollX;
    const y = e.clientY + window.scrollY;
    lineSegmentManager.selectLineSegmentByPosition(x, y);
  }

  createTempLine(x, y) {
    this.tempLine = document.createElement('div');
    this.tempLine.className = 'temp-line';
    document.body.appendChild(this.tempLine);
    this.tempLine.style.left = `${x}px`;
    this.tempLine.style.top = `${y}px`;
  }

  updateTempLine(x, y) {
    if (!this.tempLine) return;

    let length = Math.sqrt(Math.pow(x + window.scrollX - this.startX, 2) + Math.pow(y + window.scrollY - this.startY, 2));
    this.tempLine.style.width = `${length}px`;

    let angle = Math.atan2(y + window.scrollY - this.startY, x + window.scrollX - this.startX) * (180 / Math.PI);
    this.tempLine.style.transform = `rotate(${angle}deg)`;
  }

  removeTempLine() {
    if (this.tempLine) {
      document.body.removeChild(this.tempLine);
      this.tempLine = null;
    }
  }

  getSnapPosition(x, y) {
    const elements = document.elementsFromPoint(x, y);
    let closestEdge = { x, y, distance: this.snappingRange };

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

  updateSnapDot(x, y) {
    const snapPosition = this.getSnapPosition(x, y);
    if (!this.snapDot) {
      this.snapDot = document.createElement('div');
      this.snapDot.id = 'snap-dot';
      document.body.appendChild(this.snapDot);
    }
    this.snapDot.style.left = `${snapPosition.x}px`;
    this.snapDot.style.top = `${snapPosition.y}px`;
  }
}

const commandManager = new CommandManager();

let ruler = document.createElement('div');
ruler.id = 'ruler';
document.body.appendChild(ruler);

let horizontalLine = document.createElement('div');
horizontalLine.id = 'horizontal-line';
document.body.appendChild(horizontalLine);

// Set the default grid system to 12 grid and display it initially
gridManager.showGrid(12, 1680, 28);
