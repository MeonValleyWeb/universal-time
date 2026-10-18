import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { canonicalRedirect } from '../src/lib/canonical.ts';

const readWorker = () => readFile(resolve(import.meta.dirname, '../src/worker.ts'), 'utf8');

test('permanently redirects HTTP requests to the canonical HTTPS host', async () => {
	const worker = await readWorker();

	assert.equal(
		canonicalRedirect(new URL('http://universaltime.app/time/london?source=search')),
		'https://universaltime.app/time/london?source=search',
	);
	assert.equal(canonicalRedirect(new URL('https://universaltime.app/time/london')), null);
	assert.match(worker, /canonicalRedirect\(url\)/);
	assert.match(worker, /Response\.redirect\(canonicalUrl, 308\)/);
});

test('preserves the canonical host redirect for www requests', async () => {
	const worker = await readWorker();

	assert.equal(
		canonicalRedirect(new URL('https://www.universaltime.app/time/london')),
		'https://universaltime.app/time/london',
	);
	assert.match(worker, /canonicalRedirect\(url\)/);
});
