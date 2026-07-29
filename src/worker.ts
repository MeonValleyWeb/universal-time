import {
	NEWSLETTER_CONSENT_VERSION,
	validateNewsletterInput,
} from './lib/newsletter';

const canonicalHost = 'universaltime.app';
const maxJsonBytes = 8_192;

const json = (body: unknown, status = 200): Response =>
	Response.json(body, {
		status,
		headers: {
			'cache-control': 'no-store',
			'x-content-type-options': 'nosniff',
		},
	});

const requestIsSameOrigin = (request: Request): boolean => {
	const origin = request.headers.get('origin');
	return Boolean(origin && origin === new URL(request.url).origin);
};

const readBoundedJson = async (request: Request): Promise<unknown> => {
	const contentLength = Number(request.headers.get('content-length') || 0);
	if (contentLength > maxJsonBytes) throw new Error('payload_too_large');
	if (!request.body) throw new Error('missing_body');

	const reader = request.body.getReader();
	const chunks: Uint8Array[] = [];
	let total = 0;
	while (true) {
		const { value, done } = await reader.read();
		if (done) break;
		total += value.byteLength;
		if (total > maxJsonBytes) {
			await reader.cancel();
			throw new Error('payload_too_large');
		}
		chunks.push(value);
	}

	const body = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		body.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return JSON.parse(new TextDecoder().decode(body));
};

const subscribe = async (request: Request, env: Env): Promise<Response> => {
	if (!requestIsSameOrigin(request)) return json({ error: 'Request origin was not accepted.' }, 403);
	if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
		return json({ error: 'Send the subscription as JSON.' }, 415);
	}

	let raw: unknown;
	try {
		raw = await readBoundedJson(request);
	} catch (error) {
		const tooLarge = error instanceof Error && error.message === 'payload_too_large';
		return json({ error: tooLarge ? 'That request is too large.' : 'That request was not valid JSON.' }, tooLarge ? 413 : 400);
	}

	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
		return json({ error: 'That subscription was not valid.' }, 400);
	}

	const validated = validateNewsletterInput(raw);
	if (!validated.ok) return json({ error: validated.error }, 400);

	const now = new Date().toISOString();
	try {
		await env.NEWSLETTER_DB.prepare(`
			INSERT INTO newsletter_subscribers (
				id, email, email_normalized, birth_date, status, consent_version,
				consented_at, source, unsubscribe_token, created_at, updated_at
			) VALUES (?, ?, ?, ?, 'active', ?, ?, 'homepage-personal-time', ?, ?, ?)
			ON CONFLICT(email_normalized) DO UPDATE SET
				email = excluded.email,
				birth_date = excluded.birth_date,
				status = 'active',
				consent_version = excluded.consent_version,
				consented_at = excluded.consented_at,
				source = excluded.source,
				updated_at = excluded.updated_at
		`).bind(
			crypto.randomUUID(),
			validated.value.email,
			validated.value.emailNormalized,
			validated.value.birthDate,
			NEWSLETTER_CONSENT_VERSION,
			now,
			crypto.randomUUID(),
			now,
			now,
		).run();
	} catch (error) {
		console.error(JSON.stringify({
			event: 'newsletter_subscription_failed',
			error: error instanceof Error ? error.name : 'unknown',
		}));
		return json({ error: 'The timeline is temporarily unavailable. Please try again.' }, 503);
	}

	return json({
		ok: true,
		message: 'You are on the timeline. The first edition is still being wound up.',
	});
};

const unsubscribe = async (request: Request, env: Env): Promise<Response> => {
	if (!requestIsSameOrigin(request)) return json({ error: 'Request origin was not accepted.' }, 403);
	if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
		return json({ error: 'Send the unsubscribe request as JSON.' }, 415);
	}
	let raw: unknown;
	try {
		raw = await readBoundedJson(request);
	} catch {
		return json({ error: 'That request was not valid.' }, 400);
	}
	const token = raw && typeof raw === 'object' && !Array.isArray(raw)
		? (raw as { token?: unknown }).token
		: null;
	if (typeof token !== 'string' || !/^[0-9a-f-]{36}$/i.test(token)) {
		return json({ error: 'That unsubscribe link was not valid.' }, 400);
	}
	try {
		await env.NEWSLETTER_DB.prepare(`
			UPDATE newsletter_subscribers
			SET status = 'unsubscribed', updated_at = ?
			WHERE unsubscribe_token = ?
		`).bind(new Date().toISOString(), token).run();
	} catch (error) {
		console.error(JSON.stringify({
			event: 'newsletter_unsubscribe_failed',
			error: error instanceof Error ? error.name : 'unknown',
		}));
		return json({ error: 'The timeline is temporarily unavailable. Please try again.' }, 503);
	}
	return json({ ok: true, message: 'You have been unsubscribed.' });
};

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);

		if (url.hostname === `www.${canonicalHost}`) {
			url.hostname = canonicalHost;
			return Response.redirect(url.toString(), 308);
		}

		if (request.method === 'GET' && url.pathname === '/ads.txt') {
			const publisherId = env.ADSENSE_PUBLISHER_ID.trim();
			const body = /^pub-\d+$/.test(publisherId)
				? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
				: '# AdSense publisher ID is not configured yet.\n';
			return new Response(body, {
				headers: {
					'content-type': 'text/plain; charset=utf-8',
					'cache-control': 'public, max-age=300',
					'x-content-type-options': 'nosniff',
				},
			});
		}

		if (request.method === 'POST' && url.pathname === '/api/newsletter') {
			return subscribe(request, env);
		}
		if (request.method === 'POST' && url.pathname === '/api/newsletter/unsubscribe') {
			return unsubscribe(request, env);
		}

		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<Env>;
