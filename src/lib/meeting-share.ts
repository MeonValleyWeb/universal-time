export interface MeetingPlan {
	locations: string[];
	selectedTime: number;
	durationMinutes: number;
	hour12: boolean;
}

const durations = new Set([30, 60, 90, 120]);
const maximumLocations = 8;

const unique = (values: string[]) => [...new Set(values)];

export const parseMeetingPlan = (search: string, supportedZones: readonly string[]): MeetingPlan | null => {
	const params = new URLSearchParams(search);
	const timestamp = Number(params.get('at'));
	const durationMinutes = Number(params.get('duration') ?? 60);
	const locations = unique(
		(params.get('zones') ?? '')
			.split(',')
			.filter((zone) => supportedZones.includes(zone))
			.slice(0, maximumLocations),
	);

	if (!Number.isSafeInteger(timestamp) || timestamp <= 0 || !durations.has(durationMinutes) || locations.length === 0) {
		return null;
	}

	return {
		locations,
		selectedTime: Math.round(timestamp / 3_600_000) * 3_600_000,
		durationMinutes,
		hour12: params.get('format') === '12',
	};
};

export const meetingPlanSearch = (plan: MeetingPlan) => {
	const params = new URLSearchParams({
		zones: plan.locations.join(','),
		at: String(plan.selectedTime),
		duration: String(plan.durationMinutes),
		format: plan.hour12 ? '12' : '24',
	});
	return params.toString();
};

const calendarTime = (timestamp: number) => new Date(timestamp).toISOString().replaceAll(/[-:]/g, '').replace(/\.\d{3}/, '');

const calendarText = (value: string) => value
	.replaceAll('\\', '\\\\')
	.replaceAll(';', '\\;')
	.replaceAll(',', '\\,')
	.replaceAll(/\r?\n/g, '\\n');

export const meetingCalendar = ({
	plan,
	url,
	lines,
}: {
	plan: MeetingPlan;
	url: string;
	lines: string[];
}) => {
	const end = plan.selectedTime + plan.durationMinutes * 60_000;
	const uid = `${plan.selectedTime}-${plan.durationMinutes}-${plan.locations.join('-').replaceAll('/', '-')}`;

	return [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//WorldTime//Meeting Planner//EN',
		'CALSCALE:GREGORIAN',
		'BEGIN:VEVENT',
		`UID:${uid}@universaltime.app`,
		`DTSTAMP:${calendarTime(Date.now())}`,
		`DTSTART:${calendarTime(plan.selectedTime)}`,
		`DTEND:${calendarTime(end)}`,
		'SUMMARY:WorldTime meeting',
		`DESCRIPTION:${calendarText(['Planned with WorldTime', ...lines, url].join('\n'))}`,
		`URL:${url}`,
		'END:VEVENT',
		'END:VCALENDAR',
		'',
	].join('\r\n');
};
