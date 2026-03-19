## ADDED Requirements

### Requirement: Popup toggle UI

The extension SHALL provide a browser-action popup with a single on/off toggle that controls whether suggested feed items are hidden.

#### Scenario: Popup displays current state

- **WHEN** the user clicks the extension's browser-action icon
- **THEN** the popup SHALL display a toggle reflecting the current enabled/disabled state read from `chrome.storage.local`

#### Scenario: User enables hiding via toggle

- **WHEN** the user sets the toggle to "on"
- **THEN** the popup SHALL write `{ enabled: true }` to `chrome.storage.local`

#### Scenario: User disables hiding via toggle

- **WHEN** the user sets the toggle to "off"
- **THEN** the popup SHALL write `{ enabled: false }` to `chrome.storage.local`

### Requirement: Persist enabled/disabled state

The extension SHALL persist the hiding preference in `chrome.storage.local` so it survives browser restarts and tab reloads.

#### Scenario: State persists across page reload

- **WHEN** the user sets the toggle to disabled and reloads the LinkedIn page
- **THEN** the content script SHALL read `enabled: false` from `chrome.storage.local` and NOT hide suggested cards

#### Scenario: Default state on first install

- **WHEN** the extension is installed for the first time and no value exists in storage
- **THEN** the system SHALL default to `enabled: true` (hiding is on by default)

### Requirement: Real-time state sync to content script

The content script SHALL listen for `chrome.storage.onChanged` events and react immediately when the enabled/disabled state changes, without requiring a page reload.

#### Scenario: Toggle changed while page is open

- **WHEN** the user toggles the popup while a LinkedIn tab is open
- **THEN** the content script SHALL receive the storage change event and immediately start or stop hiding suggested cards
