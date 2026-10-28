export interface CountryTimeZone {
	zone: string;
	abbreviation: string;
	name: string;
	places: string;
}

export interface CountryTimeGuide {
	slug: string;
	name: string;
	entryCitySlug: string;
	metaTitle: string;
	metaDescription: string;
	summary: string;
	quickAnswer: string;
	question: string;
	planningCopy: string;
	zones: CountryTimeZone[];
	source: { label: string; url: string };
}

export const countryTimeGuides: CountryTimeGuide[] = [
	{
		slug: 'indonesia',
		name: 'Indonesia',
		entryCitySlug: 'jakarta',
		metaTitle: 'Time in Indonesia now: WIB, WITA and WIT',
		metaDescription: 'See the current time in Indonesia’s three official time zones: WIB, WITA and WIT. Find the right clock for Jakarta, Bali and Papua.',
		summary: 'Indonesia spans three official clocks. Ask for the city or island—not simply “Indonesia time”—when a time needs to be unambiguous.',
		quickAnswer: 'Jakarta uses WIB. Bali is one hour ahead on WITA; Papua is two hours ahead on WIT.',
		question: 'Which Indonesian time should I use?',
		planningCopy: 'For a call that includes Jakarta, Bali or Papua, add each place to the meeting planner. It calculates the local result from a named time zone rather than assuming one national offset.',
		zones: [
			{
				zone: 'Asia/Jakarta',
				abbreviation: 'WIB',
				name: 'Western Indonesia Time',
				places: 'Jakarta, Sumatra, Java, West Kalimantan and Central Kalimantan',
			},
			{
				zone: 'Asia/Makassar',
				abbreviation: 'WITA',
				name: 'Central Indonesia Time',
				places: 'Bali, Nusa Tenggara, Sulawesi, and South, East and North Kalimantan',
			},
			{
				zone: 'Asia/Jayapura',
				abbreviation: 'WIT',
				name: 'Eastern Indonesia Time',
				places: 'Maluku and Papua',
			},
		],
		source: {
			label: 'BMKG — Indonesia’s national time reference',
			url: 'https://www.bmkg.go.id/tanda-waktu',
		},
	},
	{
		slug: 'mexico',
		name: 'Mexico',
		entryCitySlug: 'mexico-city',
		metaTitle: 'Time in Mexico now: four official time zones',
		metaDescription: 'See the current time across Mexico’s Northwest, Pacific, Central and Southeast zones. Find the right clock for Tijuana, Mexico City, Mazatlán and Cancún.',
		summary: 'Mexico has four official time zones, plus special seasonal rules in some northern border municipalities. Name the city—not simply “Mexico time”—when a time needs to be unambiguous.',
		quickAnswer: 'Mexico City uses Central Time. Cancún, the Pacific states and Baja California use other official clocks.',
		question: 'Which Mexican time should I use?',
		planningCopy: 'For travel or a meeting, use the city where each person will be. The planner applies the right local rule for Mexico City, Tijuana, Cancún and every other named place on the date you choose.',
		zones: [
			{
				zone: 'America/Tijuana',
				abbreviation: 'Northwest',
				name: 'Northwest Time',
				places: 'Baja California, including Tijuana',
			},
			{
				zone: 'America/Mazatlan',
				abbreviation: 'Pacific',
				name: 'Pacific Time',
				places: 'Baja California Sur, Sinaloa, Sonora and much of Nayarit',
			},
			{
				zone: 'America/Mexico_City',
				abbreviation: 'Central',
				name: 'Central Time',
				places: 'Mexico City and much of central Mexico',
			},
			{
				zone: 'America/Cancun',
				abbreviation: 'Southeast',
				name: 'Southeast Time',
				places: 'Quintana Roo, including Cancún',
			},
		],
		source: {
			label: 'CENAM — Mexico’s official time',
			url: 'https://www.cenam.mx/hora_oficial/default2.aspx',
		},
	},
];

export const countryTimeGuideByEntryCity = (citySlug: string) =>
	countryTimeGuides.find((guide) => guide.entryCitySlug === citySlug);

export const countryTimeGuideBySlug = (slug: string) =>
	countryTimeGuides.find((guide) => guide.slug === slug);
