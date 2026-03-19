## 1. Project Scaffold

- [x] 1.1 Create `manifest.json` with Manifest V3 configuration, content script registration for `https://www.linkedin.com/*`, browser action popup, and `storage` permission
- [x] 1.2 Create extension icon assets (16x16, 48x48, 128x128 PNG placeholders)

## 2. Content Script — Detection

- [x] 2.1 Create `content.js` with a function that scans a given DOM subtree for elements whose `textContent` is exactly "Suggested" in the feed card metadata area
- [x] 2.2 Implement feed-card container boundary detection — walk up from the "Suggested" label to the outermost feed-card wrapper, with a max-depth safety limit
- [x] 2.3 Add guard against false positives by restricting detection to metadata-area elements (not user-authored post body text)

## 3. Content Script — Hiding & Observation

- [x] 3.1 Implement the hide function: set `display: none` and add `__suggested-hidden` marker class on the feed-card container
- [x] 3.2 Set up a `MutationObserver` on the feed container that evaluates newly added nodes for the "Suggested" label
- [x] 3.3 Implement initial scan on page load to hide suggested cards already in the DOM
- [x] 3.4 Implement restore function: query all `.__suggested-hidden` elements, remove inline `display: none` and marker class

## 4. State Management

- [x] 4.1 On content script load, read `enabled` from `chrome.storage.local` (default to `true` if unset) and start/skip hiding accordingly
- [x] 4.2 Listen for `chrome.storage.onChanged` events to start or stop hiding in real time when the user toggles the popup

## 5. Popup UI

- [x] 5.1 Create `popup.html` with a simple toggle switch and minimal styling
- [x] 5.2 Create `popup.js` that reads current state from `chrome.storage.local`, reflects it in the toggle, and writes changes back on toggle interaction

## 6. Integration & Testing

- [ ] 6.1 Load the unpacked extension in Chrome and verify suggested cards are hidden on the LinkedIn feed
- [ ] 6.2 Verify infinite-scroll detection hides newly loaded suggested cards
- [ ] 6.3 Verify popup toggle disables/re-enables hiding and restores hidden cards
- [ ] 6.4 Verify state persists across page reload and browser restart

> Tasks 6.1–6.4 require manual browser testing by the user.
