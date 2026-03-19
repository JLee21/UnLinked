## Context

LinkedIn dynamically renders feed items as the user scrolls. "Suggested" posts are injected alongside organic content and are identifiable by a text label (e.g., "Suggested") rendered inside the feed card's impression container. The DOM structure uses Ember-style element IDs and BEM-like class names that can change between LinkedIn deployments, so detection must rely on stable textual signals rather than brittle CSS selectors.

This is a greenfield Chrome extension — there is no existing codebase, infrastructure, or backend to integrate with.

## Goals / Non-Goals

**Goals:**

- Automatically hide any feed card containing the "Suggested" label from the LinkedIn feed
- Handle dynamically-loaded content (infinite scroll) via DOM observation
- Let the user enable/disable hiding through a browser-action popup
- Persist the enabled/disabled preference across sessions
- Keep the extension lightweight with zero external dependencies

**Non-Goals:**

- Blocking or filtering LinkedIn network requests (this is purely a DOM-level hide)
- Hiding other ad types, promoted posts, or sponsored content (only "Suggested" label)
- Supporting Firefox, Safari, or other browsers
- Providing granular filtering rules or a full ad-blocker UI
- Modifying any LinkedIn functionality beyond visual hiding of feed cards

## Decisions

### 1. Detection strategy: text content matching over CSS selectors

LinkedIn's class names and element IDs are auto-generated (Ember IDs like `#ember120`, hashed class names) and change across deployments. The "Suggested" label text is the stable signal. The content script will walk up from the text node to the nearest feed-item container and hide it.

**Alternative considered**: CSS selector targeting `.fie-impression-container` — rejected because these class names are minified/hashed and unreliable across LinkedIn releases.

### 2. Hiding mechanism: `display: none` via inline style

Setting `element.style.display = 'none'` on the feed card container is the simplest, most reliable approach. It removes the card from layout flow so there are no visual gaps.

**Alternative considered**: Removing the DOM node entirely — rejected because LinkedIn's JS may reference removed nodes and throw errors, and it makes "unhiding" impossible without a page reload.

### 3. DOM observation: single MutationObserver on the feed container

A single `MutationObserver` watching `childList` and `subtree` additions on the main feed container handles both initial page load and infinite scroll. The observer callback filters for added nodes only to avoid redundant processing.

**Alternative considered**: `setInterval` polling — rejected due to unnecessary CPU usage and delayed detection.

### 4. Feed card boundary detection: walk up to the nearest `div.feed-shared-update-v2` or equivalent

LinkedIn wraps each feed card in a recognizable container. The content script will traverse upward from the "Suggested" text node to find the outermost feed-item wrapper. A heuristic based on known container patterns (with fallback to a configurable ancestor depth) keeps this resilient.

### 5. State management: `chrome.storage.local`

The popup toggle writes `{ enabled: true/false }` to `chrome.storage.local`. The content script reads this on load and listens for `chrome.storage.onChanged` to react in real time without requiring a page refresh.

**Alternative considered**: `chrome.storage.sync` — rejected because this preference is device-local and doesn't need cross-device sync, and `local` has no rate limits.

### 6. Manifest V3

Using Manifest V3 as required by Chrome Web Store policy. No background service worker is needed — the content script and popup handle all logic directly.

## Risks / Trade-offs

- **LinkedIn DOM changes** → The text "Suggested" is the detection anchor. If LinkedIn localizes or changes this label, detection breaks. Mitigation: keep the detection logic in a single function that's easy to update; consider supporting multiple label variants in future iterations.
- **Performance on large feeds** → A `MutationObserver` on `subtree: true` can fire frequently. Mitigation: debounce the callback and only process `addedNodes` to limit scope.
- **False positives** → Other content might contain the word "Suggested" in a different context. Mitigation: only match when "Suggested" appears as a standalone label within the feed card's metadata area (first few child elements), not deep in post body text.
- **Re-showing hidden items** → When the user toggles off, previously hidden cards won't reappear until page reload because the original DOM state isn't tracked. Mitigation: on toggle-off, remove inline `display:none` styles from all hidden elements (tracked via a class marker).
