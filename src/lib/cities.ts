export interface City {
	slug: string;
	name: string;
	country: string;
	zone: string;
	aliases: string[];
	description: string;
}

export const cities: City[] = [
	{ slug: 'utc', name: 'UTC', country: 'Universal Time', zone: 'UTC', aliases: ['utc', 'gmt', 'zulu'], description: 'Coordinated Universal Time, the global reference for civil timekeeping.' },
	{ slug: 'london', name: 'London', country: 'United Kingdom', zone: 'Europe/London', aliases: ['london', 'uk', 'britain', 'bst'], description: 'The reference clock for the United Kingdom and a bridge between the Americas and Asia.' },
	{ slug: 'new-york', name: 'New York', country: 'United States', zone: 'America/New_York', aliases: ['new york', 'nyc', 'eastern', 'est', 'edt'], description: 'Eastern Time for New York and much of the US East Coast.' },
	{ slug: 'los-angeles', name: 'Los Angeles', country: 'United States', zone: 'America/Los_Angeles', aliases: ['los angeles', 'la', 'pacific', 'pst', 'pdt'], description: 'Pacific Time for Los Angeles and the US West Coast.' },
	{ slug: 'san-francisco', name: 'San Francisco', country: 'United States', zone: 'America/Los_Angeles', aliases: ['san francisco', 'sf', 'bay area'], description: 'Pacific Time for San Francisco, Silicon Valley and the wider Bay Area.' },
	{ slug: 'seattle', name: 'Seattle', country: 'United States', zone: 'America/Los_Angeles', aliases: ['seattle'], description: 'Pacific Time in Seattle and the Pacific Northwest.' },
	{ slug: 'chicago', name: 'Chicago', country: 'United States', zone: 'America/Chicago', aliases: ['chicago', 'central', 'cst', 'cdt'], description: 'Central Time for Chicago and the central United States.' },
	{ slug: 'denver', name: 'Denver', country: 'United States', zone: 'America/Denver', aliases: ['denver', 'mountain time', 'mst', 'mdt'], description: 'Mountain Time in Denver and much of the US Mountain West.' },
	{ slug: 'dallas', name: 'Dallas', country: 'United States', zone: 'America/Chicago', aliases: ['dallas', 'fort worth', 'dfw'], description: 'Central Time for Dallas, Fort Worth and North Texas.' },
	{ slug: 'miami', name: 'Miami', country: 'United States', zone: 'America/New_York', aliases: ['miami'], description: 'Eastern Time in Miami and South Florida.' },
	{ slug: 'toronto', name: 'Toronto', country: 'Canada', zone: 'America/Toronto', aliases: ['toronto'], description: 'Eastern Time in Canada’s largest city.' },
	{ slug: 'vancouver', name: 'Vancouver', country: 'Canada', zone: 'America/Vancouver', aliases: ['vancouver'], description: 'Pacific Time on Canada’s west coast.' },
	{ slug: 'mexico-city', name: 'Mexico City', country: 'Mexico', zone: 'America/Mexico_City', aliases: ['mexico city', 'cdmx'], description: 'Local time in Mexico’s capital.' },
	{ slug: 'sao-paulo', name: 'São Paulo', country: 'Brazil', zone: 'America/Sao_Paulo', aliases: ['sao paulo', 'são paulo'], description: 'Local time in Brazil’s commercial centre.' },
	{ slug: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', zone: 'America/Argentina/Buenos_Aires', aliases: ['buenos aires', 'argentina', 'art'], description: 'Argentina Time in Buenos Aires, with no seasonal clock change.' },
	{ slug: 'lima', name: 'Lima', country: 'Peru', zone: 'America/Lima', aliases: ['lima', 'peru', 'pet'], description: 'Peru Time in Lima, five hours behind UTC throughout the year.' },
	{ slug: 'paris', name: 'Paris', country: 'France', zone: 'Europe/Paris', aliases: ['paris', 'france', 'cet', 'cest'], description: 'Central European Time in Paris.' },
	{ slug: 'berlin', name: 'Berlin', country: 'Germany', zone: 'Europe/Berlin', aliases: ['berlin', 'germany'], description: 'Central European Time in Germany’s capital.' },
	{ slug: 'madrid', name: 'Madrid', country: 'Spain', zone: 'Europe/Madrid', aliases: ['madrid', 'spain'], description: 'Central European Time in Madrid and mainland Spain.' },
	{ slug: 'rome', name: 'Rome', country: 'Italy', zone: 'Europe/Rome', aliases: ['rome', 'italy'], description: 'Central European Time in Rome and mainland Italy.' },
	{ slug: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', zone: 'Europe/Amsterdam', aliases: ['amsterdam', 'netherlands', 'holland'], description: 'Central European Time in Amsterdam and the Netherlands.' },
	{ slug: 'stockholm', name: 'Stockholm', country: 'Sweden', zone: 'Europe/Stockholm', aliases: ['stockholm', 'sweden'], description: 'Central European Time in Stockholm and Sweden.' },
	{ slug: 'istanbul', name: 'Istanbul', country: 'Türkiye', zone: 'Europe/Istanbul', aliases: ['istanbul', 'turkey', 'türkiye', 'trt'], description: 'Türkiye Time in Istanbul, fixed at UTC+3 throughout the year.' },
	{ slug: 'moscow', name: 'Moscow', country: 'Russia', zone: 'Europe/Moscow', aliases: ['moscow', 'russia', 'msk'], description: 'Moscow Standard Time, fixed at UTC+3 throughout the year.' },
	{ slug: 'cairo', name: 'Cairo', country: 'Egypt', zone: 'Africa/Cairo', aliases: ['cairo', 'egypt'], description: 'Local time in Cairo and Egypt.' },
	{ slug: 'johannesburg', name: 'Johannesburg', country: 'South Africa', zone: 'Africa/Johannesburg', aliases: ['johannesburg', 'joburg', 'south africa', 'sast'], description: 'South Africa Standard Time in Johannesburg.' },
	{ slug: 'lagos', name: 'Lagos', country: 'Nigeria', zone: 'Africa/Lagos', aliases: ['lagos', 'nigeria', 'wat'], description: 'West Africa Time in Lagos.' },
	{ slug: 'nairobi', name: 'Nairobi', country: 'Kenya', zone: 'Africa/Nairobi', aliases: ['nairobi', 'kenya', 'eat'], description: 'East Africa Time in Nairobi, fixed at UTC+3 throughout the year.' },
	{ slug: 'dubai', name: 'Dubai', country: 'United Arab Emirates', zone: 'Asia/Dubai', aliases: ['dubai', 'uae', 'gst'], description: 'Gulf Standard Time in Dubai.' },
	{ slug: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', zone: 'Asia/Riyadh', aliases: ['riyadh', 'saudi arabia', 'ast'], description: 'Arabia Standard Time in Riyadh, fixed at UTC+3 throughout the year.' },
	{ slug: 'karachi', name: 'Karachi', country: 'Pakistan', zone: 'Asia/Karachi', aliases: ['karachi', 'pakistan', 'pkt'], description: 'Pakistan Standard Time in Karachi, five hours ahead of UTC.' },
	{ slug: 'dhaka', name: 'Dhaka', country: 'Bangladesh', zone: 'Asia/Dhaka', aliases: ['dhaka', 'bangladesh', 'bst bangladesh'], description: 'Bangladesh Standard Time in Dhaka, six hours ahead of UTC.' },
	{ slug: 'delhi', name: 'Delhi', country: 'India', zone: 'Asia/Kolkata', aliases: ['delhi', 'new delhi', 'india', 'ist'], description: 'India Standard Time in Delhi.' },
	{ slug: 'mumbai', name: 'Mumbai', country: 'India', zone: 'Asia/Kolkata', aliases: ['mumbai', 'bombay'], description: 'India Standard Time in Mumbai.' },
	{ slug: 'singapore', name: 'Singapore', country: 'Singapore', zone: 'Asia/Singapore', aliases: ['singapore', 'sgt'], description: 'Singapore Standard Time.' },
	{ slug: 'kuala-lumpur', name: 'Kuala Lumpur', country: 'Malaysia', zone: 'Asia/Kuala_Lumpur', aliases: ['kuala lumpur', 'malaysia', 'myt'], description: 'Malaysia Time in Kuala Lumpur, eight hours ahead of UTC.' },
	{ slug: 'bangkok', name: 'Bangkok', country: 'Thailand', zone: 'Asia/Bangkok', aliases: ['bangkok', 'thailand', 'ict'], description: 'Indochina Time in Bangkok.' },
	{ slug: 'ho-chi-minh-city', name: 'Ho Chi Minh City', country: 'Vietnam', zone: 'Asia/Ho_Chi_Minh', aliases: ['ho chi minh city', 'saigon', 'vietnam'], description: 'Indochina Time in Ho Chi Minh City, seven hours ahead of UTC.' },
	{ slug: 'manila', name: 'Manila', country: 'Philippines', zone: 'Asia/Manila', aliases: ['manila', 'philippines', 'pht'], description: 'Philippine Time in Manila, eight hours ahead of UTC.' },
	{ slug: 'hong-kong', name: 'Hong Kong', country: 'Hong Kong', zone: 'Asia/Hong_Kong', aliases: ['hong kong', 'hkt'], description: 'Hong Kong Time.' },
	{ slug: 'taipei', name: 'Taipei', country: 'Taiwan', zone: 'Asia/Taipei', aliases: ['taipei', 'taiwan'], description: 'Taipei Standard Time, eight hours ahead of UTC throughout the year.' },
	{ slug: 'shanghai', name: 'Shanghai', country: 'China', zone: 'Asia/Shanghai', aliases: ['shanghai', 'china', 'beijing time'], description: 'China Standard Time in Shanghai.' },
	{ slug: 'beijing', name: 'Beijing', country: 'China', zone: 'Asia/Shanghai', aliases: ['beijing', 'peking'], description: 'China Standard Time in Beijing, eight hours ahead of UTC.' },
	{ slug: 'tokyo', name: 'Tokyo', country: 'Japan', zone: 'Asia/Tokyo', aliases: ['tokyo', 'japan', 'jst'], description: 'Japan Standard Time in Tokyo.' },
	{ slug: 'seoul', name: 'Seoul', country: 'South Korea', zone: 'Asia/Seoul', aliases: ['seoul', 'korea', 'kst'], description: 'Korea Standard Time in Seoul.' },
	{ slug: 'jakarta', name: 'Jakarta', country: 'Indonesia', zone: 'Asia/Jakarta', aliases: ['jakarta', 'wib'], description: 'Western Indonesia Time in Jakarta.' },
	{ slug: 'perth', name: 'Perth', country: 'Australia', zone: 'Australia/Perth', aliases: ['perth', 'awst'], description: 'Australian Western Standard Time in Perth.' },
	{ slug: 'sydney', name: 'Sydney', country: 'Australia', zone: 'Australia/Sydney', aliases: ['sydney', 'australia', 'aest', 'aedt'], description: 'Eastern Australian time in Sydney.' },
	{ slug: 'melbourne', name: 'Melbourne', country: 'Australia', zone: 'Australia/Melbourne', aliases: ['melbourne'], description: 'Eastern Australian time in Melbourne.' },
	{ slug: 'auckland', name: 'Auckland', country: 'New Zealand', zone: 'Pacific/Auckland', aliases: ['auckland', 'new zealand', 'nzst', 'nzdt'], description: 'New Zealand time in Auckland.' },
	{ slug: 'honolulu', name: 'Honolulu', country: 'United States', zone: 'Pacific/Honolulu', aliases: ['honolulu', 'hawaii', 'hst'], description: 'Hawaii Standard Time in Honolulu.' },
];

export const cityBySlug = (slug: string) => cities.find((city) => city.slug === slug);
export const featuredCitySlugs = ['london', 'new-york', 'tokyo', 'sydney', 'dubai', 'singapore'];

export interface ConverterCorridor {
	from: string;
	to: string;
	reason: string;
}

export const converterCorridors: ConverterCorridor[] = [
	{ from: 'london', to: 'new-york', reason: 'One of the world’s busiest business, media and family calling routes.' },
	{ from: 'london', to: 'los-angeles', reason: 'A frequent connection between the UK and the US West Coast.' },
	{ from: 'london', to: 'toronto', reason: 'A high-value UK–Canada route for work and family calls.' },
	{ from: 'london', to: 'vancouver', reason: 'Useful for UK connections to Canada’s Pacific coast.' },
	{ from: 'london', to: 'dubai', reason: 'A major finance, travel and expatriate corridor.' },
	{ from: 'london', to: 'delhi', reason: 'A heavily used UK–India working and family connection.' },
	{ from: 'london', to: 'singapore', reason: 'A key bridge between European and Southeast Asian working days.' },
	{ from: 'london', to: 'tokyo', reason: 'A major Europe–Japan business and travel route.' },
	{ from: 'london', to: 'sydney', reason: 'A difficult but important UK–Australia calling corridor.' },
	{ from: 'london', to: 'auckland', reason: 'A date-changing UK–New Zealand route used heavily by families.' },
	{ from: 'new-york', to: 'los-angeles', reason: 'The core US coast-to-coast working-hours comparison.' },
	{ from: 'new-york', to: 'toronto', reason: 'A frequent cross-border route with closely aligned working days.' },
	{ from: 'new-york', to: 'mexico-city', reason: 'A major North American commercial and travel connection.' },
	{ from: 'new-york', to: 'sao-paulo', reason: 'A key financial route between North and South America.' },
	{ from: 'new-york', to: 'paris', reason: 'A high-volume transatlantic business and travel route.' },
	{ from: 'new-york', to: 'tokyo', reason: 'A major finance and technology route crossing the date boundary.' },
	{ from: 'new-york', to: 'delhi', reason: 'A widely used US–India work and family calling route.' },
	{ from: 'new-york', to: 'dubai', reason: 'A major finance and aviation connection.' },
	{ from: 'new-york', to: 'singapore', reason: 'A demanding global finance and technology corridor.' },
	{ from: 'los-angeles', to: 'tokyo', reason: 'A major Pacific technology, media and travel route.' },
	{ from: 'los-angeles', to: 'sydney', reason: 'A common Pacific route with a date change to account for.' },
	{ from: 'los-angeles', to: 'auckland', reason: 'A high-value US West Coast–New Zealand family and travel route.' },
	{ from: 'los-angeles', to: 'singapore', reason: 'A long-distance technology and logistics corridor.' },
	{ from: 'san-francisco', to: 'tokyo', reason: 'A core technology and investment route across the Pacific.' },
	{ from: 'san-francisco', to: 'delhi', reason: 'A major technology-team corridor between California and India.' },
	{ from: 'san-francisco', to: 'singapore', reason: 'A frequent technology and venture-capital connection.' },
	{ from: 'chicago', to: 'london', reason: 'A major central-US to UK business and travel route.' },
	{ from: 'chicago', to: 'tokyo', reason: 'A useful manufacturing, finance and aviation corridor.' },
	{ from: 'toronto', to: 'paris', reason: 'A frequent Canada–France business and family route.' },
	{ from: 'mexico-city', to: 'madrid', reason: 'A major Spanish-speaking business, media and family corridor.' },
	{ from: 'sao-paulo', to: 'london', reason: 'A key financial route linking Brazil and the UK.' },
	{ from: 'madrid', to: 'buenos-aires', reason: 'A high-value Spain–Argentina media and family connection.' },
	{ from: 'paris', to: 'dubai', reason: 'A major European–Gulf travel and business route.' },
	{ from: 'paris', to: 'tokyo', reason: 'A major Europe–Japan commercial and travel corridor.' },
	{ from: 'berlin', to: 'new-york', reason: 'A strong startup, culture and business route.' },
	{ from: 'berlin', to: 'singapore', reason: 'A useful Europe–Southeast Asia technology corridor.' },
	{ from: 'amsterdam', to: 'new-york', reason: 'A busy transatlantic finance, travel and technology connection.' },
	{ from: 'stockholm', to: 'new-york', reason: 'A useful Nordic–US technology and business route.' },
	{ from: 'istanbul', to: 'dubai', reason: 'A regional aviation, trade and finance corridor.' },
	{ from: 'moscow', to: 'dubai', reason: 'A frequently checked route with stable local offsets.' },
	{ from: 'cairo', to: 'dubai', reason: 'A major Middle East and North Africa business route.' },
	{ from: 'nairobi', to: 'london', reason: 'A significant East Africa–UK business and family connection.' },
	{ from: 'riyadh', to: 'london', reason: 'A high-value Gulf–UK finance and government corridor.' },
	{ from: 'dubai', to: 'delhi', reason: 'A heavily used Gulf–India work and family route.' },
	{ from: 'dubai', to: 'singapore', reason: 'A major connection between two global aviation and finance hubs.' },
	{ from: 'dubai', to: 'sydney', reason: 'A long-haul travel and expatriate route with limited overlap.' },
	{ from: 'delhi', to: 'singapore', reason: 'A frequent South Asia–Southeast Asia business route.' },
	{ from: 'delhi', to: 'sydney', reason: 'A growing India–Australia business, study and family connection.' },
	{ from: 'singapore', to: 'tokyo', reason: 'A closely connected Asian finance and technology route.' },
	{ from: 'singapore', to: 'sydney', reason: 'A major Asia–Australia finance, travel and operations corridor.' },
];

export const converterPairs = converterCorridors.flatMap((corridor) => [
	{ from: corridor.from, to: corridor.to, reason: corridor.reason },
	{ from: corridor.to, to: corridor.from, reason: corridor.reason },
]);
