document.getElementById('grid-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const gridSystem = document.getElementById('grid-system').value;
  const gridWidth = document.getElementById('grid-width').value;
  const gridGap = document.getElementById('grid-gap').value;

  chrome.runtime.sendMessage({ type: 'updateGrid', gridSystem, gridWidth, gridGap }, function(response) {
    if (response.status === 'success') {
      console.log('Grid system, width, and gap updated');
    } else {
      console.error('Failed to update grid system, width, and gap');
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
