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

function chooseBestExtraction(results = []) {
  const candidates = results
    .map((result) => ({ frameId: result.frameId, ...(result.result || {}) }))
    .filter((item) => item.text)
    .sort((a, b) => {
      const priorityDiff = (b.priority || 0) - (a.priority || 0);
      if (priorityDiff) return priorityDiff;
      return b.text.length - a.text.length;
    });

  return candidates[0] || {
    text: "",
    source: "No technical text found—select text or use Pick element",
    priority: 0
  };
}

async function injectContentScript(tabId, allFrames = false) {
  await chrome.scripting.executeScript({
    target: { tabId, allFrames },
    files: ["content.js"]
  });
}

async function extractAcrossFrames(tabId) {
  try {
    await injectContentScript(tabId, true);
  } catch (error) {
    throw friendlyError(error);
  }

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      func: () => window.__formatLensExtract?.() || null
    });
    return chooseBestExtraction(results);
  } catch (error) {
    throw friendlyError(error);
  }
}

async function sendToPage(message) {
  const tab = await getActiveTab();

  if (message?.type === "formatlens:extract") {
    return extractAcrossFrames(tab.id);
  }

  try {
    return await chrome.tabs.sendMessage(tab.id, message);
  } catch (_) {
    try {
      await injectContentScript(tab.id, false);
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
