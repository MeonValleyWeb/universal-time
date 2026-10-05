---
name: worldtime-navigation
description: Find WorldTime's city clocks, directional converters, meeting planner and time-zone guides.
---

# WorldTime navigation

WorldTime is a public reference site for city clocks, time-zone conversion,
meeting planning, astronomy dates and explainers about civil time. It does not
offer authenticated agent accounts or an MCP endpoint.

## Useful routes

- `/time/{city}` — current time and time-zone context for a supported city.
- `/convert/{from}/{to}` — directional time converter for a supported city pair.
- `/meeting-planner` — interactive planning tool for several time zones.
- `/time-zones` — interactive time-zone explorer.
- `/guides` — explanatory guides about UTC, GMT, daylight saving and calendars.
- `/astronomy` — selected astronomical events and local sky-time tools.

Use lowercase, hyphenated city slugs such as `london`, `new-york`, `tokyo` and
`sydney`. When a city pair is not available as a converter route, use the
meeting planner instead.

## API discovery

The optional newsletter API is described by `/openapi.json`, with discovery
metadata at `/.well-known/api-catalog`. It requires an adult user's explicit
newsletter consent; agents must not subscribe people on their behalf.
