import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('keeps Google ad units off the 404 and privacy pages', async () => {
	const [notFound, privacy] = await Promise.all([
		read('src/pages/404.astro'),
		read('src/pages/privacy.astro'),
	]);

	assert.doesNotMatch(notFound, /AdSlot|adsbygoogle|pagead2\.googlesyndication/);
	assert.doesNotMatch(privacy, /AdSlot|adsbygoogle|pagead2\.googlesyndication/);
});

test('places gated ad units only on substantive content templates', async () => {
	const [guide, converter, layout, adSlot] = await Promise.all([
		read('src/pages/guides/[slug].astro'),
		read('src/pages/convert/[from]/[to].astro'),
		read('src/layouts/BaseLayout.astro'),
		read('src/components/AdSlot.astro'),
	]);

	assert.match(guide, /PUBLIC_ADSENSE_GUIDE_SLOT/);
	assert.match(converter, /PUBLIC_ADSENSE_CONVERTER_SLOT/);
	assert.match(layout, /PUBLIC_ADSENSE_CONSENT_READY/);
	assert.match(adSlot, /Advertisement/);
});

test('publishes privacy and ads.txt discovery routes', async () => {
	const [sitemap, worker, privacy] = await Promise.all([
		read('src/pages/sitemap.xml.ts'),
		read('src/worker.ts'),
		read('src/pages/privacy.astro'),
	]);

	assert.match(sitemap, /path: '\/privacy'/);
	assert.match(worker, /url\.pathname === '\/ads\.txt'/);
	assert.match(worker, /f08c47fec0942fa0/);
	assert.match(privacy, /Cloudflare D1 database/);
});
