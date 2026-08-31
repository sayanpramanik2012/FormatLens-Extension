(() => {
  if (window.__formatLensLoaded) return;
  window.__formatLensLoaded = true;

  const clean = (value) => String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/[\u200b-\u200d\ufeff]/g, "")
    .trim();

  const isTextControl = (element) => {
    const tag = element?.tagName?.toLowerCase();
    return tag === "textarea" || tag === "input";
  };

  const readable = (element) => {
    if (!element) return "";
    if (isTextControl(element)) return element.value || "";
    return element.innerText || element.textContent || "";
  };

  const useful = (element) => element && (
    element.matches?.("textarea,input,[contenteditable],pre,code") || readable(element).length > 0
  );

  const closestUseful = (element) => {
    let node = element;
    while (node && node !== document.body) {
      if (useful(node)) return node;
      node = node.parentElement || node.getRootNode?.().host;
    }
    return null;
  };

  const deepActiveElement = (rootDocument = document) => {
    let active = rootDocument.activeElement;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    return active;
  };

  const selectedTextControlValue = (element) => {
    if (!isTextControl(element)) return "";
    try {
      const start = element.selectionStart;
      const end = element.selectionEnd;
      if (typeof start !== "number" || typeof end !== "number" || end <= start) return "";
      return clean((element.value || "").slice(start, end));
    } catch (_) {
      return "";
    }
  };

  const findSelection = (targetWindow = window, targetDocument = document, visited = new Set()) => {
    if (!targetWindow || !targetDocument || visited.has(targetWindow)) return null;
    visited.add(targetWindow);

    try {
      const pageSelection = clean(targetWindow.getSelection?.()?.toString());
      if (pageSelection) return { text: pageSelection, source: "Selected text", priority: 100 };
    } catch (_) {
      // Ignore inaccessible selection APIs and continue with the other strategies.
    }

    const active = deepActiveElement(targetDocument);
    const selectedInput = selectedTextControlValue(active);
    if (selectedInput) return { text: selectedInput, source: "Selected input text", priority: 100 };

    // Rich-text editors commonly keep their editable surface inside an iframe.
    // Walk same-origin editor frames directly so selection survives clicking the side panel.
    const frames = [];
    if (active?.tagName?.toLowerCase() === "iframe" || active?.tagName?.toLowerCase() === "frame") frames.push(active);
    try {
      frames.push(...targetDocument.querySelectorAll("iframe,frame"));
    } catch (_) {
      // Ignore documents that do not allow frame enumeration.
    }

    for (const frame of [...new Set(frames)]) {
      try {
        const nestedWindow = frame.contentWindow;
        const nestedDocument = frame.contentDocument || nestedWindow?.document;
        const nestedSelection = findSelection(nestedWindow, nestedDocument, visited);
        if (nestedSelection?.text) return nestedSelection;
      } catch (_) {
        // Cross-origin frames are handled independently by the extension background script.
      }
    }

    return null;
  };

  const collectCandidates = (root = document) => {
    const found = [...root.querySelectorAll("textarea,input,[contenteditable],pre,code")];
    for (const element of root.querySelectorAll("*")) {
      if (element.shadowRoot) found.push(...collectCandidates(element.shadowRoot));
    }
    return found;
  };

  function extract() {
    const selected = findSelection();
    if (selected) return selected;

    const active = deepActiveElement();
    if (isTextControl(active)) {
      const text = clean(readable(active));
      if (text) return { text, source: `Focused ${active.tagName.toLowerCase()}`, priority: 80 };
    }

    const focused = closestUseful(active);
    if (focused) {
      const text = clean(readable(focused));
      if (text) return { text, source: `Focused ${focused.tagName.toLowerCase()}`, priority: 70 };
    }

    const largest = collectCandidates()
      .map((element) => ({ element, text: clean(readable(element)) }))
      .filter((item) => item.text.length > 0)
      .sort((a, b) => b.text.length - a.text.length)[0];

    if (largest) {
      return {
        text: largest.text,
        source: `Visible ${largest.element.tagName.toLowerCase()}`,
        priority: 30
      };
    }

    return {
      text: "",
      source: "No technical text found—select text or use Pick element",
      priority: 0
    };
  }

  function pick() {
    if (document.getElementById("formatlens-picker-style")) return { started: true };

    const style = document.createElement("style");
    style.id = "formatlens-picker-style";
    style.textContent = ".formatlens-pick-target{outline:3px solid #27d3ff!important;cursor:crosshair!important}.formatlens-pick-tip{position:fixed;z-index:2147483647;top:12px;left:50%;transform:translateX(-50%);background:#10182d;color:#fff;padding:9px 13px;border-radius:8px;font:13px system-ui;box-shadow:0 5px 20px #0009}";

    const tip = document.createElement("div");
    tip.className = "formatlens-pick-tip";
    tip.textContent = "FormatLens: click an element to inspect it • Esc cancels";

    let hovered;
    const clear = () => {
      hovered?.classList?.remove("formatlens-pick-target");
      style.remove();
      tip.remove();
      document.removeEventListener("mousemove", move, true);
      document.removeEventListener("click", choose, true);
      document.removeEventListener("keydown", key, true);
    };

    const move = (event) => {
      hovered?.classList?.remove("formatlens-pick-target");
      hovered = event.composedPath?.()[0] || event.target;
      if (hovered !== tip) hovered?.classList?.add("formatlens-pick-target");
    };

    const choose = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const target = event.composedPath?.()[0] || event.target;
      const text = clean(readable(target));
      clear();
      chrome.runtime.sendMessage({
        type: "formatlens:picked",
        text,
        source: `Picked ${target?.tagName?.toLowerCase?.() || "element"}`
      });
    };

    const key = (event) => {
      if (event.key === "Escape") clear();
    };

    document.head.append(style);
    document.documentElement.append(tip);
    document.addEventListener("mousemove", move, true);
    document.addEventListener("click", choose, true);
    document.addEventListener("keydown", key, true);
    return { started: true };
  }

  window.__formatLensExtract = extract;
  window.__formatLensPick = pick;

  chrome.runtime.onMessage.addListener((message, _sender, respond) => {
    if (message?.type === "formatlens:extract") respond(extract());
    if (message?.type === "formatlens:pick") respond(pick());
  });
})();
