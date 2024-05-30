

// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchClassData') {
      console.log(`I'm running in the background! ${request.vsaClassId}`);
      fetch(`https://script.google.com/macros/s/AKfycbw2H6RBZMnwSroa5MviM9Q7XiAK4gYbwsSZMecRiGqYbQgRXK3M8E8-F_vnkhayXJOmtQ/exec?vsa_class_id=${request.vsaClassId}`)
        .then(response => response.json())
        .then(data => {
          // Store the fetched data in the extension's storage
          chrome.storage.local.set({ classData: data }, () => {
            sendResponse({ data: data });
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          sendResponse({ error: error.message });
        });
      return true; // Indicate that the response will be sent asynchronously
    }
  });