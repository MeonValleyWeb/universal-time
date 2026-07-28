export interface City {
	slug: string;
	name: string;
	country: string;
	zone: string;
	aliases: string[];
	description: string;
}

export const cities: City[] = [
	{ slug: 'london', name: 'London', country: 'United Kingdom', zone: 'Europe/London', aliases: ['london', 'uk', 'gmt', 'bst'], description: 'The reference clock for the United Kingdom and a bridge between the Americas and Asia.' },
	{ slug: 'new-york', name: 'New York', country: 'United States', zone: 'America/New_York', aliases: ['new york', 'nyc', 'eastern', 'est', 'edt'], description: 'Eastern Time for New York and much of the US East Coast.' },
	{ slug: 'los-angeles', name: 'Los Angeles', country: 'United States', zone: 'America/Los_Angeles', aliases: ['los angeles', 'la', 'pacific', 'pst', 'pdt'], description: 'Pacific Time for Los Angeles and the US West Coast.' },
	{ slug: 'chicago', name: 'Chicago', country: 'United States', zone: 'America/Chicago', aliases: ['chicago', 'central', 'cst', 'cdt'], description: 'Central Time for Chicago and the central United States.' },
	{ slug: 'toronto', name: 'Toronto', country: 'Canada', zone: 'America/Toronto', aliases: ['toronto'], description: 'Eastern Time in Canada’s largest city.' },
	{ slug: 'vancouver', name: 'Vancouver', country: 'Canada', zone: 'America/Vancouver', aliases: ['vancouver'], description: 'Pacific Time on Canada’s west coast.' },
	{ slug: 'mexico-city', name: 'Mexico City', country: 'Mexico', zone: 'America/Mexico_City', aliases: ['mexico city', 'cdmx'], description: 'Local time in Mexico’s capital.' },
	{ slug: 'sao-paulo', name: 'São Paulo', country: 'Brazil', zone: 'America/Sao_Paulo', aliases: ['sao paulo', 'são paulo'], description: 'Local time in Brazil’s commercial centre.' },
	{ slug: 'paris', name: 'Paris', country: 'France', zone: 'Europe/Paris', aliases: ['paris', 'france', 'cet', 'cest'], description: 'Central European Time in Paris.' },
	{ slug: 'berlin', name: 'Berlin', country: 'Germany', zone: 'Europe/Berlin', aliases: ['berlin', 'germany'], description: 'Central European Time in Germany’s capital.' },
	{ slug: 'cairo', name: 'Cairo', country: 'Egypt', zone: 'Africa/Cairo', aliases: ['cairo', 'egypt'], description: 'Local time in Cairo and Egypt.' },
	{ slug: 'johannesburg', name: 'Johannesburg', country: 'South Africa', zone: 'Africa/Johannesburg', aliases: ['johannesburg', 'joburg', 'south africa', 'sast'], description: 'South Africa Standard Time in Johannesburg.' },
	{ slug: 'lagos', name: 'Lagos', country: 'Nigeria', zone: 'Africa/Lagos', aliases: ['lagos', 'nigeria', 'wat'], description: 'West Africa Time in Lagos.' },
	{ slug: 'dubai', name: 'Dubai', country: 'United Arab Emirates', zone: 'Asia/Dubai', aliases: ['dubai', 'uae', 'gst'], description: 'Gulf Standard Time in Dubai.' },
	{ slug: 'delhi', name: 'Delhi', country: 'India', zone: 'Asia/Kolkata', aliases: ['delhi', 'new delhi', 'india', 'ist'], description: 'India Standard Time in Delhi.' },
	{ slug: 'mumbai', name: 'Mumbai', country: 'India', zone: 'Asia/Kolkata', aliases: ['mumbai', 'bombay'], description: 'India Standard Time in Mumbai.' },
	{ slug: 'singapore', name: 'Singapore', country: 'Singapore', zone: 'Asia/Singapore', aliases: ['singapore', 'sgt'], description: 'Singapore Standard Time.' },
	{ slug: 'bangkok', name: 'Bangkok', country: 'Thailand', zone: 'Asia/Bangkok', aliases: ['bangkok', 'thailand', 'ict'], description: 'Indochina Time in Bangkok.' },
	{ slug: 'hong-kong', name: 'Hong Kong', country: 'Hong Kong', zone: 'Asia/Hong_Kong', aliases: ['hong kong', 'hkt'], description: 'Hong Kong Time.' },
	{ slug: 'shanghai', name: 'Shanghai', country: 'China', zone: 'Asia/Shanghai', aliases: ['shanghai', 'china', 'beijing time'], description: 'China Standard Time in Shanghai.' },
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

