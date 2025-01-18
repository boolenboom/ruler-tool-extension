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
let snappingEnabled = false; // P316e
let snappingRange = 10; // P2ea6
let snapDot = null; // P2bdf

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
    drawLine(startX, startY, endX, endY);
    isDrawing = false;
    removeTempLine();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Shift') {
    shiftPressed = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'Shift') {
    shiftPressed = false;
  }
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

function drawLine(x1, y1, x2, y2) {
  let line = document.createElement('div');
  line.className = 'line';
  document.body.appendChild(line);

  if (shiftPressed) {
    if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
      y2 = y1;
    } else {
      x2 = x1;
    }
  }

  let length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  line.style.width = `${length}px`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;

  let angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  line.style.transform = `rotate(${angle}deg)`;

  let lengthLabel = document.createElement('span');
  lengthLabel.className = 'length-label';
  lengthLabel.innerText = `${Math.round(length)}px`;
  line.appendChild(lengthLabel);
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
let gridSystem = 12;
let gridWidth = 1680;
let gridGap = 28;

chrome.storage.local.get(['gridSystem', 'gridWidth', 'gridGap'], (result) => {
  console.log(result);
  gridSystem = result.gridSystem !== undefined ? result.gridSystem : 12;
  gridWidth = result.gridWidth !== undefined ? result.gridWidth : 1680;
  gridGap = result.gridGap !== undefined ? result.gridGap : 28;
  displayGrid(gridSystem, gridWidth, gridGap);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  if (message.type === 'updateGrid') {
    gridSystem = message.gridSystem;
    gridWidth = message.gridWidth;
    gridGap = message.gridGap;
    displayGrid(gridSystem, gridWidth, gridGap);
    sendResponse({ status: 'success' });
  }
});

function displayGrid(gridSystem, gridWidth, gridGap) {
  const screenWidth = window.innerWidth;
  if (gridWidth > screenWidth) {
    gridGap = screenWidth / 1920 * gridGap;
    gridWidth = (gridWidth / 1920) * screenWidth;
  }

  if (gridGap > gridWidth / gridSystem) {
    gridGap = (gridWidth / gridSystem) * 0.2;
  }

  let existingGrid = document.getElementById('grid');
  if (existingGrid) {
    document.body.removeChild(existingGrid);
  }

  let oneGrid = gridWidth / gridSystem;
  let oneGapPercent = gridGap / oneGrid;
  console.log(gridWidth, gridGap, oneGrid, oneGapPercent);
  let grid = document.createElement('div');
  grid.id = 'grid';
  grid.style.position = 'fixed';
  grid.style.top = '0';
  grid.style.left = `50%`;
  grid.style.transform = 'translateX(-50%)';
  grid.style.width = `${gridWidth}px`;
  grid.style.height = '100%';
  grid.style.pointerEvents = 'none';
  grid.style.zIndex = '9998';
  grid.style.backgroundSize = `${100 / gridSystem + 100 / gridSystem * oneGapPercent / gridSystem}% 100%`;
  grid.style.backgroundImage = `linear-gradient(to right, rgb(160 0 0 / 10%) 0, rgb(160 0 0 / 10%) ${100 - oneGapPercent * 100}%, transparent ${100 - oneGapPercent * 100}%, transparent 100%)`;
  document.body.appendChild(grid);
}
