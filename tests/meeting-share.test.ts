import assert from 'node:assert/strict';
import test from 'node:test';
import { meetingCalendar, meetingPlanSearch, parseMeetingPlan } from '../src/lib/meeting-share.ts';

const plan = {
	locations: ['Europe/London', 'America/New_York', 'Asia/Tokyo'],
	selectedTime: Date.UTC(2026, 9, 8, 9, 0),
	durationMinutes: 60,
	hour12: false,
};

test('round-trips a portable meeting plan through URL search parameters', () => {
	const search = meetingPlanSearch(plan);
	assert.equal(search, 'zones=Europe%2FLondon%2CAmerica%2FNew_York%2CAsia%2FTokyo&at=1791450000000&duration=60&format=24');
	assert.deepEqual(
		parseMeetingPlan(`?${search}`, [...plan.locations, 'Australia/Sydney']),
		plan,
	);
});

test('rejects unusable meeting-plan links', () => {
	const supported = ['Europe/London', 'America/New_York'];
	assert.equal(parseMeetingPlan('?zones=Invalid%2FZone&at=1&duration=60', supported), null);
	assert.equal(parseMeetingPlan('?zones=Europe%2FLondon&at=not-a-date&duration=60', supported), null);
	assert.equal(parseMeetingPlan('?zones=Europe%2FLondon&at=1791450000000&duration=45', supported), null);
});

test('creates an RFC 5545 calendar event with the plan details', () => {
	const calendar = meetingCalendar({
		plan,
		url: `https://universaltime.app/meeting-planner?${meetingPlanSearch(plan)}`,
		lines: ['London: Thu, Oct 8, 09:00–10:00', 'New York: Thu, Oct 8, 04:00–05:00'],
	});

	assert.match(calendar, /^BEGIN:VCALENDAR\r\nVERSION:2\.0/m);
	assert.match(calendar, /DTSTART:20261008T090000Z/);
	assert.match(calendar, /DTEND:20261008T100000Z/);
	assert.match(calendar, /SUMMARY:WorldTime meeting/);
	assert.match(calendar, /DESCRIPTION:Planned with WorldTime\\nLondon: Thu\\, Oct 8\\, 09:00–10:00/);
	assert.match(calendar, /END:VCALENDAR\r\n$/);
});
