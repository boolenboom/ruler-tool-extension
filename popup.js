document.getElementById('grid-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const gridSystem = document.getElementById('grid-system').value;
  const gridWidth = document.getElementById('grid-width').value;

  chrome.runtime.sendMessage({ type: 'updateGrid', gridSystem, gridWidth }, function(response) {
    if (response.status === 'success') {
      console.log('Grid system and width updated');
    } else {
      console.error('Failed to update grid system and width');
    }
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
