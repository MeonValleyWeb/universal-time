import assert from 'node:assert/strict';
import test from 'node:test';
import { cities, converterCorridors, converterPairs } from '../src/lib/cities.ts';

test('publishes a focused major-city inventory', () => {
	assert.ok(cities.length >= 50 && cities.length <= 55);
	assert.equal(new Set(cities.map((city) => city.slug)).size, cities.length);
});

test('publishes exactly 100 curated directional converter pages', () => {
	const slugs = new Set(cities.map((city) => city.slug));
	assert.equal(converterCorridors.length, 50);
	assert.equal(converterPairs.length, 100);
	assert.equal(new Set(converterPairs.map((pair) => `${pair.from}/${pair.to}`)).size, 100);
	for (const pair of converterPairs) {
		assert.ok(slugs.has(pair.from), `Unknown source city: ${pair.from}`);
		assert.ok(slugs.has(pair.to), `Unknown target city: ${pair.to}`);
		assert.notEqual(pair.from, pair.to);
		assert.ok(pair.reason.length > 30);
	}
});
