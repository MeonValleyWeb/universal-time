# Changelog

All notable public changes to WorldTime are recorded here.

## [0.2.1] - 2026-11-05

### Fixed

- Meeting-planner Today follows the current date in the home time zone, including daylight-saving transitions.
- Live clocks, offsets, abbreviations, calling windows and homepage groups refresh from the visitor’s current time instead of the build date.
- Static HTML uses loading states for current clock values; selected meeting times survive clock ticks and tab refocus.
- Seasonal time-difference guidance includes transition weeks when countries change clocks on different dates.

### Improved

- Every curated converter is linked from its source city page.
- Converter pages link to both city clocks and the reverse conversion.

## [0.2.0] - 2026-10-18

### Added

- Live country-clock pages for Indonesia and Mexico, including the places where a national time is not enough.
- City-specific context for high-demand clock pages, covering seasonal rules, country-wide differences and useful next steps.
- Public release notes at `/changelog` and a visible site version in the footer.

### Improved

- Worldwide meeting planning guidance, portable planner links and calendar exports.
- City-page titles and descriptions so search results explain the live local answer more clearly.

### Fixed

- HTTP requests now permanently redirect to the canonical HTTPS address.
- Meeting-planner hour selection works with click or double-click.
