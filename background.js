chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id) throw new Error("No active browser tab is available.");
  return tab;
}

function friendlyError(error) {
  const message = error?.message || String(error);
  if (/cannot access|permission|chrome:\/\/|edge:\/\//i.test(message)) {
    return new Error("FormatLens cannot inspect this protected page. Open a normal HTTP/HTTPS webpage and try again.");
  }
  return new Error(message);
}

async function sendToPage(message) {
  const tab = await getActiveTab();
  try {
    return await chrome.tabs.sendMessage(tab.id, message);
  } catch (_) {
    try {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
      return await chrome.tabs.sendMessage(tab.id, message);
    } catch (error) {
      throw friendlyError(error);
    }
  }
}

chrome.runtime.onMessage.addListener((message, _sender, respond) => {
  if (message?.type === "formatlens:extract" || message?.type === "formatlens:pick") {
    sendToPage(message)
      .then((data) => respond({ ok: true, data }))
      .catch((error) => respond({ ok: false, error: error.message }));
    return true;
  }
});
