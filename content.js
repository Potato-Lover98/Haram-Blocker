// Ghassil content script: blur inappropriate images as a safety net.
(function () {
  let enabled = true, keywords = DEFAULT_KEYWORDS.slice();

  chrome.storage.sync.get(["enabled", "customKeywords"], s => {
    enabled = s.enabled !== false;
    keywords = DEFAULT_KEYWORDS.concat(s.customKeywords || []);
    if (enabled) scan();
  });

  function bad(text) {
    const t = (text || "").toLowerCase();
    return keywords.some(k => t.includes(k));
  }

  function blur(img) {
    if (img.dataset.ghassil) return;
    img.dataset.ghassil = "1";
    img.style.filter = "blur(28px)";
    img.style.cursor = "pointer";
    img.title = "Blurred by Ghassil — click to reveal";
    img.addEventListener("click", function rev(e) {
      e.preventDefault(); e.stopPropagation();
      img.style.filter = ""; img.removeEventListener("click", rev);
    }, true);
  }

  function check(img) {
    const meta = (img.alt || "") + " " + (img.title || "") + " " + (img.src || "");
    if (bad(meta)) blur(img);
  }

  function scan() {
    document.querySelectorAll("img").forEach(check);
  }

  // observe dynamically added images
  const mo = new MutationObserver(muts => {
    if (!enabled) return;
    for (const m of muts) for (const n of m.addedNodes) {
      if (n.tagName === "IMG") check(n);
      else if (n.querySelectorAll) n.querySelectorAll("img").forEach(check);
    }
  });
  document.addEventListener("DOMContentLoaded", () => { if (enabled) scan(); });
  try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
})();
