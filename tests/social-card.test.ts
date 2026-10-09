import assert from 'node:assert/strict';
import test from 'node:test';
import { cities } from '../src/lib/cities.ts';
import { citySocialCard, converterSocialCard, homepageSocialCard, plannerSocialCard } from '../src/lib/social-card.ts';

const london = cities.find((city) => city.slug === 'london')!;
const tokyo = cities.find((city) => city.slug === 'tokyo')!;

test('social cards are 1200px-wide, route-specific SVG images', () => {
	for (const card of [homepageSocialCard(), plannerSocialCard(), citySocialCard(london), converterSocialCard(london, tokyo)]) {
		assert.match(card, /<svg[^>]+width="1200"[^>]+height="630"/);
		assert.match(card, /WorldTime/);
	}
	assert.match(citySocialCard(london), /Time in London/);
	assert.match(converterSocialCard(london, tokyo), /London → Tokyo/);
});
