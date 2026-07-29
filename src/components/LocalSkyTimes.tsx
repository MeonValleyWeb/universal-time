import { useMemo, useState } from 'preact/hooks';
import { getMoonIllumination, getMoonTimes, getTimes } from 'suncalc';

interface Coordinates {
	latitude: number;
	longitude: number;
}

const formatTime = (date?: Date | null) =>
	date
		? new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' }).format(date)
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

export default function LocalSkyTimes() {
	const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
	const [status, setStatus] = useState<'idle' | 'loading' | 'denied' | 'unavailable'>('idle');

	const sky = useMemo(() => {
		if (!coordinates) return null;
		const now = new Date();
		const sun = getTimes(now, coordinates.latitude, coordinates.longitude);
		const moon = getMoonTimes(now, coordinates.latitude, coordinates.longitude);
		const illumination = getMoonIllumination(now);
		const daylight = sun.sunrise && sun.sunset
			? Math.max(0, sun.sunset.getTime() - sun.sunrise.getTime())
			: null;
		return { sun, moon, illumination, daylight };
	}, [coordinates]);

	const locate = () => {
		if (!navigator.geolocation) {
			setStatus('unavailable');
			return;
		}
		setStatus('loading');
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setCoordinates({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});
				setStatus('idle');
			},
			(error) => setStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable'),
			{ enableHighAccuracy: false, timeout: 10_000, maximumAge: 900_000 },
		);
	};

	if (!sky) {
		return (
			<div class="atlas-panel border border-[var(--color-line)] bg-[var(--color-surface)] p-7 sm:p-10">
				<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-signal)]">Your local sky clock</p>
				<h2 class="mt-4 max-w-2xl font-serif text-4xl leading-none tracking-[-0.04em] sm:text-5xl">
					Sun and Moon times depend on where you stand.
				</h2>
				<p class="mt-5 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
					Use your current location to calculate today’s sunrise, sunset, solar noon, moonrise, moonset and lunar phase. Your coordinates stay in this browser and are never sent to WorldTime.
				</p>
				<button
					type="button"
					onClick={locate}
					disabled={status === 'loading'}
					class="mt-7 rounded-full bg-[var(--color-signal)] px-5 py-3 text-sm font-semibold text-[var(--color-signal-ink)] disabled:opacity-60"
				>
					{status === 'loading' ? 'Finding your location…' : 'Use my location'}
				</button>
				{status === 'denied' && <p class="mt-4 text-sm text-rose-600">Location access was declined. You can enable it in your browser’s site settings.</p>}
				{status === 'unavailable' && <p class="mt-4 text-sm text-rose-600">Your location could not be read on this device.</p>}
			</div>
		);
	}

	const daylightHours = sky.daylight === null ? null : Math.floor(sky.daylight / 3_600_000);
	const daylightMinutes = sky.daylight === null ? null : Math.round((sky.daylight % 3_600_000) / 60_000);

	return (
		<div class="border border-[var(--color-line)] bg-[var(--color-surface)]">
			<div class="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-line)] p-6 sm:p-8">
				<div>
					<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-signal)]">Your local sky clock</p>
					<h2 class="mt-2 font-serif text-4xl tracking-[-0.04em]">Today above you</h2>
				</div>
				<p class="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-subtle)]">
					{coordinates!.latitude.toFixed(2)}°, {coordinates!.longitude.toFixed(2)}° · calculated locally
				</p>
			</div>
			<div class="grid sm:grid-cols-2 lg:grid-cols-4">
				{[
					['Sunrise', formatTime(sky.sun.sunrise), 'First edge of the Sun appears'],
					['Solar noon', formatTime(sky.sun.solarNoon), 'Sun reaches its highest point'],
					['Sunset', formatTime(sky.sun.sunset), 'Last edge of the Sun disappears'],
					['Daylight', daylightHours === null ? 'Polar day/night' : `${daylightHours}h ${daylightMinutes}m`, 'Time between sunrise and sunset'],
					['Moonrise', formatTime(sky.moon.rise), 'May fall on the adjacent local date'],
					['Moonset', formatTime(sky.moon.set), 'May fall on the adjacent local date'],
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
