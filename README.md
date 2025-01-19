# Web Page Ruler Tool

## 功能介紹 / Features

* 顯示網頁上的尺規 / Display a ruler on web pages
* 選擇不同的網格系統和寬度 / Choose different grid systems and widths
* 繪製帶有長度顯示的線條 / Draw lines with length display
* 支援繪圖功能的開關 / Support toggle for drawing functionality
* 支援吸附功能的開關 / Support toggle for snapping functionality
* 可調整吸附範圍 / Adjustable snapping range
* 物件導向設計的網格和線段 / Object-oriented design for grid and line segments

## 使用說明 / Instructions

1. 安裝擴充功能後，點擊瀏覽器工具列上的圖示開啟工具。/ After installing the extension, click the icon in the browser toolbar to open the tool.
2. 在彈出的視窗中，可以選擇網格系統（8格、12格、16格）和設定網格寬度及間距。/ In the popup window, you can choose the grid system (8 grid, 12 grid, 16 grid) and set the grid width and gap.
3. 可以開啟或關閉繪圖功能，並調整吸附範圍。/ You can enable or disable the drawing functionality and adjust the snapping range.
4. 在網頁上移動滑鼠時，會顯示水平線。/ When moving the mouse on the web page, a horizontal line will be displayed.
5. 按下滑鼠左鍵開始繪製線條，鬆開左鍵結束繪製，線條會顯示長度。/ Press the left mouse button to start drawing a line, release the left button to end drawing, and the line will display its length.
6. 按住 Shift 鍵可以繪製水平或垂直的線條。/ Hold the Shift key to draw horizontal or vertical lines.
7. 吸附功能開啟時，線條會自動吸附到最近的邊緣。/ When the snapping functionality is enabled, the lines will automatically snap to the nearest edge.

## 文件結構 / File Structure

* `background.js`: 處理擴充功能安裝和訊息傳遞。/ Handles extension installation and message passing.
* `content.js`: 處理網頁上的尺規顯示、繪圖和吸附功能。/ Handles ruler display, drawing, and snapping functionality on web pages.
* `manifest.json`: 擴充功能的設定檔案。/ Configuration file for the extension.
* `popup.html`: 彈出視窗的 HTML 檔案。/ HTML file for the popup window.
* `popup.js`: 處理彈出視窗中的表單提交和功能開關。/ Handles form submission and functionality toggles in the popup window.
* `styles.css`: 定義尺規、線條和吸附點的樣式。/ Defines styles for the ruler, lines, and snapping points.

## 使用範例 / Examples

### 使用 Grid 類別 / Using the Grid Class

```javascript
// 創建一個新的 Grid 實例 / Create a new Grid instance
let grid = new Grid(12, 1680, 28);
grid.displayGrid();
```

### 使用 LineSegment 類別 / Using the LineSegment Class

```javascript
// 創建一個新的 LineSegment 實例 / Create a new LineSegment instance
let lineSegment = new LineSegment(100, 100, 200, 200, false);
lineSegment.drawLine();
```

### 使用 GridManager 類別 / Using the GridManager Class

```javascript
// 獲取 GridManager 單例 / Get the GridManager singleton
const gridManager = new GridManager();

// 顯示格柵 / Show the grid
gridManager.showGrid(12, 1680, 28);

// 隱藏格柵 / Hide the grid
gridManager.hideGrid();

// 更新格柵 / Update the grid
gridManager.updateGrid(12, 1680, 28);
```

### 使用 LineSegmentManager 類別 / Using the LineSegmentManager Class

```javascript
// 創建一個新的 LineSegmentManager 實例 / Create a new LineSegmentManager instance
const lineSegmentManager = new LineSegmentManager();

// 添加線段 / Add a line segment
lineSegmentManager.addLineSegment(100, 100, 200, 200, false);

// 選取線段 / Select a line segment
const selectedLineSegment = lineSegmentManager.selectLineSegment(0);

// 刪除線段 / Delete a line segment
lineSegmentManager.deleteLineSegment(0);

// 更新線段 / Update a line segment
lineSegmentManager.updateLineSegment(0, 150, 150, 250, 250, true);
```

### 使用 CommandManager 類別 / Using the CommandManager Class

```javascript
// 創建一個新的 CommandManager 實例 / Create a new CommandManager instance
const commandManager = new CommandManager();

// 處理滑鼠移動事件 / Handle mouse move event
document.addEventListener('mousemove', (e) => commandManager.handleMouseMove(e));

// 處理滑鼠按下事件 / Handle mouse down event
document.addEventListener('mousedown', (e) => commandManager.handleMouseDown(e));

// 處理滑鼠放開事件 / Handle mouse up event
document.addEventListener('mouseup', (e) => commandManager.handleMouseUp(e));

// 處理鍵盤按下事件 / Handle key down event
document.addEventListener('keydown', (e) => commandManager.handleKeyDown(e));

// 處理鍵盤放開事件 / Handle key up event
document.addEventListener('keyup', (e) => commandManager.handleKeyUp(e));

// 處理點擊事件 / Handle click event
document.addEventListener('click', (e) => commandManager.handleClick(e));
```
