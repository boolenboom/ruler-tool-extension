# Web Page Ruler Tool

## 功能介紹 / Features

* 顯示網頁上的尺規 / Display a ruler on web pages
* 選擇不同的網格系統和寬度 / Choose different grid systems and widths
* 繪製帶有長度顯示的線條 / Draw lines with length display
* 支援繪圖功能的開關 / Support toggle for drawing functionality
* 支援吸附功能的開關 / Support toggle for snapping functionality
* 可調整吸附範圍 / Adjustable snapping range

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
