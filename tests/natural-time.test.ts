import assert from 'node:assert/strict';
import test from 'node:test';
import { cities } from '../src/lib/cities.ts';
import { parseNaturalTime } from '../src/lib/natural-time.ts';
import { formatClock } from '../src/lib/time.ts';

const now = Date.UTC(2026, 6, 29, 12, 0);
const london = cities.find((city) => city.slug === 'london')!;

test('converts a natural-language future time between cities', () => {
	const result = parseNaturalTime('3pm London in Tokyo next Thursday', now, london);
	assert.ok(result);
	assert.equal(result.source.slug, 'london');
	assert.equal(result.target.slug, 'tokyo');
	assert.equal(formatClock(result.timestamp, result.target.zone, false), '23:00');
});

test('understands noon and an explicit written date', () => {
	const result = parseNaturalTime('noon New York in London on 31 July 2026', now, london);
	assert.ok(result);
	assert.equal(formatClock(result.timestamp, result.target.zone, false), '17:00');
});

test('uses the visitor target when only a source city is supplied', () => {
	const result = parseNaturalTime('8am Tokyo tomorrow', now, london);
	assert.ok(result);
	assert.equal(result.target.slug, 'london');
});

test('handles relative durations', () => {
	const result = parseNaturalTime('Tokyo in 2 hours', now, london);
	assert.ok(result);
	assert.equal(result.timestamp, now + 7_200_000);
});

test('does not match short city aliases inside unrelated words', () => {
	const result = parseNaturalTime('planning a call at 3pm', now, london);
	assert.equal(result, null);
});

test('warns about ambiguous abbreviations', () => {
	const result = parseNaturalTime('9am IST in London', now, london);
	assert.ok(result);
	assert.match(result.warnings[0], /interpreted as India/);
});

test('answers a before-bed call question in the visitor local time', () => {
	const result = parseNaturalTime(
		'what time do I need to ring my daughter in New Zealand before I go to bed',
		now,
		london,
	);
	assert.ok(result);
	assert.equal(result.intent, 'before-bed');
	assert.equal(result.source.slug, 'london');
	assert.equal(result.target.slug, 'auckland');
	assert.equal(result.answer.slug, 'london');
	assert.equal(formatClock(result.timestamp, result.answer.zone, false), '21:30');
	assert.equal(formatClock(result.timestamp, result.target.zone, false), '8:30');
	assert.match(result.warnings[0], /Assuming bedtime/);
});

test('understands the common goto-bed spelling', () => {
	const result = parseNaturalTime(
		'when should I call New Zealand before I goto bed',
		now,
		london,
	);
	assert.ok(result);
	assert.equal(result.intent, 'before-bed');
});
