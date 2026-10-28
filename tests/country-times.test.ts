import assert from 'node:assert/strict';
import test from 'node:test';
import { countryTimeGuides } from '../src/lib/country-times.ts';

test('publishes source-backed multi-zone country clocks', () => {
	const indonesia = countryTimeGuides.find((guide) => guide.slug === 'indonesia');
	const mexico = countryTimeGuides.find((guide) => guide.slug === 'mexico');

	assert.ok(indonesia);
	assert.equal(indonesia.entryCitySlug, 'jakarta');
	assert.deepEqual(
		indonesia.zones.map((zone) => zone.abbreviation),
		['WIB', 'WITA', 'WIT'],
	);
	assert.match(indonesia.source.url, /^https:\/\//);

	assert.ok(mexico);
	assert.equal(mexico.entryCitySlug, 'mexico-city');
	assert.deepEqual(
		mexico.zones.map((zone) => zone.abbreviation),
		['Northwest', 'Pacific', 'Central', 'Southeast'],
	);
	assert.match(mexico.source.url, /^https:\/\//);
});
