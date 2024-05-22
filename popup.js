// popup.js
document.addEventListener('DOMContentLoaded', () => {
    const classDataElement = document.getElementById('classData');
  
    // Send a message to the background script to fetch the class data
    chrome.runtime.sendMessage({ action: 'fetchClassData' }, (response) => {
      if (response.data) {
        // Update the DOM with the fetched data
        classDataElement.textContent = JSON.stringify(response.data);
      } else if (response.error) {
        classDataElement.textContent = `Error: ${response.error}`;
      }
    });
  });