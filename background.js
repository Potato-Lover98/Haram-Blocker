// Ghassil service worker: block haram sites + explicit search queries.
importScripts("lists.js");

let state = { enabled: true, sites: [], keywords: [] };

async function loadState() {
  const s = await chrome.storage.sync.get(["enabled", "customSites", "customKeywords"]);
  state.enabled = s.enabled !== false; // default on
  state.sites = DEFAULT_SITES.concat(s.customSites || []);
  state.keywords = DEFAULT_KEYWORDS.concat(s.customKeywords || []);
}
loadState();
chrome.storage.onChanged.addListener(loadState);

function hostOf(url) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }

function isBlockedHost(host) {
  return state.sites.some(d => host === d || host.endsWith("." + d));
}

// match a bad keyword as a whole word (avoid blocking "scunthorpe"-type false hits roughly)
function hasBadKeyword(text) {
  const t = (text || "").toLowerCase();
  return state.keywords.some(k => new RegExp("(^|[^a-z])" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z]|$)").test(t));
}

function isExplicitSearch(url) {
  try {
    const u = new URL(url);
    if (!/(google\.|bing\.com|duckduckgo\.com|search\.yahoo|yandex\.)/.test(u.hostname)) return false;
    const q = u.searchParams.get("q") || u.searchParams.get("p") || u.searchParams.get("text") || "";
    return hasBadKeyword(decodeURIComponent(q));
  } catch (e) { return false; }
}

function blockedPage(reason, original) {
  return chrome.runtime.getURL("blocked.html") + "?r=" + encodeURIComponent(reason) + "&u=" + encodeURIComponent(original || "");
}

chrome.webNavigation.onBeforeNavigate.addListener(details => {
  if (!state.enabled || details.frameId !== 0) return;
  const url = details.url;
  if (url.startsWith(chrome.runtime.getURL(""))) return;
  let reason = null;
  if (isBlockedHost(hostOf(url))) reason = "site";
  else if (isExplicitSearch(url)) reason = "search";
  if (reason) {
    chrome.tabs.update(details.tabId, { url: blockedPage(reason, url) });
  }
});

// badge shows on/off
function updateBadge() {
  chrome.action.setBadgeText({ text: state.enabled ? "" : "off" });
  chrome.action.setBadgeBackgroundColor({ color: "#d9534f" });
}
chrome.storage.onChanged.addListener(updateBadge);
loadState().then(updateBadge);
