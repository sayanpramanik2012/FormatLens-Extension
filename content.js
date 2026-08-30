(() => {
  if (window.__formatLensLoaded) return;
  window.__formatLensLoaded = true;

  const clean = (value) => (value || "").replace(/\u00a0/g, " ").trim();
  const readable = (element) => {
    if (!element) return "";
    if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) return element.value;
    return element.innerText || element.textContent || "";
  };
  const useful = (element) => element && (
    element.matches?.("textarea,input,[contenteditable='true'],pre,code") || readable(element).length > 0
  );
  const closestUseful = (element) => {
    let node = element;
    while (node && node !== document.body) {
      if (useful(node)) return node;
      node = node.parentElement || node.getRootNode?.().host;
    }
    return null;
  };
  const deepActiveElement = () => {
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    return active;
  };
  const collectCandidates = (root = document) => {
    const found = [...root.querySelectorAll("textarea,input,[contenteditable='true'],pre,code")];
    for (const element of root.querySelectorAll("*")) {
      if (element.shadowRoot) found.push(...collectCandidates(element.shadowRoot));
    }
    return found;
  };

  function extract() {
    const pageSelection = clean(window.getSelection()?.toString());
    if (pageSelection) return { text: pageSelection, source: "Selected text" };

    const active = deepActiveElement();
    if (active instanceof HTMLTextAreaElement || active instanceof HTMLInputElement) {
      const selected = clean(active.value.slice(active.selectionStart ?? 0, active.selectionEnd ?? 0));
      if (selected) return { text: selected, source: "Selected input text" };
    }

    const focused = closestUseful(active);
    if (focused) {
      const text = clean(readable(focused));
      if (text) return { text, source: `Focused ${focused.tagName.toLowerCase()}` };
    }

    const largest = collectCandidates()
      .map((element) => ({ element, text: clean(readable(element)) }))
      .filter((item) => item.text.length > 0)
      .sort((a, b) => b.text.length - a.text.length)[0];
    if (largest) return { text: largest.text, source: `Visible ${largest.element.tagName.toLowerCase()}` };
    return { text: "", source: "No technical text found—select text or use Pick element" };
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
      hovered?.classList.remove("formatlens-pick-target");
      style.remove(); tip.remove();
      document.removeEventListener("mousemove", move, true);
      document.removeEventListener("click", choose, true);
      document.removeEventListener("keydown", key, true);
    };
    const move = (event) => {
      hovered?.classList.remove("formatlens-pick-target");
      hovered = event.composedPath?.()[0] || event.target;
      if (hovered !== tip) hovered.classList.add("formatlens-pick-target");
    };
    const choose = (event) => {
      event.preventDefault(); event.stopPropagation();
      const target = event.composedPath?.()[0] || event.target;
      const text = clean(readable(target));
      clear();
      chrome.runtime.sendMessage({ type: "formatlens:picked", text, source: `Picked ${target.tagName.toLowerCase()}` });
    };
    const key = (event) => { if (event.key === "Escape") clear(); };
    document.head.append(style); document.documentElement.append(tip);
    document.addEventListener("mousemove", move, true);
    document.addEventListener("click", choose, true);
    document.addEventListener("keydown", key, true);
    return { started: true };
  }

  chrome.runtime.onMessage.addListener((message, _sender, respond) => {
    if (message?.type === "formatlens:extract") respond(extract());
    if (message?.type === "formatlens:pick") respond(pick());
  });
})();
