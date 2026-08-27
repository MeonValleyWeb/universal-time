import assert from 'node:assert/strict';
import test from 'node:test';
import { celestialEvents } from '../src/lib/celestial-events.ts';

test('astronomy events stay curated, sourced and useful', () => {
	assert.equal(celestialEvents.length, 5);
	assert.equal(new Set(celestialEvents.map((event) => event.slug)).size, celestialEvents.length);
	for (const event of celestialEvents) {
		assert.ok(event.name.length > 8, `${event.slug} needs a readable name`);
		assert.ok(Number.isFinite(new Date(event.at).getTime()), `${event.slug} needs an ISO event time`);
		assert.ok(event.detail.length > 100, `${event.slug} needs meaningful context`);
		assert.ok(event.visibility.length > 80, `${event.slug} needs useful visibility context`);
		assert.ok(event.localNote.length > 100, `${event.slug} needs local-time guidance`);
		assert.match(event.source.url, /^https:\/\/(science\.nasa\.gov|eclipse\.gsfc\.nasa\.gov|aa\.usno\.navy\.mil)\//, `${event.slug} needs an authoritative source`);
	}
});
