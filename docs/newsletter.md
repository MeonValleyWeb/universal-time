# “On this day…” newsletter

The homepage personal time scale works entirely in the visitor’s browser. A date
of birth is sent to the server only when the visitor also enters an email
address, confirms they are 18 or over, consents to the newsletter and submits
the form.

## Stored data

Cloudflare D1 binding: `NEWSLETTER_DB`

- email address and lower-cased lookup value
- date of birth
- active, unsubscribed or suppressed status
- consent version and timestamp
- form source and record timestamps
- random unsubscribe token

Names, IP-derived profiles, user agents, calculator output and natural-language
time queries are not stored in the newsletter table.

## Migrations

Apply migrations locally before testing:

```sh
npx wrangler d1 migrations apply universal-time-newsletter --local
```

After verification, apply the same migrations to production:

```sh
npx wrangler d1 migrations apply universal-time-newsletter --remote
```

## Sending is intentionally separate

The subscription database and unsubscribe-ready status model are implemented.
No newsletter is sent yet. Before the first edition, add a sender with domain
authentication, render an unsubscribe link containing the stored token, process
bounces and complaints into `suppressed`, document the provider in
`/privacy`, and test the complete opt-out path.
