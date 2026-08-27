import type { TimeGuide } from './guides.ts';

const ianaReleases = { label: 'IANA — Time Zone Database releases', url: 'https://www.iana.org/time-zones/releases' };

export const timeZoneCaseStudies: TimeGuide[] = [
	{
		slug: 'arizona-navajo-nation-daylight-saving-time',
		title: 'Why Arizona and the Navajo Nation use different summer clocks',
		summary: 'Most of Arizona stays on Mountain Standard Time all year, while the Navajo Nation observes daylight saving time: one of North America’s clearest examples of civil time following jurisdiction rather than a state outline.',
		category: 'Time zones',
		sections: [
			{ heading: 'Arizona opted out', body: 'Arizona law keeps the state on standard mountain time rather than adopting the seasonal daylight-saving change used across much of the United States. In practical terms, most of Arizona remains UTC−7 all year, even while nearby states move their clocks.' },
			{ heading: 'The Navajo Nation spans three states', body: 'The Navajo Nation observes daylight saving time, including its Arizona lands. The Nation explains that sharing a summer clock helps align Diné communities, services and relatives across Arizona, New Mexico and Utah. Geography alone cannot explain this boundary; administration and community links do.' },
			{ heading: 'A one-hour surprise for visitors', body: 'From spring to autumn, a drive within Arizona can cross from year-round MST into Navajo daylight time, one hour ahead. A meeting, park visit or transport plan therefore needs the named location and date, not simply “Arizona time”.' },
		],
		keyFacts: ['Most of Arizona stays on MST year-round', 'The Navajo Nation observes daylight saving time', 'The summer difference can be one hour inside Arizona'],
		sources: [
			{ label: 'Arizona Revised Statutes — Standard time', url: 'https://www.azleg.gov/ars/1/00242.htm' },
			{ label: 'Navajo Nation — daylight-saving announcement', url: 'https://opvp.navajo-nsn.gov/260307-daylight-savings-times/' },
		],
	},
	{
		slug: 'india-nepal-time-zone-offsets',
		title: 'Why India is UTC+5:30 and Nepal is UTC+5:45',
		summary: 'India and Nepal show why whole-hour offsets are not a rule. Their national clocks are fifteen minutes apart, despite sharing a long border and broadly similar longitude.',
		category: 'Time zones',
		sections: [
			{ heading: 'A national half-hour clock', body: 'India uses Indian Standard Time, UTC+5:30. It is one nationwide civil clock, rather than a stack of whole-hour bands. The extra half hour is a deliberate public standard; it is not a technical rounding error or a temporary daylight-saving setting.' },
			{ heading: 'Nepal adds another quarter hour', body: 'Nepal Standard Time is UTC+5:45, placing it fifteen minutes ahead of India. Nepal’s aviation and government material uses the same quarter-hour offset. The two countries make a useful everyday demonstration that the decimal-looking offset is still an exact civil-time rule.' },
			{ heading: 'The scheduling lesson', body: 'A call at 09:00 in Delhi is 09:15 in Kathmandu. Software that assumes every zone is an integer number of hours will be wrong. Store Asia/Kolkata or Asia/Kathmandu with an event, and display the calculated result for the date in question.' },
		],
		keyFacts: ['India uses UTC+5:30', 'Nepal uses UTC+5:45', 'Delhi and Kathmandu are 15 minutes apart by the clock'],
		sources: [
			{ label: 'India Meteorological Department — IST is UTC+5:30', url: 'https://rsmcnewdelhi.imd.gov.in/uploads/report/61/61_245057_Cyclone%20Warning%20SOP%20Booklet%20final.pdf' },
			{ label: 'Civil Aviation Authority of Nepal — UTC plus 45 minutes', url: 'https://e-aip.caanepal.gov.np/_uploads/_pdf/00af4ba5c646f86ce5e667d3b13e4f62.pdf' },
		],
	},
	{
		slug: 'samoa-date-line-jump-2011',
		title: 'Why Samoa skipped a whole day in 2011',
		summary: 'Samoa moved across the International Date Line at the end of 29 December 2011, so Friday 30 December never occurred there. It is a vivid demonstration that civil dates are a policy choice.',
		category: 'History',
		sections: [
			{ heading: 'A legal change, not time travel', body: 'Samoa’s International Date Line Act 2011 changed the country’s standard time from the American side of the date line to a time 13 hours ahead of UTC. The change took effect at midnight following Thursday 29 December 2011.' },
			{ heading: 'Friday 30 December was omitted', body: 'The next local calendar date was Saturday 31 December. The clock did not make Earth rotate differently; Samoa changed the civil date attached to the same sequence of instants. Historical records and date-based systems must therefore recognise that the local date was skipped.' },
			{ heading: 'Why the line bends', body: 'The US Naval Observatory notes that Samoa’s move was made by a government for local interests. It shows why the International Date Line is a convention that follows jurisdictions and practical relationships, not a rigid line imposed by geography.' },
		],
		keyFacts: ['Samoa changed its date-line position in 2011', 'Friday 30 December 2011 did not occur locally', 'The law set Samoa standard time at UTC+13'],
		sources: [
			{ label: 'Government of Samoa — International Date Line Act 2011', url: 'https://www.ag.gov.ws/wp-content/uploads/2024/02/International-Date-Line-Act-2011.pdf' },
			{ label: 'US Naval Observatory — International Date Line', url: 'https://aa.usno.navy.mil/faq/international_date' },
		],
	},
	{
		slug: 'russia-turkey-permanent-time-changes',
		title: 'Russia and Türkiye: when a government changes the clock permanently',
		summary: 'Time-zone rules can change in a single legal decision. Türkiye’s 2016 move to permanent UTC+3 and Russia’s many regional changes show why future calendar data needs named zones and regular updates.',
		category: 'Time zones',
		sections: [
			{ heading: 'Türkiye stopped changing clocks', body: 'Türkiye switched to permanent UTC+3 on 7 September 2016. That means Europe/Istanbul no longer follows a seasonal clock-change schedule. A fixed present-day offset is simple to display, but the date on which the rule began remains essential for historic data.' },
			{ heading: 'Russia is a moving regional map', body: 'Russia has several time zones and its regions have changed offsets more than once. IANA release notes record changes such as Samara joining Moscow time in 2010 and later moves in individual regions. “Russia time” is therefore not a sufficient meeting instruction.' },
			{ heading: 'Why applications need updates', body: 'A calendar created before a rule change can carry the wrong local result if it only stores a numeric offset. Time-zone databases encode transitions and are updated as governments act. A named zone gives software a chance to apply the new rule after an update.' },
		],
		keyFacts: ['Türkiye has used permanent UTC+3 since 2016', 'Russia has multiple regional time zones', 'Past and future offsets require a dated rule history'],
		sources: [ianaReleases, { label: 'IANA — Time Zone Database', url: 'https://www.iana.org/time-zones' }],
	},
	{
		slug: 'australia-state-daylight-saving-time',
		title: 'Why Australia has state-by-state daylight-saving time',
		summary: 'Australia is not one clock. Its states and territories use several standard offsets and make separate choices about daylight saving, creating summer differences inside one country.',
		category: 'Time zones',
		sections: [
			{ heading: 'Several standard clocks before summer begins', body: 'Australia already spans more than one standard offset: Perth uses UTC+8, the Northern Territory uses UTC+9:30, and eastern states use UTC+10. There are further local exceptions, including the UTC+8:45 area around Eucla and Lord Howe Island’s separate rule.' },
			{ heading: 'Daylight saving is not national', body: 'The ACT, New South Wales, South Australia, Tasmania and Victoria observe daylight saving. Queensland, the Northern Territory and Western Australia do not. During the summer transition period, Sydney and Brisbane can be an hour apart despite sharing the same standard eastern-time offset.' },
			{ heading: 'State rules create practical edge cases', body: 'Australian transport guidance also calls out Broken Hill, which follows South Australia’s clock rule rather than the rest of New South Wales. For bookings, school calls and remote work, use the city and date—not “Australian time”.' },
		],
		keyFacts: ['Australia uses several standard offsets', 'DST is observed in five states and territories', 'Queensland, Northern Territory and Western Australia do not observe DST'],
		sources: [
			{ label: 'National Heavy Vehicle Regulator — DST across Australia', url: 'https://www.nhvr.gov.au/safety-accreditation-compliance/fatigue-management/work-and-rest-requirements/managing-fatigue-work-and-rest-requirements-under-daylight-saving-time' },
			{ label: 'NSW Government — time zones and DST', url: 'https://csi.nsw.gov.au/content/dcj/dcj-website/dcj/about-us/daylight-saving/definitions-of-time-and-how-time-is-regulated.html' },
		],
	},
];
