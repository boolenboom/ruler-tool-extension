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

chrome.storage.local.get(['drawingEnabled'], (result) => {
  drawingEnabled = result.drawingEnabled !== undefined ? result.drawingEnabled : true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'toggleDrawing') {
    drawingEnabled = message.drawingEnabled;
    sendResponse({ status: 'success' });
  }
});

document.addEventListener('mousemove', (e) => {
  horizontalLine.style.top = `${e.clientY}px`;
  if (isDrawing && tempLine) {
    updateTempLine(e.clientX, e.clientY);
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

// Set the default grid system to 12 grid and display it initially
let gridSystem = 12;
let gridWidth = 8;

chrome.storage.local.get(['gridSystem', 'gridWidth'], (result) => {
  gridSystem = result.gridSystem !== undefined ? result.gridSystem : 12;
  gridWidth = result.gridWidth !== undefined ? result.gridWidth : 8;
  displayGrid(gridSystem, gridWidth);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'updateGrid') {
    gridSystem = message.gridSystem;
    gridWidth = message.gridWidth;
    displayGrid(gridSystem, gridWidth);
    sendResponse({ status: 'success' });
  }
});

function displayGrid(gridSystem, gridWidth) {
  let grid = document.createElement('div');
  grid.id = 'grid';
  grid.style.position = 'fixed';
  grid.style.top = '0';
  grid.style.left = '0';
  grid.style.width = '100%';
  grid.style.height = '100%';
  grid.style.pointerEvents = 'none';
  grid.style.zIndex = '9998';
  grid.style.backgroundSize = `${gridWidth}px ${gridWidth}px`;
  grid.style.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`;
  document.body.appendChild(grid);
}
