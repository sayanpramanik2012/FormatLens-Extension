const state = { raw: "", value: null, isJson: false, detected: "Plain text", tab: "pretty", query: "", source: "", nodes: new Map() };
const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));

function parseJson(text) {
  let candidate = text.trim();
  let lastValue;
  let succeeded = false;
  for (let depth = 0; depth < 5; depth += 1) {
    try {
      lastValue = JSON.parse(candidate);
      succeeded = true;
    } catch (_) {
      break;
    }
    if (typeof lastValue !== "string") return { ok: true, value: lastValue };
    candidate = lastValue.trim();
  }
  return succeeded ? { ok: true, value: lastValue } : { ok: false, value: null };
}

function markText(text) {
  const query = state.query.trim();
  if (!query) return escapeHtml(text);
  const lower = text.toLowerCase();
  const needle = query.toLowerCase();
  let output = "";
  let cursor = 0;
  let index;
  while ((index = lower.indexOf(needle, cursor)) !== -1) {
    output += escapeHtml(text.slice(cursor, index));
    output += `<mark>${escapeHtml(text.slice(index, index + needle.length))}</mark>`;
    cursor = index + needle.length;
  }
  return output + escapeHtml(text.slice(cursor));
}

function highlightJson(json) {
  const tokenPattern = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"\s*:|"(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g;
  let output = "";
  let cursor = 0;
  let match;
  while ((match = tokenPattern.exec(json)) !== null) {
    output += markText(json.slice(cursor, match.index));
    const token = match[0];
    let className = "json-number";
    if (/^"/.test(token)) className = /:\s*$/.test(token) ? "json-key" : "json-string";
    else if (/^(true|false)$/.test(token)) className = "json-bool";
    else if (token === "null") className = "json-null";
    output += `<span class="${className}">${markText(token)}</span>`;
    cursor = match.index + token.length;
  }
  return output + markText(json.slice(cursor));
}

function pathFor(parent, key, isArray) {
  if (isArray) return `${parent}[${key}]`;
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `${parent}.${key}` : `${parent}[${JSON.stringify(key)}]`;
}

function matches(value, path, label) {
  const query = state.query.trim().toLowerCase();
  if (!query) return false;
  const display = value && typeof value === "object" ? label : String(value);
  return `${display ?? ""} ${path}`.toLowerCase().includes(query);
}

function copyButtons() {
  return '<button class="copy-mini" data-copy="value" title="Copy this value">Value</button><button class="copy-mini" data-copy="path" title="Copy this JSON path">Path</button>';
}

function renderTree(value, path = "$", label = null, depth = 0) {
  state.nodes.set(path, value);
  const labelHtml = label === null ? "" : `<span class="json-key">${markText(label)}: </span>`;
  if (value === null || typeof value !== "object") {
    const scalar = typeof value === "string" ? JSON.stringify(value) : String(value);
    return `<div class="node ${matches(value, path, label) ? "match" : ""}" data-path="${escapeHtml(path)}"><div class="node-row">${labelHtml}<span class="node-value">${markText(scalar)}</span><span class="path">${markText(path)}</span>${copyButtons()}</div></div>`;
  }
  const entries = Array.isArray(value) ? value.map((item, index) => [String(index), item]) : Object.entries(value);
  const kind = Array.isArray(value) ? "Array" : "Object";
  const children = entries.map(([key, child]) => renderTree(child, pathFor(path, key, Array.isArray(value)), key, depth + 1)).join("");
  const matched = matches(value, path, label);
  const open = depth < 2 || Boolean(state.query.trim());
  return `<details class="node ${matched ? "match" : ""}" data-path="${escapeHtml(path)}" ${open ? "open" : ""}><summary>${labelHtml}${kind} (${entries.length}) <span class="path">${markText(path)}</span>${copyButtons()}</summary>${children}</details>`;
}

function formattedText() {
  return state.isJson ? JSON.stringify(state.value, null, 2) : state.raw;
}

function render() {
  const text = formattedText();
  if (!state.raw) {
    $("pretty").textContent = "Select the JSON or technical text you want, then choose Format selected text.\n\nIf nothing is selected, FormatLens falls back to the focused field or best matching technical element. You can also use Pick element.";
    $("raw").textContent = "No content extracted yet.";
    $("tree").innerHTML = '<div class="empty"><strong>No JSON tree yet</strong><span>Format valid JSON to explore it here.</span></div>';
  } else {
    $("pretty").innerHTML = state.isJson ? highlightJson(text) : markText(text);
    $("raw").innerHTML = markText(state.raw);
    state.nodes = new Map();
    $("tree").innerHTML = state.isJson ? renderTree(state.value) : '<div class="empty"><strong>Tree view needs valid JSON</strong><span>Pretty and Raw views remain available.</span></div>';
  }
  ["pretty", "raw"].forEach((id) => $(id).classList.toggle("wrap", $("wrap").checked));
  $("detected").textContent = state.detected;
  $("status").textContent = state.source || (state.raw ? "Content ready" : "Ready to inspect this page");
}

function setContent(text, source) {
  state.raw = text || "";
  const parsed = parseJson(state.raw);
  state.isJson = parsed.ok;
  state.value = parsed.value;
  state.detected = state.isJson ? "JSON detected" : "Plain text";
  state.source = source || "";
  render();
}

async function request(type) {
  const result = await chrome.runtime.sendMessage({ type });
  if (!result?.ok) throw new Error(result?.error || "Could not access this page.");
  return result.data;
}

async function copyText(text, message) {
  await navigator.clipboard.writeText(String(text));
  $("status").textContent = message;
}

$("extract").onclick = async () => {
  try { const data = await request("formatlens:extract"); setContent(data.text, data.source); }
  catch (error) { $("status").textContent = error.message; }
};
$("pick").onclick = async () => {
  try { await request("formatlens:pick"); $("status").textContent = "Pick an element on the page (Esc cancels)"; }
  catch (error) { $("status").textContent = error.message; }
};
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "formatlens:picked") setContent(message.text, message.source);
});
$("copy").onclick = () => copyText(formattedText(), "Copied formatted content");
$("wrap").onchange = render;
$("search").oninput = (event) => { state.query = event.target.value; render(); };

document.querySelectorAll(".tab").forEach((tab) => {
  tab.onclick = () => {
    state.tab = tab.dataset.tab;
    document.querySelectorAll(".tab").forEach((item) => item.classList.toggle("active", item === tab));
    ["pretty", "tree", "raw"].forEach((id) => $(id).classList.toggle("hidden", id !== state.tab));
  };
});

$("tree").addEventListener("click", async (event) => {
  const copyButton = event.target.closest("[data-copy]");
  if (!copyButton) return;
  event.preventDefault(); event.stopPropagation();
  const node = copyButton.closest("[data-path]");
  const path = node?.dataset.path;
  if (!path) return;
  if (copyButton.dataset.copy === "path") return copyText(path, "JSON path copied");
  const value = state.nodes.get(path);
  const text = typeof value === "string" ? value : value && typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
  return copyText(text, "JSON value copied");
});

$("theme").onclick = async () => {
  const current = document.documentElement.dataset.theme || "system";
  const next = current === "system" ? "dark" : current === "dark" ? "light" : "system";
  if (next === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = next;
  $("theme").title = `Theme: ${next}`;
  await chrome.storage.local.set({ theme: next });
};

chrome.storage.local.get("theme").then(({ theme }) => {
  if (theme && theme !== "system") document.documentElement.dataset.theme = theme;
  $("theme").title = `Theme: ${theme || "system"}`;
});
render();
