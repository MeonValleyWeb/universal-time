export interface CountryTimeZone {
	zone: string;
	abbreviation: string;
	name: string;
	offset: string;
	places: string;
}

export interface CountryTimeGuide {
	slug: string;
	name: string;
	entryCitySlug: string;
	summary: string;
	zones: CountryTimeZone[];
	source: { label: string; url: string };
}

export const countryTimeGuides: CountryTimeGuide[] = [
	{
		slug: 'indonesia',
		name: 'Indonesia',
		entryCitySlug: 'jakarta',
		summary: 'Indonesia spans three official clocks. Ask for the city or island—not simply “Indonesia time”—when a time needs to be unambiguous.',
		zones: [
			{
				zone: 'Asia/Jakarta',
				abbreviation: 'WIB',
				name: 'Western Indonesia Time',
				offset: 'UTC+7',
				places: 'Jakarta, Sumatra, Java, West Kalimantan and Central Kalimantan',
			},
			{
				zone: 'Asia/Makassar',
				abbreviation: 'WITA',
				name: 'Central Indonesia Time',
				offset: 'UTC+8',
				places: 'Bali, Nusa Tenggara, Sulawesi, and South, East and North Kalimantan',
			},
			{
				zone: 'Asia/Jayapura',
				abbreviation: 'WIT',
				name: 'Eastern Indonesia Time',
				offset: 'UTC+9',
				places: 'Maluku and Papua',
			},
		],
		source: {
			label: 'BMKG — Indonesia’s national time reference',
			url: 'https://www.bmkg.go.id/tanda-waktu',
		},
	},
];

export const countryTimeGuideByEntryCity = (citySlug: string) =>
	countryTimeGuides.find((guide) => guide.entryCitySlug === citySlug);
