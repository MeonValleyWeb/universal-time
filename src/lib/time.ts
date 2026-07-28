export interface TimeZoneOption {
	id: string;
	city: string;
	region: string;
	label: string;
}

export interface LocalTimeParts {
	year: number;
	hour: number;
	minute: number;
	day: number;
	weekday: string;
	month: string;
	abbreviation: string;
}

const formatterCache = new Map<string, Intl.DateTimeFormat>();

const formatter = (timeZone: string, key: string, options: Intl.DateTimeFormatOptions) => {
	const cacheKey = `${timeZone}:${key}`;
	let value = formatterCache.get(cacheKey);

	if (!value) {
		value = new Intl.DateTimeFormat('en-GB', { timeZone, ...options });
		formatterCache.set(cacheKey, value);
	}

	return value;
};

const fallbackZones = [
	'Pacific/Honolulu',
	'America/Anchorage',
	'America/Los_Angeles',
	'America/Denver',
	'America/Chicago',
	'America/New_York',
	'America/Sao_Paulo',
	'Atlantic/Reykjavik',
	'Europe/London',
	'Europe/Paris',
	'Africa/Cairo',
	'Africa/Johannesburg',
	'Asia/Dubai',
	'Asia/Kolkata',
	'Asia/Kathmandu',
	'Asia/Singapore',
	'Asia/Tokyo',
	'Australia/Adelaide',
	'Australia/Sydney',
	'Pacific/Auckland',
];

export const zoneOption = (id: string): TimeZoneOption => {
	const segments = id.split('/');
	const city = (segments.at(-1) ?? id).replaceAll('_', ' ');
	const region = segments.slice(0, -1).join(' · ').replaceAll('_', ' ');

	return {
		id,
		city,
		region,
		label: region ? `${city}, ${region}` : city,
	};
};

export const getTimeZoneOptions = (): TimeZoneOption[] => {
	const supportedValuesOf = (
		Intl as typeof Intl & { supportedValuesOf?: (key: 'timeZone') => string[] }
	).supportedValuesOf;
	const zones = supportedValuesOf?.('timeZone') ?? fallbackZones;

	return zones.map(zoneOption).sort((a, b) => a.city.localeCompare(b.city));
};

export const getLocalParts = (timestamp: number, timeZone: string): LocalTimeParts => {
	const parts = formatter(timeZone, 'parts', {
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		timeZoneName: 'short',
	}).formatToParts(timestamp);
	const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

	return {
		year: Number(values.year),
		hour: Number(values.hour),
		minute: Number(values.minute),
		day: Number(values.day),
		weekday: values.weekday ?? '',
		month: values.month ?? '',
		abbreviation: values.timeZoneName ?? '',
	};
};

export type DayPhase = 'Deep night' | 'Dawn' | 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export const getDayPhase = (timestamp: number, timeZone: string): DayPhase => {
	const { hour } = getLocalParts(timestamp, timeZone);
	if (hour < 5) return 'Deep night';
	if (hour < 8) return 'Dawn';
	if (hour < 12) return 'Morning';
	if (hour < 17) return 'Afternoon';
	if (hour < 20) return 'Evening';
	return 'Night';
};

const localDayNumber = (timestamp: number, timeZone: string) => {
	const parts = formatter(timeZone, 'local-day', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	}).formatToParts(timestamp);
	const values = Object.fromEntries(parts.map((part) => [part.type, Number(part.value)]));
	return Math.floor(Date.UTC(values.year, values.month - 1, values.day) / 86_400_000);
};

export const getDayRelation = (timestamp: number, timeZone: string, homeZone: string) => {
	const difference = localDayNumber(timestamp, timeZone) - localDayNumber(timestamp, homeZone);
	if (difference === 0) return 'Same day';
	if (difference === 1) return 'Next day';
	if (difference === -1) return 'Previous day';
	return difference > 0 ? `${difference} days ahead` : `${Math.abs(difference)} days behind`;
};

export const getMeetingScore = (timestamp: number, durationMinutes: number, timeZones: string[]) => {
	if (timeZones.length === 0) return 0;
	const sampleMinutes = 15;
	const samples = Math.max(1, Math.ceil(durationMinutes / sampleMinutes));
	let workingSamples = 0;

	for (const timeZone of timeZones) {
		for (let sample = 0; sample < samples; sample += 1) {
			const parts = getLocalParts(timestamp + sample * sampleMinutes * 60_000, timeZone);
			const decimalHour = parts.hour + parts.minute / 60;
			if (decimalHour >= 9 && decimalHour < 17) workingSamples += 1;
		}
	}

	return Math.round((workingSamples / (timeZones.length * samples)) * 100);
};

export const findBestMeetingStart = (
	rangeStart: number,
	rangeEnd: number,
	durationMinutes: number,
	timeZones: string[],
) => {
	const step = 30 * 60_000;
	const duration = durationMinutes * 60_000;
	let best = { timestamp: rangeStart, score: -1 };

	for (let timestamp = rangeStart; timestamp + duration <= rangeEnd; timestamp += step) {
		const score = getMeetingScore(timestamp, durationMinutes, timeZones);
		if (score > best.score) best = { timestamp, score };
	}

	return best;
};

export const formatClock = (timestamp: number, timeZone: string, hour12: boolean) =>
	formatter(timeZone, `clock-${hour12}`, {
		hour: 'numeric',
		minute: '2-digit',
		hour12,
	}).format(timestamp);

export const formatDate = (timestamp: number, timeZone: string) =>
	formatter(timeZone, 'date', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
	}).format(timestamp);

export const formatFullDate = (timestamp: number, timeZone: string) =>
	formatter(timeZone, 'full-date', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	}).format(timestamp);

export const getOffsetMinutes = (timestamp: number, timeZone: string) => {
	const parts = formatter(timeZone, 'offset', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hourCycle: 'h23',
	}).formatToParts(timestamp);
	const values = Object.fromEntries(parts.map((part) => [part.type, Number(part.value)]));
	const localAsUtc = Date.UTC(
		values.year,
		values.month - 1,
		values.day,
		values.hour,
		values.minute,
		values.second,
	);

	return Math.round((localAsUtc - timestamp) / 60_000);
};

export const formatOffset = (minutes: number) => {
	if (minutes === 0) return 'UTC';
	const sign = minutes > 0 ? '+' : '−';
	const absolute = Math.abs(minutes);
	const hours = Math.floor(absolute / 60);
	const remainder = absolute % 60;

	return `UTC${sign}${hours}${remainder ? `:${String(remainder).padStart(2, '0')}` : ''}`;
};

export const zonedDateToUtc = (
	year: number,
	month: number,
	day: number,
	hour: number,
	minute: number,
	timeZone: string,
) => {
	const guess = Date.UTC(year, month - 1, day, hour, minute);
	const firstOffset = getOffsetMinutes(guess, timeZone);
	const first = guess - firstOffset * 60_000;
	const secondOffset = getOffsetMinutes(first, timeZone);
	return guess - secondOffset * 60_000;
};
