import { phaseOneTimeZoneGuides } from './time-zone-guides.ts';
import { timeZoneCaseStudies } from './time-zone-case-studies.ts';

export interface TimeGuide {
	slug: string;
	title: string;
	summary: string;
	category: 'Time zones' | 'How time works' | 'Standards' | 'History';
	sections: { heading: string; body: string }[];
	keyFacts: string[];
	sources: { label: string; url: string }[];
}

export const timeGuides: TimeGuide[] = [
	{
		slug: 'pdt-mdt-cdt-edt',
		title: 'What do PDT, MDT, CDT and EDT mean?',
		summary: 'The four daylight-time abbreviations used across the contiguous United States, their UTC offsets and their standard-time partners.',
		category: 'Time zones',
		sections: [
			{
				heading: 'The “D” means daylight time',
				body: 'PDT, MDT, CDT and EDT are the daylight-saving versions of the Pacific, Mountain, Central and Eastern zones. During daylight saving time, clocks are one hour ahead of their standard-time setting: PDT is UTC−7, MDT is UTC−6, CDT is UTC−5 and EDT is UTC−4.',
			},
			{
				heading: 'What they become in winter',
				body: 'When daylight saving time ends, the abbreviations normally change to PST (UTC−8), MST (UTC−7), CST (UTC−6) and EST (UTC−5). The broad region name—PT, MT, CT or ET—is often safer when you do not want to state whether daylight or standard time applies.',
			},
			{
				heading: 'The exceptions matter',
				body: 'Most of Arizona remains on MST throughout the year, while Hawaii uses HST and does not change its clocks. US territories also have their own rules. For dates in 2026, most participating US locations observe daylight saving time from March 8 at 02:00 local time until November 1 at 02:00 local time.',
			},
		],
		keyFacts: ['PDT UTC−7', 'MDT UTC−6', 'CDT UTC−5', 'EDT UTC−4', 'Most of Arizona stays on MST'],
		sources: [
			{ label: 'NIST Local Time FAQs', url: 'https://www.nist.gov/pml/time-and-frequency-division/local-time-faqs' },
			{ label: 'US Department of Transportation DST rules', url: 'https://www.transportation.gov/regulations/daylight-saving-time' },
		],
	},
	{
		slug: 'why-is-a-day-24-hours',
		title: 'Why is a day 24 hours long?',
		summary: 'Earth’s rotation gives us the day; ancient counting systems gave it 24 named hours.',
		category: 'How time works',
		sections: [
			{
				heading: 'Nature gives us the cycle, not the number',
				body: 'A day comes from Earth rotating relative to the Sun. The familiar 24-part division is a human convention layered onto that cycle, not a physical rule that days must contain 24 units.',
			},
			{
				heading: 'Twelve daylight hours and twelve night hours',
				body: 'Ancient Egyptian timekeepers divided daylight into twelve parts and the night into another twelve. The lengths of these seasonal hours originally changed through the year; later, mechanical clocks encouraged equal hours and the two sets became a 24-hour day.',
			},
			{
				heading: 'Solar days are not perfectly identical',
				body: 'The apparent solar day varies slightly because Earth’s orbit is elliptical and its axis is tilted. Civil clocks therefore use a mean solar day, smoothing those variations into equal 24-hour days.',
			},
		],
		keyFacts: ['One mean solar day is 24 hours', 'The division into 24 is historical', 'Apparent solar time varies through the year'],
		sources: [
			{ label: 'Royal Museums Greenwich — solar time', url: 'https://www.rmg.co.uk/stories/topics/what-time' },
			{ label: 'NIST Time and Frequency', url: 'https://www.nist.gov/pml/time-and-frequency-division' },
		],
	},
	{
		slug: 'why-60-minutes-in-an-hour',
		title: 'Why are there 60 minutes in an hour?',
		summary: 'The answer runs through Babylonian base-60 mathematics, Greek astronomy and medieval clockmaking.',
		category: 'How time works',
		sections: [
			{
				heading: 'Sixty divides cleanly',
				body: 'Sixty has many divisors: 2, 3, 4, 5, 6, 10, 12, 15, 20 and 30. That makes it unusually convenient for splitting a circle, an hour or an angle into common fractions without decimals.',
			},
			{
				heading: 'Astronomy carried base 60 forward',
				body: 'Babylonian mathematics used a sexagesimal, or base-60, system. Greek and later Islamic astronomers inherited sexagesimal subdivisions for angles, and the same language of first and second small parts became minutes and seconds.',
			},
			{
				heading: 'Clocks made the convention everyday',
				body: 'Early public clocks chiefly marked hours. As mechanisms improved, minute and then second hands made astronomical subdivisions visible in daily life, fixing 60 minutes per hour and 60 seconds per minute as the civil convention.',
			},
		],
		keyFacts: ['60 has twelve positive divisors', 'Minute means a first small division', 'Second means the second small division'],
		sources: [
			{ label: 'NIST — A Walk Through Time', url: 'https://www.nist.gov/pml/time-and-frequency-division/popular-links/walk-through-time' },
		],
	},
	{
		slug: 'how-do-atomic-clocks-work',
		title: 'How does an atomic clock work?',
		summary: 'Atomic clocks turn an invariant atomic transition into the world’s most stable tick.',
		category: 'Standards',
		sections: [
			{
				heading: 'Every clock needs an oscillator',
				body: 'A pendulum clock counts swings and a quartz clock counts crystal vibrations. An atomic clock instead tunes electromagnetic radiation to the natural resonant frequency of atoms, then uses feedback electronics to keep that frequency locked.',
			},
			{
				heading: 'The cesium definition of a second',
				body: 'Since 1967, the SI second has been defined using exactly 9,192,631,770 periods of radiation associated with a transition in the ground state of the cesium-133 atom. The atom is not a tiny clock face; it is a reproducible frequency reference.',
			},
			{
				heading: 'Why atomic time reaches your phone',
				body: 'National laboratories compare ensembles of atomic clocks, contributing to international time scales. Navigation systems, telecommunications networks and internet time services distribute that timing so ordinary devices can remain aligned.',
			},
		],
		keyFacts: ['The SI second uses cesium-133', '9,192,631,770 periods define one second', 'Atomic clocks underpin GPS and networks'],
		sources: [
			{ label: 'NIST — How Atomic Clocks Work', url: 'https://www.nist.gov/atomic-clocks/how-do-atomic-clocks-work' },
			{ label: 'NIST — How Atomic Time Gets to Your Computer', url: 'https://www.nist.gov/atomic-clocks/how-we-tell-time/how-does-atomic-time-get-your-computer' },
		],
	},
	{
		slug: 'utc-vs-gmt',
		title: 'UTC vs GMT: what is the difference?',
		summary: 'GMT is a historic mean-solar reference and modern time-zone label; UTC is the atomic international time standard.',
		category: 'Standards',
		sections: [
			{
				heading: 'UTC is the modern standard',
				body: 'Coordinated Universal Time, UTC, is the international civil time scale used to coordinate clocks worldwide. It is derived from atomic time and is kept close to Earth-rotation time through the leap-second system.',
			},
			{
				heading: 'GMT has two common meanings',
				body: 'Greenwich Mean Time began as mean solar time at Greenwich. Today GMT is also the legal or everyday name for the UTC+0 time zone used in the United Kingdom during winter and in several other places.',
			},
			{
				heading: 'For everyday conversion they show the same clock',
				body: 'UTC and GMT normally display the same hour and minute, so a meeting listed at 12:00 UTC is also 12:00 GMT. In technical work, UTC is preferred because it names the defined time standard rather than a regional civil-time label.',
			},
		],
		keyFacts: ['UTC is an atomic civil time scale', 'GMT is also a UTC+0 zone label', 'UTC does not observe daylight saving time'],
		sources: [
			{ label: 'BIPM — Time Metrology', url: 'https://www.bipm.org/en/time-metrology' },
			{ label: 'Royal Museums Greenwich — Greenwich Mean Time', url: 'https://www.rmg.co.uk/stories/topics/greenwich-mean-time-gmt' },
		],
	},
	{
		slug: 'how-time-zones-work',
		title: 'How do time zones work?',
		summary: 'Time zones convert one global instant into the local civil time chosen by each jurisdiction.',
		category: 'Time zones',
		sections: [
			{
				heading: 'Railways made local solar time impractical',
				body: 'Before standard time, towns commonly set clocks from the local Sun. That works while journeys are slow, but it becomes chaotic when railways need one dependable timetable across hundreds of miles. North American railroads adopted Standard Railway Time on 18 November 1883, and towns soon followed their shared clocks.',
			},
			{
				heading: 'Offsets connect local time to UTC',
				body: 'A time-zone offset says how far local civil time is ahead of or behind UTC at a particular instant. UTC+9 means the local clock reads nine hours later than UTC; UTC−5 means it reads five hours earlier.',
			},
			{
				heading: 'Zones are political, not neat longitude bands',
				body: 'The idealised world of 24 one-hour bands is only a starting point. Borders, trade, history and law produce half-hour and quarter-hour offsets, irregular boundaries and occasional permanent changes.',
			},
			{
				heading: 'A zone name is better than a fixed offset',
				body: 'An IANA name such as America/New_York stores a history and rule set, allowing software to find the correct offset for a specific date. A bare UTC−5 cannot tell you whether a future New York date falls in standard or daylight time.',
			},
			{
				heading: 'The rules are law, then data',
				body: 'There is no world government of civil time. Countries and regions choose their own clock rules, sometimes with little notice. The IANA Time Zone Database turns those legal and political decisions into data used by phones, browsers and servers, but a future conversion can still change if a government changes its rule.',
			},
		],
		keyFacts: ['Railways accelerated standard time', 'Time zones map instants to local civil time', 'Offsets can include 30 or 45 minutes', 'IANA rules change when governments change clocks'],
		sources: [
			{ label: 'IANA Time Zone Database', url: 'https://www.iana.org/time-zones' },
			{ label: 'NIST — World time scales', url: 'https://www.nist.gov/pml/time-and-frequency-division/popular-links/walk-through-time/walk-through-time-world-time-scales' },
		],
	},
	{
		slug: 'daylight-saving-time-explained',
		title: 'What is daylight saving time?',
		summary: 'Why clocks move, why the date differs by country and why a city’s offset cannot be assumed year-round.',
		category: 'Time zones',
		sections: [
			{
				heading: 'A seasonal civil-time policy',
				body: 'Daylight saving time advances local clocks, usually by one hour, for part of the year. It changes the civil label attached to an instant; it does not create extra daylight or alter Earth’s rotation.',
			},
			{
				heading: 'Transitions create unusual local times',
				body: 'During a spring-forward transition, a block of local clock readings does not occur. During a fall-back transition, a block repeats. That is why a date, city and time-zone rule are all required to identify some instants unambiguously.',
			},
			{
				heading: 'Rules differ and can change',
				body: 'Countries choose their own start dates, end dates and exemptions, while many never use daylight saving time. Reliable converters use an updated time-zone database rather than assuming one universal schedule.',
			},
		],
		keyFacts: ['DST changes civil clocks, not daylight', 'Spring transitions skip local times', 'Autumn transitions repeat local times'],
		sources: [
			{ label: 'NIST Daylight Saving Time Rules', url: 'https://www.nist.gov/pml/time-and-frequency-division/popular-links/daylight-saving-time-dst' },
			{ label: 'IANA Time Zone Database', url: 'https://www.iana.org/time-zones' },
		],
	},
	{
		slug: 'what-is-a-leap-second',
		title: 'What is a leap second?',
		summary: 'A one-second adjustment that has kept atomic civil time close to Earth’s irregular rotation.',
		category: 'Standards',
		sections: [
			{
				heading: 'Atomic clocks and Earth do not tick alike',
				body: 'Atomic time advances with highly stable SI seconds, while Earth’s rotation varies slightly. The astronomical scale UT1 therefore drifts relative to atomic time.',
			},
			{
				heading: 'UTC has used occasional adjustments',
				body: 'Since 1972, leap seconds have occasionally been inserted into UTC so that it remains close to UT1. A positive leap second labels an additional second 23:59:60 before the next day begins.',
			},
			{
				heading: 'The system is scheduled to change',
				body: 'International metrology bodies have agreed to increase the allowed difference between UTC and Earth-rotation time by or before 2035, reducing or eliminating the need for frequent leap seconds. The exact implementation remains a standards matter rather than a normal time-zone change.',
			},
		],
		keyFacts: ['Leap seconds adjust UTC, not local zone rules', 'They respond to Earth-rotation variation', '23:59:60 is a valid leap-second label'],
		sources: [
			{ label: 'NIST Leap Second FAQs', url: 'https://www.nist.gov/pml/time-and-frequency-division/leap-seconds-faqs' },
			{ label: 'BIPM Resolution on UTC', url: 'https://www.bipm.org/en/cgpm-2022/resolution-4' },
		],
	},
	{
		slug: 'international-date-line',
		title: 'How does the International Date Line work?',
		summary: 'The place where neighbouring civil time zones can carry dates one calendar day apart.',
		category: 'Time zones',
		sections: [
			{
				heading: 'A date boundary, not a wall',
				body: 'The International Date Line is the broad boundary where civil dates change as you travel east or west across the Pacific. Crossing westward normally adds a day; crossing eastward normally subtracts one.',
			},
			{
				heading: 'Why it bends',
				body: 'The line roughly follows the 180-degree meridian but bends around countries and island groups so that a jurisdiction can share one civil date. It is a convention assembled from time-zone choices, not a single treaty-defined physical line.',
			},
			{
				heading: 'The same instant, different dates',
				body: 'Auckland can be on Thursday while Honolulu is still on Wednesday, even though both clocks describe the same instant. Conversion must therefore show the date alongside the hour whenever a route approaches or crosses the Pacific date boundary.',
			},
		],
		keyFacts: ['Westward travel normally adds a day', 'Eastward travel normally subtracts a day', 'The line bends around political territories'],
		sources: [
			{ label: 'IANA Time Zone Database', url: 'https://www.iana.org/time-zones' },
		],
	},
	{
		slug: 'history-of-timekeeping',
		title: 'A short history of timekeeping',
		summary: 'From shadows and water flow to pendulums, quartz, atoms and globally synchronised networks.',
		category: 'History',
		sections: [
			{
				heading: 'Reading cycles in nature',
				body: 'Early timekeeping followed recurring natural events: the Sun’s shadow, the phases of the Moon and seasonal change. Sundials divided daylight, while water clocks and other flow-based devices measured intervals when the Sun was unavailable.',
			},
			{
				heading: 'Mechanical clocks made equal hours practical',
				body: 'Medieval mechanical clocks used escapements to release stored energy in controlled steps. Pendulum clocks greatly improved regularity in the seventeenth century, making accurate domestic and scientific timekeeping possible.',
			},
			{
				heading: 'Frequency became the modern foundation',
				body: 'Twentieth-century quartz clocks counted stable crystal oscillations. Atomic clocks then used reproducible atomic transition frequencies, supporting satellite navigation, communications, finance and the international time scales behind modern civil time.',
			},
		],
		keyFacts: ['Sundials measure apparent solar time', 'Pendulums improved mechanical regularity', 'Quartz and atomic clocks count frequencies'],
		sources: [
			{ label: 'NIST — A Walk Through Time', url: 'https://www.nist.gov/pml/time-and-frequency-division/popular-links/walk-through-time' },
			{ label: 'NIST — Atomic Clock Age', url: 'https://www.nist.gov/atomic-clocks/how-do-atomic-clocks-work' },
		],
	},
	{
		slug: 'solar-time-vs-clock-time',
		title: 'Solar time vs clock time',
		summary: 'Why the Sun is not always highest at 12:00 and why sunrise changes with both longitude and the calendar.',
		category: 'How time works',
		sections: [
			{
				heading: 'Apparent solar time follows the real Sun',
				body: 'Local apparent solar noon occurs when the Sun crosses the local meridian and reaches its highest point for the day. A sundial follows this apparent motion directly.',
			},
			{
				heading: 'Mean solar time smooths the variation',
				body: 'Earth’s tilted axis and non-circular orbit make apparent solar days vary. Mean solar time imagines a smoothly moving average Sun, giving equal clock days and producing the seasonal difference known as the equation of time.',
			},
			{
				heading: 'Civil time adds zones and seasonal policy',
				body: 'A time zone places many longitudes on one shared clock, while daylight saving policy may shift that clock again. As a result, solar noon can occur well before or after 12:00 civil time, especially near a zone boundary.',
			},
		],
		keyFacts: ['Solar noon is location-specific', 'Mean time uses an average Sun', 'Civil noon need not match solar noon'],
		sources: [
			{ label: 'Royal Museums Greenwich — What is time?', url: 'https://www.rmg.co.uk/stories/topics/what-time' },
		],
	},
	{
		slug: 'how-calendars-measure-time',
		title: 'How do calendars measure time?',
		summary: 'Days follow Earth’s rotation, months echo lunar cycles and years track Earth’s orbit—then rules make them fit.',
		category: 'History',
		sections: [
			{
				heading: 'Three natural cycles do not divide evenly',
				body: 'The solar day, lunar phase cycle and tropical year are independent astronomical periods. A year is not a whole number of lunar months or days, so every calendar must choose compromises and correction rules.',
			},
			{
				heading: 'Leap rules keep seasons aligned',
				body: 'The Gregorian calendar normally has 365 days and inserts leap days to approximate the tropical year. Century years are leap years only when divisible by 400, preventing the calendar from drifting as quickly as the older Julian rule.',
			},
			{
				heading: 'Calendars answer different cultural needs',
				body: 'Solar calendars keep months aligned with seasons, lunar calendars follow Moon phases, and lunisolar calendars add intercalary months to reconcile both. Civil date conversion therefore depends on which calendar system is being used.',
			},
		],
		keyFacts: ['A tropical year is not exactly 365 days', 'Gregorian century years must be divisible by 400 to leap', 'Lunar and solar calendars solve different problems'],
		sources: [
			{ label: 'US Naval Observatory — Calendars', url: 'https://aa.usno.navy.mil/faq/calendars' },
		],
	},
	...phaseOneTimeZoneGuides,
	...timeZoneCaseStudies,
];

export const guideBySlug = (slug: string) => timeGuides.find((guide) => guide.slug === slug);
