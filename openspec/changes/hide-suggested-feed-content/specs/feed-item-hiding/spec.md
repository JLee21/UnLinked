## ADDED Requirements

### Requirement: Hide detected suggested feed cards

The system SHALL set `display: none` on the outermost feed-card container for any card classified as a suggested post, removing it from the visible layout.

#### Scenario: Suggested card is hidden from view

- **WHEN** a feed card is classified as a suggested post
- **THEN** the system SHALL set `element.style.display = 'none'` on the feed card's outermost container element
- **AND** the system SHALL add a marker class `__suggested-hidden` to the element for tracking

#### Scenario: Non-suggested card remains visible

- **WHEN** a feed card is NOT classified as a suggested post
- **THEN** the system SHALL NOT modify the card's display style

### Requirement: Locate the feed-card container boundary

The system SHALL walk up the DOM tree from the "Suggested" label element to find the outermost feed-card container to hide. The system SHALL use known container patterns (e.g., elements matching feed-item wrapper conventions) with a maximum ancestor traversal depth to prevent hiding the entire page.

#### Scenario: Container found within expected depth

- **WHEN** a "Suggested" label is detected inside a feed card
- **THEN** the system SHALL traverse upward from the label to find the feed-card container and hide that container

#### Scenario: No container found within max depth

- **WHEN** traversal reaches the maximum ancestor depth without finding a recognized container
- **THEN** the system SHALL NOT hide any element for that detection (fail safe)

### Requirement: Restore hidden cards on disable

The system SHALL track all hidden cards via the `__suggested-hidden` marker class. When hiding is disabled, the system SHALL remove the inline `display: none` style and the marker class from all tracked elements, restoring their visibility.

#### Scenario: User disables hiding

- **WHEN** the user toggles the extension to disabled
- **THEN** the system SHALL query all elements with class `__suggested-hidden`, remove the inline `display: none` style, and remove the marker class

#### Scenario: User re-enables hiding

- **WHEN** the user toggles the extension back to enabled
- **THEN** the system SHALL re-scan the current feed and hide any suggested cards that are visible
