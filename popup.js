document.getElementById('grid-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const gridSystem = document.getElementById('grid-system').value;
  const gridWidth = document.getElementById('grid-width').value;
  const gridGap = document.getElementById('grid-gap').value;

  chrome.storage.local.set({ gridSystem, gridWidth, gridGap }, () => {
    console.log('Grid system, width, and gap updated');
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'updateGrid',
      gridSystem,
      gridWidth,
      gridGap
    }, (response) => {
      console.log(response.status);
    });
  });

});

document.getElementById('drawing-checkbox').addEventListener('change', function(event) {
  const drawingEnabled = event.target.checked;

  chrome.runtime.sendMessage({ type: 'toggleDrawing', drawingEnabled }, function(response) {
    if (response.status === 'success') {
      console.log('Drawing functionality toggled');
    } else {
      console.error('Failed to toggle drawing functionality');
    }
  });
});

document.getElementById('grid-width').value = 1680;
