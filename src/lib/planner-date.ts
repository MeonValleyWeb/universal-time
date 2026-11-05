import { zonedDateToUtc } from './time.ts';

export const plannerDate = (now: number, dayOffset: number, zone: string) => {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: zone, year: 'numeric', month: 'numeric', day: 'numeric',
	}).formatToParts(now);
	const fields = Object.fromEntries(parts.map((part) => [part.type, part.value]));
	const date = new Date(Date.UTC(Number(fields.year), Number(fields.month) - 1, Number(fields.day) + dayOffset));
	const at = (hour: number) => zonedDateToUtc(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), hour, 0, zone);
	return { start: at(0), morning: at(9) };
};
