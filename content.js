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
});

document.addEventListener('mousedown', (e) => {
  if (!drawingEnabled) return;
  startX = e.clientX;
  startY = e.clientY;
  isDrawing = true;
});

document.addEventListener('mouseup', (e) => {
  if (!drawingEnabled) return;
  if (isDrawing) {
    endX = e.clientX;
    endY = e.clientY;
    drawLine(startX, startY, endX, endY);
    isDrawing = false;
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
