import assert from 'node:assert/strict';
import test from 'node:test';

import {
	ageOn,
	isRealCalendarDate,
	validateNewsletterInput,
} from '../src/lib/newsletter.ts';

const now = new Date('2026-07-29T12:00:00.000Z');

test('validates real calendar dates and ages', () => {
	assert.equal(isRealCalendarDate('2000-02-29'), true);
	assert.equal(isRealCalendarDate('2001-02-29'), false);
	assert.equal(ageOn('2000-07-30', now), 25);
	assert.equal(ageOn('2000-07-29', now), 26);
});

test('accepts a minimal consenting adult subscription', () => {
	const result = validateNewsletterInput({
		email: '  Person@Example.com ',
		birthDate: '1990-04-12',
		consent: true,
		website: '',
	}, now);
	assert.equal(result.ok, true);
	if (result.ok) {
		assert.equal(result.value.email, 'Person@Example.com');
		assert.equal(result.value.emailNormalized, 'person@example.com');
	}
});

test('rejects missing consent, under-18 dates and honeypot submissions', () => {
	assert.equal(validateNewsletterInput({
		email: 'person@example.com',
		birthDate: '1990-04-12',
		consent: false,
	}, now).ok, false);
	assert.equal(validateNewsletterInput({
		email: 'person@example.com',
		birthDate: '2010-04-12',
		consent: true,
	}, now).ok, false);
	assert.equal(validateNewsletterInput({
		email: 'person@example.com',
		birthDate: '1990-04-12',
		consent: true,
		website: 'spam.example',
	}, now).ok, false);
});
