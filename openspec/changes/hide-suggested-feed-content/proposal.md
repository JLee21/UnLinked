## Why

LinkedIn's feed injects "Suggested" posts that are not from connections or followed pages, cluttering the feed with irrelevant content. There is no built-in option to permanently disable these. A lightweight Chrome extension can automatically detect and hide these cards so the feed only shows content the user opted into.

## What Changes

- Introduce a new Chrome extension (Manifest V3) that runs a content script on LinkedIn
- Content script observes the feed DOM and hides any feed card whose container includes the text "Suggested"
- Uses a `MutationObserver` to handle dynamically-loaded feed items during infinite scroll
- Provides a simple popup toggle so the user can enable/disable hiding without uninstalling the extension
- Persists the enabled/disabled state via `chrome.storage.local`

## Capabilities

### New Capabilities

- `suggested-content-detection`: Detect feed cards that are "Suggested" posts by scanning for the "Suggested" label within LinkedIn's feed item containers
- `feed-item-hiding`: Hide detected suggested feed items from the visible DOM in real-time, including items loaded dynamically via infinite scroll
- `user-toggle`: Browser-action popup with an on/off toggle that persists state, allowing users to pause or resume hiding

### Modified Capabilities

<!-- No existing capabilities to modify — this is a greenfield extension. -->

## Impact

- **New files**: `manifest.json`, content script, popup HTML/JS, optional icon assets
- **Host permissions**: Needs content script access to `https://www.linkedin.com/*`
- **Dependencies**: None — pure Manifest V3 Chrome APIs, no external libraries
- **Systems**: Runs entirely client-side in the browser; no backend or network calls
