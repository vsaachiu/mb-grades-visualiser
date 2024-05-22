chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ view: "student" }, () => {
    console.log("Default view set to student.");
  });
});

// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchClassData') {
      fetch('https://script.google.com/a/macros/vsa.edu.hk/s/AKfycbyagcoynMcHhZpSZSyEJ5hfDzt4ReGqYh48IBgDsLWTPCzIShd8MYVanJo-jnFLYYPFgw/exec')
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