import assert from 'node:assert/strict';
import test from 'node:test';
import { cities } from '../src/lib/cities.ts';
import { cityTimeContexts } from '../src/lib/city-time-context.ts';

test('enriches priority city pages with unique metadata and guidance', () => {
	const citySlugs = new Set(cities.map((city) => city.slug));

	assert.ok(cityTimeContexts.length >= 20);
	for (const context of cityTimeContexts) {
		assert.ok(citySlugs.has(context.slug), `${context.slug} must have a city page`);
		assert.match(context.title, /time now/i);
		assert.ok(context.description.length > 80);
		assert.ok(context.body.length > 120);
		assert.match(context.related.href, /^\//);
	}
});
