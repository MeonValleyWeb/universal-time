import type { TimeGuide } from './guides';

const iana = { label: 'IANA — Time Zone Database', url: 'https://www.iana.org/time-zones' };
const ianaTheory = { label: 'IANA — Theory and pragmatics of tz', url: 'https://www.iana.org/time-zones/theory' };
const nistWorldTime = { label: 'NIST — World time scales', url: 'https://www.nist.gov/pml/time-and-frequency-division/popular-links/walk-through-time/walk-through-time-world-time-scales' };

export const phaseOneTimeZoneGuides: TimeGuide[] = [
	{
		slug: 'who-invented-time-zones',
		title: 'Who invented time zones?',
		summary: 'Standard time was not invented by one person. Railway planners, scientists and public institutions converged on a shared answer to a very practical problem.',
		category: 'History',
		sections: [
			{ heading: 'Every town once kept its own time', body: 'Before standard time, local noon was set by the Sun. A town a little way east saw noon before a town west of it, so their clocks differed by minutes. That was manageable for local life and bewildering for a railway timetable.' },
			{ heading: 'Railways needed a timetable people could trust', body: 'In the United States, proposals by Charles F. Dowd, Sir Sandford Fleming and others helped shape a practical four-zone railway system. Railroad companies adopted Standard Railway Time on 18 November 1883, synchronising operations even before federal law later defined time-zone authority.' },
			{ heading: 'The invention was an agreement', body: 'Time zones are less like a patent and more like a public convention. The Sun provides longitude; transport, communication, governments and software decide which shared clock a place will use. That is why the system still changes when a government changes the rule.' },
		],
		keyFacts: ['Local solar time varies with longitude', 'North American railroads adopted Standard Railway Time in 1883', 'Standard time was a coordinated social and technical change'],
		sources: [
			{ label: 'Library of Congress — Standard Railway Time', url: 'https://www.loc.gov/item/today-in-history/november-18/' },
			nistWorldTime,
		],
	},
	{
		slug: 'international-meridian-conference-1884',
		title: 'What did the 1884 International Meridian Conference decide?',
		summary: 'The Washington conference selected Greenwich as a common zero meridian. It did not impose every modern time-zone border on the world.',
		category: 'History',
		sections: [
			{ heading: 'Longitude needs a starting line', body: 'Latitude has an obvious middle at the equator. Longitude does not, so maps and navigation need an agreed zero meridian. By 1884, Greenwich was already widely used on nautical charts and by navigators.' },
			{ heading: 'Delegates chose a common prime meridian', body: 'Representatives meeting in Washington in October 1884 chose the meridian through Greenwich as the initial meridian for longitude and a universal day. The choice made global coordination easier because it aligned with a practice already in widespread use.' },
			{ heading: 'It was not a global clock-law machine', body: 'The conference did not draw today’s civil-time borders or compel every country to use an identical local clock. Those are national and regional choices. The important legacy is the shared geographical reference from which offsets and modern UTC-based coordination are described.' },
		],
		keyFacts: ['The conference met in Washington in 1884', 'Greenwich became the agreed initial meridian', 'Local civil time remained a matter for jurisdictions'],
		sources: [
			{ label: 'NOAA — Longitude and the 1884 conference', url: 'https://oceanservice.noaa.gov/facts/longitude.html' },
			{ label: 'Library of Congress — 1885 Senate report on the conference', url: 'https://www.loc.gov/item/2024805055/' },
		],
	},
	{
		slug: 'why-time-zone-borders-are-crooked',
		title: 'Why are time-zone borders crooked?',
		summary: 'The textbook picture of 24 straight strips is a useful starting point. Real civil time follows communities, borders, trade and law.',
		category: 'Time zones',
		sections: [
			{ heading: 'Fifteen degrees is only the ideal', body: 'Earth turns 360 degrees in roughly 24 hours, so a one-hour zone is 15 degrees wide on average. That is a geometric convenience, not a rule that communities must follow.' },
			{ heading: 'Shared daily life matters more than longitude', body: 'A region may choose the clock used by a capital, trading partner or neighbouring administrative area. In the United States, many boundaries follow counties; elsewhere borders bend so a country or island group can share a date and working day.' },
			{ heading: 'A map is a snapshot of decisions', body: 'Time-zone boundaries and daylight-saving rules are changed by political bodies. Software therefore uses a rules database rather than calculating a zone from longitude alone. A coordinate lookup is useful, but the legal clock still has the final say.' },
		],
		keyFacts: ['One hour corresponds to 15 degrees only on average', 'Civil-time boundaries reflect local choices', 'Zone boundaries can change'],
		sources: [nistWorldTime, ianaTheory],
	},
	{
		slug: 'why-some-time-zones-have-30-or-45-minutes',
		title: 'Why do some time zones have 30- or 45-minute offsets?',
		summary: 'Half-hour and quarter-hour offsets are reminders that civil time is chosen for people, not forced into a 24-box diagram.',
		category: 'Time zones',
		sections: [
			{ heading: 'Offsets do not have to be whole hours', body: 'UTC offsets describe a local civil clock relative to UTC. They are often an integer number of hours, but there is no physical requirement for that. India uses UTC+5:30, Nepal uses UTC+5:45 and Newfoundland uses UTC−3:30.' },
			{ heading: 'They can better fit geography or policy', body: 'A half-hour can place a shared civil clock nearer a region’s solar rhythm than the nearest whole-hour choice. It can also distinguish a country’s clock from its neighbours while keeping a nationally useful standard.' },
			{ heading: 'Never round an offset in software', body: 'A fixed “UTC plus five” assumption loses real information. Good scheduling software stores an IANA zone and asks for the offset on the relevant date, including any daylight-saving transition, rather than inferring it from a nearby capital.' },
		],
		keyFacts: ['India uses UTC+5:30', 'Nepal uses UTC+5:45', 'Offsets are civil conventions, not a whole-hour requirement'],
		sources: [
			{ label: 'NOAA — Time zone offset table', url: 'https://gml.noaa.gov/grad/solcalc/timezone.html' },
			ianaTheory,
		],
	},
	{
		slug: 'why-china-has-one-time-zone',
		title: 'Why does China have one time zone?',
		summary: 'China spans several ideal longitude bands but uses one official national clock: China Standard Time, UTC+8.',
		category: 'Time zones',
		sections: [
			{ heading: 'One official clock across a wide country', body: 'China officially uses China Standard Time, also known as Beijing Time, at UTC+8. Government schedules, transport and other official timetables use that same civil time across the country.' },
			{ heading: 'Solar noon does not have to be noon on the clock', body: 'A single national clock means the Sun reaches its daily high point at different civil times across the country. That is not an error in the clock; it is the trade-off made when one administrative standard is used across a broad range of longitudes.' },
			{ heading: 'Use a zone identifier, not an abbreviation', body: 'CST is especially risky shorthand because it can mean China Standard Time, Central Standard Time or Cuba Standard Time depending on context. For a meeting, say China Standard Time or use Asia/Shanghai, then include the date.' },
		],
		keyFacts: ['China Standard Time is UTC+8', 'China has one official national time zone', 'CST is ambiguous internationally'],
		sources: [
			{ label: 'Chinese government portal — China Standard Time', url: 'https://govt.chinadaily.com.cn/s/201905/15/WS5cdbbd4f498e079e68020f1a/timezone.html' },
			{ label: 'China national standard — China Standard Time', url: 'https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=73C134B16448842CA681F1259929D7FA' },
		],
	},
	{
		slug: 'iana-time-zones-vs-utc-offsets',
		title: 'IANA time zones vs UTC offsets: what is the difference?',
		summary: 'UTC+1 is a number. Europe/Paris is a history, a rule set and a prediction for a particular place.',
		category: 'Standards',
		sections: [
			{ heading: 'An offset answers one narrow question', body: 'A UTC offset tells you the difference between UTC and a local clock at a particular instant. It is excellent for displaying a finished conversion, but it carries no information about where the rule came from or when it may change.' },
			{ heading: 'An IANA identifier carries rules', body: 'An IANA identifier such as Europe/Paris or America/New_York identifies a representative location and its known civil-time transitions. It lets a program calculate the correct offset for a past or future date, including daylight saving time.' },
			{ heading: 'Store the place with the event', body: 'For a future meeting, record the local wall time, date and time-zone identifier. Do not store only the current offset. If the jurisdiction changes its clocks before the meeting, updated time-zone data can apply the revised rule.' },
		],
		keyFacts: ['Offsets are instant-specific', 'IANA identifiers model civil-time history and predictions', 'Future events should keep a zone identifier'],
		sources: [iana, ianaTheory],
	},
	{
		slug: 'why-governments-change-time-zones',
		title: 'Why do governments change time-zone rules?',
		summary: 'Civil time is law and policy. A government can change an offset, daylight-saving schedule or boundary when it decides the practical benefits outweigh the disruption.',
		category: 'Time zones',
		sections: [
			{ heading: 'Clocks serve public life', body: 'Governments set civil time for their jurisdictions. Changes can be driven by trade, travel, energy policy, regional coordination, administrative convenience or political decisions. There is no single worldwide authority that can prevent a country changing its rule.' },
			{ heading: 'The difficult part is the notice', body: 'A new rule affects airline systems, calendars, payroll, broadcasting and ordinary meetings. Even a well-intentioned change can break future appointments if phones and servers have not received updated data by the time it takes effect.' },
			{ heading: 'Why WorldTime uses named zones', body: 'The IANA database is updated when political bodies change boundaries, offsets and daylight-saving rules. A named zone gives this site a route to the new rule; a hard-coded difference between two cities does not.' },
		],
		keyFacts: ['Civil time is set jurisdiction by jurisdiction', 'Rule changes affect future appointments', 'Time-zone data requires regular updates'],
		sources: [iana, ianaTheory],
	},
	{
		slug: 'why-time-zone-abbreviations-are-ambiguous',
		title: 'Why are time-zone abbreviations so ambiguous?',
		summary: 'CST, IST and BST look concise but can name different places and rules. A city or IANA zone is safer.',
		category: 'Time zones',
		sections: [
			{ heading: 'Three letters are not enough context', body: 'CST can refer to Central Standard Time in North America, China Standard Time or Cuba Standard Time. IST can mean India, Israel or Irish Standard Time. BST is used for British Summer Time and Bangladesh Standard Time.' },
			{ heading: 'Summer makes it worse', body: 'Some abbreviations change when daylight saving begins, while others do not. A meeting invitation saying “3pm CST” may be unclear even to people in the same country if it is sent months ahead.' },
			{ heading: 'Use a city, date and zone when it matters', body: 'Write “3pm in London on 8 October” or include a recognised identifier such as Europe/London. For technical systems, IANA names are designed to distinguish locations with different clock histories; abbreviations are chiefly display labels.' },
		],
		keyFacts: ['CST, IST and BST each have multiple meanings', 'Abbreviations can change with daylight saving time', 'A city and date make meeting times safer'],
		sources: [ianaTheory, { label: 'NIST — Local time FAQs', url: 'https://www.nist.gov/pml/time-and-frequency-division/local-time-faqs' }],
	},
	{
		slug: 'international-date-line-history',
		title: 'The International Date Line: history, rules and exceptions',
		summary: 'The Date Line separates consecutive calendar dates, but it is a convention that bends around political choices rather than a legal wall at exactly 180 degrees.',
		category: 'History',
		sections: [
			{ heading: 'A globe needs somewhere for the date to change', body: 'If local times progress around the Earth, the calendar must step from one date to the next somewhere. The International Date Line roughly follows the 180-degree meridian in the Pacific, opposite Greenwich.' },
			{ heading: 'Crossing changes the date label', body: 'Cross westward and the calendar normally advances by one day; cross eastward and it normally goes back by one day. The instant itself does not change—only the civil date used to describe it.' },
			{ heading: 'Countries can bend the line', body: 'The Date Line has no legal international status. It zigzags around political borders and island groups because jurisdictions choose the date they observe. That is why a time conversion across the Pacific must show both the hour and the date.' },
		],
		keyFacts: ['The Date Line roughly follows 180 degrees longitude', 'Westward crossings normally add a day', 'The line has no legal international status'],
		sources: [
			{ label: 'NOAA — International Date Line', url: 'https://oceanservice.noaa.gov/facts/international-date-line.html' },
			ianaTheory,
		],
	},
	{
		slug: 'british-and-american-daylight-saving-time-history',
		title: 'British and American daylight saving time: a short history',
		summary: 'Britain and the United States both move clocks seasonally, but their schedules and legal histories are different—and that difference matters for transatlantic meetings.',
		category: 'History',
		sections: [
			{ heading: 'British Summer Time is a specific civil rule', body: 'In the UK, clocks move forward by one hour at 01:00 on the last Sunday in March and back at 02:00 British Summer Time on the last Sunday in October. In winter, the UK uses Greenwich Mean Time.' },
			{ heading: 'The United States has its own calendar', body: 'The US daylight-saving schedule is set separately. Most participating locations change clocks on different March and November dates from the UK, so London and New York do not keep the same time difference throughout the transition weeks.' },
			{ heading: 'This is why dates matter', body: '“London is five hours ahead of New York” is usually useful, not permanently true. Schedule a meeting with both cities and the actual date; a converter using current time-zone rules can then account for the awkward weeks when one country has changed clocks and the other has not.' },
		],
		keyFacts: ['UK and US clock-change dates differ', 'The transatlantic gap changes during transition weeks', 'A date is essential for future conversions'],
		sources: [
			{ label: 'GOV.UK — When the clocks change', url: 'https://www.gov.uk/when-do-the-clocks-change' },
			{ label: 'NIST — Daylight saving time rules', url: 'https://www.nist.gov/pml/time-and-frequency-division/popular-links/daylight-saving-time-dst' },
		],
	},
];
