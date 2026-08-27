export type CelestialEvent = {
	slug: string;
	name: string;
	kind: 'Eclipse' | 'Meteor shower' | 'Seasonal time';
	at: string;
	detail: string;
	visibility: string;
	localNote: string;
	source: { name: string; url: string };
};

// Keep this deliberately small and hand-maintained: every entry has a useful
// question to answer, a stable official source, and a date that is reviewed
// before it becomes the next highlighted event.
export const celestialEvents: CelestialEvent[] = [
	{
		slug: 'total-solar-eclipse-2026',
		name: 'Total solar eclipse',
		kind: 'Eclipse',
		at: '2026-08-12T17:45:51Z',
		detail: 'The Moon crosses in front of the Sun. At greatest eclipse, the narrow path of totality is already moving across the North Atlantic and Europe.',
		visibility: 'Totality crosses Greenland, Iceland, northern Russia, Spain and a small area of Portugal. A partial eclipse is visible across much of Europe, Africa and North America.',
		localNote: 'The exact phases and how much of the Sun is covered depend on your location. Never look at the Sun without certified solar viewing protection except during the brief, location-specific interval of totality.',
		source: { name: 'NASA: 2026 total solar eclipse', url: 'https://science.nasa.gov/eclipses/future-eclipses/total-solar-eclipse-on-august-12-2026/' },
	},
	{
		slug: 'perseid-meteor-shower-2026',
		name: 'Perseid meteor shower peak',
		kind: 'Meteor shower',
		at: '2026-08-13T00:00:00Z',
		detail: 'Earth moves through dust left by comet 109P/Swift–Tuttle. The peak is a night-time window, rather than a single worldwide instant.',
		visibility: 'Best seen from the Northern Hemisphere after local midnight, away from city lights. The shower is active from mid-July into late August.',
		localNote: 'Your local night matters more than the displayed countdown. Give your eyes time to adjust and look broadly across the sky; no telescope is needed.',
		source: { name: 'NASA: astrophotography guide meteor calendar', url: 'https://science.nasa.gov/wp-content/uploads/2023/09/Astrophotography_Guide.pdf' },
	},
	{
		slug: 'partial-lunar-eclipse-2026',
		name: 'Partial lunar eclipse',
		kind: 'Eclipse',
		at: '2026-08-28T04:14:04Z',
		detail: 'Earth’s shadow covers part of the full Moon. This is the published time of greatest eclipse; the whole event lasts longer as the Moon moves gradually into and out of the shadow.',
		visibility: 'Visible from the eastern Pacific, the Americas, Europe and Africa, provided the Moon is above your horizon.',
		localNote: 'Unlike a solar eclipse, a lunar eclipse is safe to view without special eye protection. Your local horizon and the Moon’s rise/set time decide whether it is visible.',
		source: { name: 'NASA GSFC: lunar eclipses, 2021–2030', url: 'https://eclipse.gsfc.nasa.gov/LEdecade/LEdecade2021.html' },
	},
	{
		slug: 'september-equinox-2026',
		name: 'September equinox',
		kind: 'Seasonal time',
		at: '2026-09-23T00:05:00Z',
		detail: 'The Sun crosses the celestial equator heading south. It marks autumn in the Northern Hemisphere and spring in the Southern Hemisphere.',
		visibility: 'It is a global astronomical moment, although the civil date and local clock time differ around the world.',
		localNote: 'Day and night are close to equal around an equinox, but not precisely 12 hours everywhere: refraction, the Sun’s apparent size and latitude all matter.',
		source: { name: 'U.S. Naval Observatory: Earth’s seasons, 2026', url: 'https://aa.usno.navy.mil/calculated/seasons?dst=false&submit=Get+Data&tz=1&tz_label=false&tz_sign=1&year=2026' },
	},
	{
		slug: 'december-solstice-2026',
		name: 'December solstice',
		kind: 'Seasonal time',
		at: '2026-12-21T20:50:00Z',
		detail: 'The Sun reaches its southernmost point in the sky. It marks winter in the Northern Hemisphere and summer in the Southern Hemisphere.',
		visibility: 'It is a global astronomical moment, but its practical effect is strongly local: daylight is shortest in the north and longest in the south.',
		localNote: 'This is an instant, not the whole shortest day. Use the Sun and Moon tool above to see your actual local daylight length.',
		source: { name: 'U.S. Naval Observatory: Earth’s seasons, 2026', url: 'https://aa.usno.navy.mil/calculated/seasons?dst=false&submit=Get+Data&tz=1&tz_label=false&tz_sign=1&year=2026' },
	},
];

export const celestialEventBySlug = (slug: string) => celestialEvents.find((event) => event.slug === slug);
