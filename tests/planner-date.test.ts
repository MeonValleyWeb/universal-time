import assert from 'node:assert/strict';
import test from 'node:test';
import { plannerDate } from '../src/lib/planner-date.ts';
import { getPairContext } from '../src/lib/search-context.ts';
import { cityBySlug } from '../src/lib/cities.ts';

test('planner days follow the visitor date instead of any build date', () => {
	const today = Date.parse('2026-11-05T14:00:00Z');
	assert.equal(plannerDate(today, 0, 'Europe/London').start, Date.parse('2026-11-05T00:00:00Z'));
	assert.equal(plannerDate(today, 1, 'Europe/London').morning, Date.parse('2026-11-06T09:00:00Z'));
	assert.equal(plannerDate(Date.parse('2026-11-05T01:00:00Z'), 0, 'America/New_York').start, Date.parse('2026-11-04T05:00:00Z'));
});

test('calendar navigation preserves local midnight and 9am across DST', () => {
	const now = Date.parse('2026-10-24T12:00:00Z');
	const sunday = plannerDate(now, 1, 'Europe/London');
	const monday = plannerDate(now, 2, 'Europe/London');
	assert.equal(sunday.start, Date.parse('2026-10-24T23:00:00Z'));
	assert.equal(sunday.morning, Date.parse('2026-10-25T09:00:00Z'));
	assert.equal(monday.start - sunday.start, 25 * 3_600_000);
	const spring = plannerDate(Date.parse('2026-03-28T12:00:00Z'), 1, 'Europe/London');
	assert.equal(spring.morning, Date.parse('2026-03-29T08:00:00Z'));
});

test('converter guidance catches the UK/US transition-week difference', () => {
	const london = cityBySlug('london')!;
	const ny = cityBySlug('new-york')!;
	const beforeUSChange = getPairContext(london, ny, Date.parse('2026-10-28T12:00:00Z'));
	const afterUSChange = getPairContext(london, ny, Date.parse('2026-11-05T12:00:00Z'));
	assert.equal(beforeUSChange.currentGap, -240);
	assert.equal(afterUSChange.currentGap, -300);
	assert.match(beforeUSChange.overlapSummary, /13:00–17:00/);
	assert.match(afterUSChange.overlapSummary, /14:00–17:00/);
	assert.match(afterUSChange.dstSummary, /5 hours behind or 4 hours behind/);
});
