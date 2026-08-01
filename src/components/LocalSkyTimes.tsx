import { useMemo, useState } from 'preact/hooks';
import { getMoonIllumination, getMoonTimes, getTimes } from 'suncalc';

interface SkyLocation {
	latitude: number;
	longitude: number;
	label: string;
	timeZone: string;
	accuracy?: number;
	source: 'device' | 'city' | 'coordinates';
}

type LocationStatus = 'idle' | 'loading' | 'denied' | 'timeout' | 'unavailable' | 'insecure';

const manualLocations = [
	{ id: 'london', label: 'London, United Kingdom', latitude: 51.5072, longitude: -0.1276, timeZone: 'Europe/London' },
	{ id: 'southampton', label: 'Southampton, United Kingdom', latitude: 50.9097, longitude: -1.4044, timeZone: 'Europe/London' },
	{ id: 'edinburgh', label: 'Edinburgh, United Kingdom', latitude: 55.9533, longitude: -3.1883, timeZone: 'Europe/London' },
	{ id: 'belfast', label: 'Belfast, United Kingdom', latitude: 54.5973, longitude: -5.9301, timeZone: 'Europe/London' },
	{ id: 'new-york', label: 'New York, United States', latitude: 40.7128, longitude: -74.006, timeZone: 'America/New_York' },
	{ id: 'los-angeles', label: 'Los Angeles, United States', latitude: 34.0522, longitude: -118.2437, timeZone: 'America/Los_Angeles' },
	{ id: 'toronto', label: 'Toronto, Canada', latitude: 43.6532, longitude: -79.3832, timeZone: 'America/Toronto' },
	{ id: 'sao-paulo', label: 'São Paulo, Brazil', latitude: -23.5505, longitude: -46.6333, timeZone: 'America/Sao_Paulo' },
	{ id: 'paris', label: 'Paris, France', latitude: 48.8566, longitude: 2.3522, timeZone: 'Europe/Paris' },
	{ id: 'berlin', label: 'Berlin, Germany', latitude: 52.52, longitude: 13.405, timeZone: 'Europe/Berlin' },
	{ id: 'cairo', label: 'Cairo, Egypt', latitude: 30.0444, longitude: 31.2357, timeZone: 'Africa/Cairo' },
	{ id: 'johannesburg', label: 'Johannesburg, South Africa', latitude: -26.2041, longitude: 28.0473, timeZone: 'Africa/Johannesburg' },
	{ id: 'dubai', label: 'Dubai, United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timeZone: 'Asia/Dubai' },
	{ id: 'delhi', label: 'Delhi, India', latitude: 28.6139, longitude: 77.209, timeZone: 'Asia/Kolkata' },
	{ id: 'singapore', label: 'Singapore', latitude: 1.3521, longitude: 103.8198, timeZone: 'Asia/Singapore' },
	{ id: 'tokyo', label: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503, timeZone: 'Asia/Tokyo' },
	{ id: 'sydney', label: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093, timeZone: 'Australia/Sydney' },
	{ id: 'auckland', label: 'Auckland, New Zealand', latitude: -36.8509, longitude: 174.7645, timeZone: 'Pacific/Auckland' },
	{ id: 'honolulu', label: 'Honolulu, United States', latitude: 21.3099, longitude: -157.8581, timeZone: 'Pacific/Honolulu' },
] as const;

const formatTime = (date: Date | null | undefined, timeZone: string) =>
	date && !Number.isNaN(date.getTime())
		? new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit', timeZone }).format(date)
		: 'Not today';

const phaseName = (phase: number) => {
	if (phase < 0.03 || phase >= 0.97) return 'New moon';
	if (phase < 0.22) return 'Waxing crescent';
	if (phase < 0.28) return 'First quarter';
	if (phase < 0.47) return 'Waxing gibbous';
	if (phase < 0.53) return 'Full moon';
	if (phase < 0.72) return 'Waning gibbous';
	if (phase < 0.78) return 'Last quarter';
	return 'Waning crescent';
};

const formatCoordinate = (value: number, positive: string, negative: string) =>
	`${Math.abs(value).toFixed(1)}°${value >= 0 ? positive : negative}`;

const statusMessage: Partial<Record<LocationStatus, string>> = {
	denied: 'Location permission is blocked. Allow it in your browser site settings, then try again, or choose a city below.',
	timeout: 'Your device did not return a location in time. Try again or choose a city below.',
	unavailable: 'Your browser was allowed to ask, but your device did not return a position. Check that Location Services are on for this browser, then try again or choose a city below.',
	insecure: 'Browser location only works over a secure connection. Choose a city or enter coordinates below.',
};

export default function LocalSkyTimes() {
	const [location, setLocation] = useState<SkyLocation | null>(null);
	const [status, setStatus] = useState<LocationStatus>('idle');
	const [selectedPlace, setSelectedPlace] = useState('london');
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [manualError, setManualError] = useState('');

	const sky = useMemo(() => {
		if (!location) return null;
		const now = new Date();
		const sun = getTimes(now, location.latitude, location.longitude);
		const moon = getMoonTimes(now, location.latitude, location.longitude);
		const illumination = getMoonIllumination(now);
		const daylight = sun.sunrise && sun.sunset
			? Math.max(0, sun.sunset.getTime() - sun.sunrise.getTime())
			: null;
		return { sun, moon, illumination, daylight };
	}, [location]);

	const locate = () => {
		setManualError('');
		if (!window.isSecureContext) {
			setStatus('insecure');
			return;
		}
		if (!navigator.geolocation) {
			setStatus('unavailable');
			return;
		}

		setStatus('loading');
		const acceptPosition = (position: GeolocationPosition) => {
			setLocation({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				label: 'Your current location',
				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				accuracy: position.coords.accuracy,
				source: 'device',
			});
			setStatus('idle');
		};
		const requestPosition = (highAccuracy: boolean, isRetry = false) => {
			navigator.geolocation.getCurrentPosition(
				acceptPosition,
				(error) => {
					if (!isRetry && error.code !== error.PERMISSION_DENIED) {
						requestPosition(true, true);
						return;
					}
					if (error.code === error.PERMISSION_DENIED) setStatus('denied');
					else if (error.code === error.TIMEOUT) setStatus('timeout');
					else setStatus('unavailable');
				},
				{ enableHighAccuracy: highAccuracy, timeout: highAccuracy ? 30_000 : 15_000, maximumAge: highAccuracy ? 0 : 300_000 },
			);
		};
		requestPosition(false);
	};

	const useCity = (event: Event) => {
		event.preventDefault();
		const place = manualLocations.find((candidate) => candidate.id === selectedPlace);
		if (!place) return;
		setLocation({ ...place, source: 'city' });
		setStatus('idle');
		setManualError('');
	};

	const useCoordinates = (event: Event) => {
		event.preventDefault();
		const nextLatitude = Number(latitude);
		const nextLongitude = Number(longitude);
		if (
			latitude.trim() === ''
			|| longitude.trim() === ''
			|| !Number.isFinite(nextLatitude)
			|| !Number.isFinite(nextLongitude)
			|| nextLatitude < -90
			|| nextLatitude > 90
			|| nextLongitude < -180
			|| nextLongitude > 180
		) {
			setManualError('Enter a latitude from -90 to 90 and a longitude from -180 to 180.');
			return;
		}

		setLocation({
			latitude: nextLatitude,
			longitude: nextLongitude,
			label: 'Custom coordinates',
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			source: 'coordinates',
		});
		setStatus('idle');
		setManualError('');
	};

	if (!sky || !location) {
		return (
			<div class="atlas-panel border border-[var(--color-line)] bg-[var(--color-surface)]">
				<div class="border-b border-[var(--color-line)] p-7 sm:p-10">
					<h2 class="max-w-2xl font-serif text-4xl leading-none tracking-[-0.04em] sm:text-5xl">
						Sun and Moon times depend on where you stand.
					</h2>
					<p class="mt-5 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
						Use your device location or choose a place manually. Coordinates are used only in this browser to calculate today’s sky times.
					</p>
					<button
						type="button"
						onClick={locate}
						disabled={status === 'loading'}
						class="mt-7 min-h-12 bg-[var(--color-signal)] px-5 py-3 text-sm font-semibold text-[var(--color-signal-ink)] active:translate-y-px disabled:opacity-60"
					>
						{status === 'loading' ? 'Finding your location…' : status === 'idle' ? 'Use my location' : 'Try my location again'}
					</button>
					<p aria-live="polite" class="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
						{status === 'loading' ? 'Waiting for your browser or device to return a position.' : statusMessage[status] ?? ''}
					</p>
				</div>

				<div class="grid lg:grid-cols-2">
					<form onSubmit={useCity} class="border-b border-[var(--color-line)] p-7 lg:border-b-0 lg:border-r sm:p-10">
						<label for="sky-city" class="block font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-subtle)]">Choose a city</label>
						<select
							id="sky-city"
							value={selectedPlace}
							onChange={(event) => setSelectedPlace(event.currentTarget.value)}
							class="mt-3 min-h-12 w-full border border-[var(--color-line)] bg-[var(--color-input)] px-4 text-base text-[var(--color-ink)] outline-none focus:border-[var(--color-signal)]"
						>
							{manualLocations.map((place) => <option value={place.id}>{place.label}</option>)}
						</select>
						<p class="mt-3 text-xs leading-5 text-[var(--color-muted)]">City-centre coordinates are accurate enough for everyday sunrise and sunset planning.</p>
						<button class="mt-6 min-h-12 border border-[var(--color-ink)] px-5 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-canvas)] active:translate-y-px">
							Use this city
						</button>
					</form>

					<form onSubmit={useCoordinates} class="p-7 sm:p-10">
						<p class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-subtle)]">Or enter coordinates</p>
						<div class="mt-3 grid gap-5 sm:grid-cols-2">
							<div>
								<label for="sky-latitude" class="block text-sm text-[var(--color-muted)]">Latitude</label>
								<input
									id="sky-latitude"
									type="number"
									inputMode="decimal"
									min="-90"
									max="90"
									step="any"
									value={latitude}
									onInput={(event) => setLatitude(event.currentTarget.value)}
									class="mt-2 min-h-12 w-full border border-[var(--color-line)] bg-[var(--color-input)] px-4 text-[var(--color-ink)] outline-none focus:border-[var(--color-signal)]"
								/>
							</div>
							<div>
								<label for="sky-longitude" class="block text-sm text-[var(--color-muted)]">Longitude</label>
								<input
									id="sky-longitude"
									type="number"
									inputMode="decimal"
									min="-180"
									max="180"
									step="any"
									value={longitude}
									onInput={(event) => setLongitude(event.currentTarget.value)}
									class="mt-2 min-h-12 w-full border border-[var(--color-line)] bg-[var(--color-input)] px-4 text-[var(--color-ink)] outline-none focus:border-[var(--color-signal)]"
								/>
							</div>
						</div>
						<p class="mt-3 text-xs leading-5 text-[var(--color-muted)]">Custom coordinates are displayed in your browser’s time zone.</p>
						{manualError && <p role="alert" class="mt-3 text-sm text-red-700">{manualError}</p>}
						<button class="mt-6 min-h-12 border border-[var(--color-ink)] px-5 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-canvas)] active:translate-y-px">
							Use these coordinates
						</button>
					</form>
				</div>
			</div>
		);
	}

	const daylightHours = sky.daylight === null ? null : Math.floor(sky.daylight / 3_600_000);
	const daylightMinutes = sky.daylight === null ? null : Math.round((sky.daylight % 3_600_000) / 60_000);
	const locationNote = location.source === 'device'
		? location.accuracy
			? `Device position, accurate to about ${Math.round(location.accuracy)} metres`
			: 'Using your device position'
		: location.source === 'city'
			? 'Using city-centre coordinates'
			: 'Using coordinates you entered';
	const coordinateLabel = location.source === 'device'
		? `${formatCoordinate(location.latitude, 'N', 'S')}, ${formatCoordinate(location.longitude, 'E', 'W')}`
		: `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`;

	return (
		<div class="border border-[var(--color-line)] bg-[var(--color-surface)]">
			<div class="flex flex-wrap items-end justify-between gap-5 border-b border-[var(--color-line)] p-6 sm:p-8">
				<div>
					<h2 class="font-serif text-4xl tracking-[-0.04em]">{location.label}</h2>
					<p class="mt-2 text-xs leading-5 text-[var(--color-muted)]">{locationNote}</p>
				</div>
				<div class="text-left sm:text-right">
					<p class="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-subtle)]">{location.source === 'device' ? 'Approximate area' : 'Coordinates'}</p>
					<p class="mt-1 font-mono text-xs text-[var(--color-ink)]">{coordinateLabel}</p>
					<p class="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-subtle)]">{location.timeZone}</p>
					<button type="button" onClick={() => setLocation(null)} class="mt-3 border-b border-[var(--color-ink)] pb-1 text-sm text-[var(--color-ink)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]">
						Change location
					</button>
				</div>
			</div>
			<div class="grid sm:grid-cols-2 lg:grid-cols-4">
				{[
					['Sunrise', formatTime(sky.sun.sunrise, location.timeZone), 'First edge of the Sun appears'],
					['Solar noon', formatTime(sky.sun.solarNoon, location.timeZone), 'Sun reaches its highest point'],
					['Sunset', formatTime(sky.sun.sunset, location.timeZone), 'Last edge of the Sun disappears'],
					['Daylight', daylightHours === null ? 'Polar day/night' : `${daylightHours}h ${daylightMinutes}m`, 'Time between sunrise and sunset'],
					['Moonrise', formatTime(sky.moon.rise, location.timeZone), 'May fall on the adjacent local date'],
					['Moonset', formatTime(sky.moon.set, location.timeZone), 'May fall on the adjacent local date'],
					['Moon phase', phaseName(sky.illumination.phase), `${Math.round(sky.illumination.fraction * 100)}% illuminated`],
					['Direction', sky.illumination.waxing ? 'Waxing' : 'Waning', 'Illumination is increasing or decreasing'],
				].map(([label, value, note]) => (
					<article class="border-b border-r border-[var(--color-line)] p-5 sm:p-6">
						<p class="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-subtle)]">{label}</p>
						<p class="mt-5 font-['Share_Tech_Mono'] text-3xl tracking-[-0.05em] text-[var(--color-ink)]">{value}</p>
						<p class="mt-2 text-xs leading-5 text-[var(--color-muted)]">{note}</p>
					</article>
				))}
			</div>
		</div>
	);
}
