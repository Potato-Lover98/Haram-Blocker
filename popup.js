const $ = id => document.getElementById(id);

async function load() {
  const s = await chrome.storage.sync.get(["enabled", "customSites", "customKeywords"]);
  $("enabled").checked = s.enabled !== false;
  const custom = s.customSites || [];
  $("site-count").textContent = DEFAULT_SITES.length + custom.length;
  $("kw-count").textContent = DEFAULT_KEYWORDS.length + (s.customKeywords || []).length;
  renderSites(custom);
}

function renderSites(custom) {
  const l = $("site-list");
  if (!custom.length) { l.innerHTML = '<div class="empty">No custom sites yet. Default haram sites are always blocked.</div>'; return; }
  l.innerHTML = custom.map(d =>
    `<div class="item"><span>${d}</span><button data-d="${d}" title="Remove">×</button></div>`).join("");
  l.querySelectorAll("button").forEach(b => b.onclick = () => removeSite(b.dataset.d));
}

async function addSite() {
  let d = ($("site-input").value || "").trim().toLowerCase()
    .replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
  if (!d || !d.includes(".")) return;
  const s = await chrome.storage.sync.get("customSites");
  const list = s.customSites || [];
  if (!list.includes(d)) list.push(d);
  await chrome.storage.sync.set({ customSites: list });
  $("site-input").value = "";
  load();
}

async function removeSite(d) {
  const s = await chrome.storage.sync.get("customSites");
  const list = (s.customSites || []).filter(x => x !== d);
  await chrome.storage.sync.set({ customSites: list });
  load();
}

$("enabled").onchange = () => chrome.storage.sync.set({ enabled: $("enabled").checked });
$("add-site").onclick = addSite;
$("site-input").addEventListener("keydown", e => { if (e.key === "Enter") addSite(); });
load();
