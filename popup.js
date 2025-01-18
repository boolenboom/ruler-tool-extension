document.getElementById('grid-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const gridSystem = document.getElementById('grid-system').value;
  const gridWidth = document.getElementById('grid-width').value;
  const gridGap = document.getElementById('grid-gap').value;

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

document.getElementById('snapping-checkbox').addEventListener('change', function(event) {
  const snappingEnabled = event.target.checked;

  chrome.runtime.sendMessage({ type: 'toggleSnapping', snappingEnabled }, function(response) {
    if (response.status === 'success') {
      console.log('Snapping functionality toggled');
    } else {
      console.error('Failed to toggle snapping functionality');
    }
  });
});

document.getElementById('snapping-range').addEventListener('input', function(event) {
  const snappingRange = event.target.value;

  chrome.runtime.sendMessage({ type: 'updateSnappingRange', snappingRange }, function(response) {
    if (response.status === 'success') {
      console.log('Snapping range updated');
    } else {
      console.error('Failed to update snapping range');
    }
  });
});

chrome.storage.local.get(['snappingEnabled', 'snappingRange'], (result) => {
  document.getElementById('snapping-checkbox').checked = result.snappingEnabled !== undefined ? result.snappingEnabled : false;
  document.getElementById('snapping-range').value = result.snappingRange !== undefined ? result.snappingRange : 10;
});

document.getElementById('grid-width').value = 1680;
