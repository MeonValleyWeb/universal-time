import { cities, type City } from './cities.ts';
import { zonedDateToUtc } from './time.ts';

export interface NaturalTimeResult {
	source: City;
	target: City;
	timestamp: number;
	isCurrentTime: boolean;
	detectedTimeCount: number;
	warnings: string[];
}

const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const months: Record<string, number> = {
	january: 1,
	february: 2,
	march: 3,
	april: 4,
	may: 5,
	june: 6,
	july: 7,
	august: 8,
	september: 9,
	october: 10,
	november: 11,
	december: 12,
};

const escapePattern = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const aliasIndex = (input: string, alias: string) => {
	const pattern = new RegExp(`(^|[^a-z0-9])${escapePattern(alias.toLocaleLowerCase())}(?=$|[^a-z0-9])`, 'i');
	const match = pattern.exec(input);
	return match ? match.index + match[1].length : Number.POSITIVE_INFINITY;
};

export const findCities = (input: string) => {
	const lower = input.toLocaleLowerCase();
	return cities
		.map((city) => ({
			city,
			index: Math.min(...city.aliases.map((alias) => aliasIndex(lower, alias))),
		}))
		.filter(({ index }) => Number.isFinite(index))
		.sort((a, b) => a.index - b.index)
		.filter((entry, index, all) =>
			!all.slice(0, index).some((prior) => prior.city.zone === entry.city.zone && prior.index === entry.index)
		)
		.map(({ city }) => city);
};

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

const resolveDate = (input: string, source: City, now: number) => {
	const local = localDateParts(now, source.zone);
	const date = new Date(Date.UTC(local.year, local.month - 1, local.day));
	const lower = input.toLocaleLowerCase();

	if (lower.includes('tomorrow')) date.setUTCDate(date.getUTCDate() + 1);
	const weekday = weekdays.findIndex((day) => new RegExp(`\\b${day}\\b`).test(lower));
	if (weekday >= 0) {
		let advance = (weekday - date.getUTCDay() + 7) % 7;
		if (advance === 0 || lower.includes(`next ${weekdays[weekday]}`)) advance += 7;
		date.setUTCDate(date.getUTCDate() + advance);
	}

	const iso = input.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);
	if (iso) return { year: Number(iso[1]), month: Number(iso[2]), day: Number(iso[3]) };

	const dayMonth = lower.match(/\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)(?:\s+(20\d{2}))?\b/);
	if (dayMonth) {
		return {
			year: Number(dayMonth[3] ?? local.year),
			month: months[dayMonth[2]],
			day: Number(dayMonth[1]),
		};
	}

	const monthDay = lower.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:,?\s+(20\d{2}))?\b/);
	if (monthDay) {
		return {
			year: Number(monthDay[3] ?? local.year),
			month: months[monthDay[1]],
			day: Number(monthDay[2]),
		};
	}

	return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
};

const parseClock = (input: string) => {
	if (/\bnoon\b/i.test(input)) return { hour: 12, minute: 0, count: 1 };
	if (/\bmidnight\b/i.test(input)) return { hour: 0, minute: 0, count: 1 };

	const matches = [...input.matchAll(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/gi)];
	const twentyFourHourMatches = [...input.matchAll(/\b([01]\d|2[0-3]):([0-5]\d)\b/g)];
	const match = matches[0] ?? twentyFourHourMatches[0];
	if (!match) return null;

	let hour = Number(match[1]);
	const minute = Number(match[2] ?? 0);
	const period = match[3]?.toLocaleLowerCase();
	if (period === 'pm' && hour < 12) hour += 12;
	if (period === 'am' && hour === 12) hour = 0;

	return {
		hour,
		minute,
		count: matches.length + twentyFourHourMatches.length,
	};
};

const getWarnings = (input: string) => {
	const warnings: string[] = [];
	if (/\bIST\b/i.test(input)) warnings.push('IST can mean India, Ireland or Israel; interpreted as India Standard Time.');
	if (/\bCST\b/i.test(input)) warnings.push('CST can mean several zones; interpreted as US Central Time.');
	if (/\bBST\b/i.test(input)) warnings.push('BST is interpreted as British Summer Time.');
	return warnings;
};

export const parseNaturalTime = (
	input: string,
	now: number,
	defaultTarget: City = cities.find((city) => city.slug === 'london')!,
): NaturalTimeResult | null => {
	const found = findCities(input);
	if (!found.length) return null;

	const source = found[0];
	const clock = parseClock(input);
	const target = found[1] ?? (clock && defaultTarget.zone !== source.zone ? defaultTarget : source);
	const relative = input.match(/\bin\s+(\d+)\s*(minutes?|mins?|hours?|hrs?)\b/i);

	if (relative) {
		const amount = Number(relative[1]);
		const unit = relative[2].toLocaleLowerCase();
		const milliseconds = unit.startsWith('h') ? amount * 3_600_000 : amount * 60_000;
		return {
			source,
			target,
			timestamp: now + milliseconds,
			isCurrentTime: false,
			detectedTimeCount: 1,
			warnings: getWarnings(input),
		};
	}

	if (!clock) {
		return {
			source,
			target: source,
			timestamp: now,
			isCurrentTime: true,
			detectedTimeCount: 0,
			warnings: getWarnings(input),
		};
	}

	const date = resolveDate(input, source, now);
	return {
		source,
		target,
		timestamp: zonedDateToUtc(date.year, date.month, date.day, clock.hour, clock.minute, source.zone),
		isCurrentTime: false,
		detectedTimeCount: clock.count,
		warnings: getWarnings(input),
	};
};
