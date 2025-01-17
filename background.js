chrome.runtime.onInstalled.addListener(() => {
  console.log('Web Page Ruler Tool extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'updateGrid') {
    chrome.storage.local.set({ gridSystem: message.gridSystem, gridWidth: message.gridWidth, gridGap: message.gridGap }, () => {
      console.log('Grid system, width, and gap updated');
      sendResponse({ status: 'success' });
    });
    return true;
  }
});
