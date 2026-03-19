## ADDED Requirements

### Requirement: Detect suggested posts by label text

The content script SHALL identify feed cards as "suggested" when they contain the text "Suggested" as a standalone label within the card's metadata area (not within user-authored post body text).

#### Scenario: Feed card with "Suggested" label is detected

- **WHEN** a feed card in the LinkedIn feed contains a child element whose `textContent` is exactly "Suggested"
- **THEN** the system SHALL classify that card as a suggested post

#### Scenario: Feed card without "Suggested" label is not detected

- **WHEN** a feed card does not contain any child element with `textContent` of "Suggested" in its metadata area
- **THEN** the system SHALL NOT classify that card as a suggested post

#### Scenario: Post body containing the word "Suggested" is not falsely detected

- **WHEN** a feed card's user-authored body text contains the word "Suggested" but the card's metadata area does not have a standalone "Suggested" label
- **THEN** the system SHALL NOT classify that card as a suggested post

### Requirement: Detect suggested posts loaded via infinite scroll

The content script SHALL use a `MutationObserver` to detect new feed cards added to the DOM as the user scrolls, and SHALL evaluate each newly added card for the "Suggested" label.

#### Scenario: New feed cards loaded during scroll

- **WHEN** the user scrolls down and LinkedIn appends new feed cards to the DOM
- **THEN** the system SHALL evaluate each new card for the "Suggested" label within the observer callback

#### Scenario: Observer is active after initial page load

- **WHEN** the LinkedIn feed page finishes its initial render
- **THEN** the system SHALL have an active `MutationObserver` watching for new child nodes in the feed container
