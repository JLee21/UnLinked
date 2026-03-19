(function () {
  "use strict";

  const MARKER_CLASS = "__suggested-hidden";
  const MAX_ANCESTOR_DEPTH = 15;

  const FEED_CARD_INDICATORS = [
    "feed-shared-update-v2",
    "fie-impression-container",
  ];

  const POST_BODY_INDICATORS = [
    "feed-shared-text",
    "feed-shared-update-v2__description",
    "update-components-text",
  ];

  let enabled = true;
  let observer = null;

  function isSuggestedLabel(el) {
    if (el.nodeType !== Node.ELEMENT_NODE) return false;
    const text = el.textContent.trim();
    if (text !== "Suggested") return false;

    let node = el;
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const cls = typeof node.className === "string" ? node.className : "";
        for (const indicator of POST_BODY_INDICATORS) {
          if (cls.includes(indicator)) return false;
        }
      }
      node = node.parentElement;
    }
    return true;
  }

  function findFeedCardContainer(el) {
    let node = el;
    let depth = 0;
    let bestCandidate = null;

    while (node && depth < MAX_ANCESTOR_DEPTH) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const cls = typeof node.className === "string" ? node.className : "";
        for (const indicator of FEED_CARD_INDICATORS) {
          if (cls.includes(indicator)) {
            bestCandidate = node;
          }
        }
      }
      node = node.parentElement;
      depth++;
    }

    return bestCandidate;
  }

  function hideFeedCard(container) {
    if (container.classList.contains(MARKER_CLASS)) return;
    container.style.display = "none";
    container.classList.add(MARKER_CLASS);
  }

  function restoreHiddenCards() {
    const hidden = document.querySelectorAll("." + MARKER_CLASS);
    for (const el of hidden) {
      el.style.removeProperty("display");
      el.classList.remove(MARKER_CLASS);
    }
  }

  function scanAndHide(root) {
    if (!enabled) return;

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT,
      null
    );

    let node;
    while ((node = walker.nextNode())) {
      if (!isSuggestedLabel(node)) continue;
      const container = findFeedCardContainer(node);
      if (container) {
        hideFeedCard(container);
      }
    }
  }

  function startObserver() {
    if (observer) return;

    const target = document.querySelector("main") || document.body;

    observer = new MutationObserver((mutations) => {
      if (!enabled) return;
      for (const mutation of mutations) {
        for (const added of mutation.addedNodes) {
          if (added.nodeType !== Node.ELEMENT_NODE) continue;
          scanAndHide(added);
        }
      }
    });

    observer.observe(target, { childList: true, subtree: true });
  }

  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function activate() {
    scanAndHide(document.body);
    startObserver();
  }

  function deactivate() {
    stopObserver();
    restoreHiddenCards();
  }

  chrome.storage.local.get({ enabled: true }, (result) => {
    enabled = result.enabled;
    if (enabled) {
      activate();
    }
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.enabled) return;
    enabled = changes.enabled.newValue;
    if (enabled) {
      activate();
    } else {
      deactivate();
    }
  });
})();
