CREATE TABLE IF NOT EXISTS newsletter_subscribers (
	id TEXT PRIMARY KEY,
	email TEXT NOT NULL,
	email_normalized TEXT NOT NULL UNIQUE,
	birth_date TEXT NOT NULL CHECK (length(birth_date) = 10),
	status TEXT NOT NULL DEFAULT 'active'
		CHECK (status IN ('active', 'unsubscribed', 'suppressed')),
	consent_version TEXT NOT NULL,
	consented_at TEXT NOT NULL,
	source TEXT NOT NULL,
	unsubscribe_token TEXT NOT NULL UNIQUE,
	created_at TEXT NOT NULL,
	updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_newsletter_status_birthday
	ON newsletter_subscribers (status, substr(birth_date, 6, 5));
