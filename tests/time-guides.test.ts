import assert from 'node:assert/strict';
import test from 'node:test';
import { timeGuides } from '../src/lib/guides.ts';

test('time guides form a curated, useful first knowledge inventory', () => {
	assert.ok(timeGuides.length >= 22);
	assert.equal(new Set(timeGuides.map((guide) => guide.slug)).size, timeGuides.length);
	for (const slug of [
		'who-invented-time-zones',
		'international-meridian-conference-1884',
		'why-time-zone-borders-are-crooked',
		'why-some-time-zones-have-30-or-45-minutes',
		'why-china-has-one-time-zone',
		'iana-time-zones-vs-utc-offsets',
		'why-governments-change-time-zones',
		'why-time-zone-abbreviations-are-ambiguous',
		'international-date-line-history',
		'british-and-american-daylight-saving-time-history',
	]) {
		assert.ok(timeGuides.some((guide) => guide.slug === slug), `missing Phase 1 guide: ${slug}`);
	}

	for (const guide of timeGuides) {
		assert.ok(guide.title.length > 12, `${guide.slug} needs a descriptive title`);
		assert.ok(guide.summary.length > 60, `${guide.slug} needs a useful search summary`);
		assert.ok(guide.sections.length >= 3, `${guide.slug} needs substantive sections`);
		assert.ok(guide.keyFacts.length >= 3, `${guide.slug} needs key facts`);
		assert.ok(guide.sources.length >= 1, `${guide.slug} needs a primary source`);

		for (const section of guide.sections) {
			assert.ok(section.body.length > 140, `${guide.slug}/${section.heading} is too thin`);
		}
		for (const source of guide.sources) {
			assert.match(source.url, /^https:\/\//);
		}
	}
});
