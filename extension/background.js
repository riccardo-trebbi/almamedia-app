// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Show the action icon for the tab that the sender (content script) was on
  if (sender.tab && sender.tab.id) {
    chrome.action.enable(sender.tab.id)
  }

  // Return nothing to let the connection be cleaned up
  sendResponse({})
})
