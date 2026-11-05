import type { City } from './cities.ts';
import { formatClock, formatOffset, getLocalParts, getOffsetMinutes, zonedDateToUtc } from './time.ts';

const localDateParts = (timestamp: number, timeZone: string) => {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	}).formatToParts(timestamp);
	const values = Object.fromEntries(parts.map((part) => [part.type, Number(part.value)]));
	return { year: values.year, month: values.month, day: values.day };
};

const calendarDay = (timestamp: number, timeZone: string) => {
	const { year, month, day } = localDateParts(timestamp, timeZone);
	return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
};

export const formatGap = (minutes: number) => {
	if (minutes === 0) return 'the same local time';
	const absolute = Math.abs(minutes);
	const hours = Math.floor(absolute / 60);
	const remainder = absolute % 60;
	const amount = [
		hours ? `${hours} hour${hours === 1 ? '' : 's'}` : '',
		remainder ? `${remainder} minutes` : '',
	].filter(Boolean).join(' ');
	return `${amount} ${minutes > 0 ? 'ahead' : 'behind'}`;
};

export const getCitySeasonalContext = (city: City, year: number) => {
	const january = getOffsetMinutes(Date.UTC(year, 0, 15, 12), city.zone);
	const july = getOffsetMinutes(Date.UTC(year, 6, 15, 12), city.zone);
	if (january === july) {
		return `${city.name} keeps the same ${formatOffset(january)} offset in January and July, so its clock is generally stable through the year.`;
	}
	return `${city.name} changes seasonally: the offset is ${formatOffset(january)} in January and ${formatOffset(july)} in July. Always use the date of the call rather than assuming today’s gap.`;
};

const yearlyGapCache = new Map<string, number[]>();
const yearlyGaps = (from: City, to: City, year: number) => {
	const key = `${from.zone}:${to.zone}:${year}`;
	const cached = yearlyGapCache.get(key);
	if (cached) return cached;
	const gaps = new Set<number>();
	for (let day = Date.UTC(year, 0, 1, 12); day < Date.UTC(year + 1, 0, 1, 12); day += 86_400_000) {
		gaps.add(getOffsetMinutes(day, to.zone) - getOffsetMinutes(day, from.zone));
	}
	const result = [...gaps].sort((a, b) => a - b);
	yearlyGapCache.set(key, result);
	return result;
};

export const getPairContext = (from: City, to: City, now: number) => {
	const currentGap = getOffsetMinutes(now, to.zone) - getOffsetMinutes(now, from.zone);
	const currentGapText = formatGap(currentGap);
	const sourceDate = localDateParts(now, from.zone);
	const overlap: { timestamp: number; sourceHour: number }[] = [];

	for (let sourceHour = 9; sourceHour < 17; sourceHour += 1) {
		const timestamp = zonedDateToUtc(
			sourceDate.year,
			sourceDate.month,
			sourceDate.day,
			sourceHour,
			0,
			from.zone,
		);
		const targetHour = getLocalParts(timestamp, to.zone).hour;
		if (targetHour >= 9 && targetHour < 17) overlap.push({ timestamp, sourceHour });
	}

	let overlapSummary: string;
	if (overlap.length) {
		const first = overlap[0];
		const last = overlap.at(-1)!;
		const endTimestamp = last.timestamp + 3_600_000;
		overlapSummary = `${formatClock(first.timestamp, from.zone, false)}–${formatClock(endTimestamp, from.zone, false)} in ${from.name} overlaps with ${formatClock(first.timestamp, to.zone, false)}–${formatClock(endTimestamp, to.zone, false)} in ${to.name}.`;
	} else {
		overlapSummary = `There is no full hour when both cities are inside a standard 09:00–17:00 working day. Use an early start in one city or an evening call in the other.`;
	}

	const sourceMorning = zonedDateToUtc(
		sourceDate.year,
		sourceDate.month,
		sourceDate.day,
		9,
		0,
		from.zone,
	);
	const dayDifference = calendarDay(sourceMorning, to.zone) - calendarDay(sourceMorning, from.zone);
	const dateSummary = dayDifference === 0
		? `At 09:00 in ${from.name}, ${to.name} is on the same calendar date.`
		: dayDifference > 0
			? `At 09:00 in ${from.name}, ${to.name} is ${dayDifference === 1 ? 'already on the next calendar day' : `${dayDifference} calendar days ahead`}.`
			: `At 09:00 in ${from.name}, ${to.name} is ${dayDifference === -1 ? 'still on the previous calendar day' : `${Math.abs(dayDifference)} calendar days behind`}.`;

	const year = sourceDate.year;
	const gaps = yearlyGaps(from, to, year);
	const dstSummary = gaps.length === 1
		? `${to.name} stays ${formatGap(gaps[0])} ${from.name} across the current time-zone rules for ${year}.`
		: `${to.name} can be ${gaps.map(formatGap).join(' or ')} ${from.name} during ${year}, including transition weeks. Check the exact date of the call.`;

	return {
		currentGap,
		currentGapText,
		overlapSummary,
		dateSummary,
		dstSummary,
	};
};
