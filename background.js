chrome.runtime.onInstalled.addListener(() => {
  console.log('Web Page Ruler Tool extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'updateGrid') {
    let gridWidth = message.gridWidth;
    const screenWidth = window.screen.width;
    if (gridWidth > screenWidth) {
      gridWidth = (gridWidth / 1920) * screenWidth;
    }

    let gridGap = message.gridGap;
    const gridSystem = message.gridSystem;
    if (gridGap > gridWidth / gridSystem) {
      gridGap = (gridWidth / gridSystem) * 0.2;
    }

    chrome.storage.local.set({ gridSystem, gridWidth, gridGap }, () => {
      console.log('Grid system, width, and gap updated');
      sendResponse({ status: 'success' });
    });
    return true;
  }
});
