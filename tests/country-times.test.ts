import assert from 'node:assert/strict';
import test from 'node:test';
import { countryTimeGuides } from '../src/lib/country-times.ts';

test('publishes Indonesia’s three distinct official clocks', () => {
	const indonesia = countryTimeGuides.find((guide) => guide.slug === 'indonesia');

	assert.ok(indonesia);
	assert.equal(indonesia.entryCitySlug, 'jakarta');
	assert.deepEqual(
		indonesia.zones.map((zone) => [zone.abbreviation, zone.offset]),
		[
			['WIB', 'UTC+7'],
			['WITA', 'UTC+8'],
			['WIT', 'UTC+9'],
		],
	);
	assert.match(indonesia.source.url, /^https:\/\//);
});
