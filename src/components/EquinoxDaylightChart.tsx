type Place = { name: string; latitude: number; colour: string };

const places: Place[] = [
	{ name: 'London 51.5°N', latitude: 51.5, colour: 'var(--color-ink)' },
	{ name: 'Quito 0°', latitude: 0, colour: 'var(--color-muted)' },
	{ name: 'Sydney 33.9°S', latitude: -33.9, colour: 'var(--color-signal)' },
];

const samples = [15, 45, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349];

const daylightHours = (day: number, latitude: number) => {
	const radians = Math.PI / 180;
	const declination = -23.44 * Math.cos((2 * Math.PI * (day + 10)) / 365);
	const cosineHourAngle = -Math.tan(latitude * radians) * Math.tan(declination * radians);
	const hourAngle = Math.acos(Math.max(-1, Math.min(1, cosineHourAngle)));
	return (24 / Math.PI) * hourAngle;
};

const point = (day: number, latitude: number) => {
	const x = 42 + ((day - 1) / 364) * 918;
	const y = 202 - ((daylightHours(day, latitude) - 6) / 14) * 164;
	return `${x.toFixed(1)},${y.toFixed(1)}`;
};

export default function EquinoxDaylightChart() {
	return (
		<figure class="overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-8">
			<figcaption class="max-w-2xl">
				<h2 class="font-serif text-3xl tracking-[-0.035em]">Daylight shifts in opposite directions.</h2>
				<p class="mt-3 text-sm leading-6 text-[var(--color-muted)]">A simplified solar-geometry comparison. It estimates daylight from latitude and the Sun’s seasonal declination, without local terrain or atmospheric refraction.</p>
			</figcaption>
			<div class="mt-7 overflow-x-auto">
				<svg viewBox="0 0 1000 250" role="img" aria-labelledby="daylight-chart-title daylight-chart-description" class="min-w-[640px] w-full text-[var(--color-line)]">
					<title id="daylight-chart-title">Estimated daylight through the year for London, Quito and Sydney</title>
					<desc id="daylight-chart-description">London gains daylight until June then loses it. Sydney follows the reverse pattern. Quito stays close to twelve hours all year.</desc>
					{[6, 9, 12, 15, 18, 20].map((hour) => {
						const y = 202 - ((hour - 6) / 14) * 164;
						return <g><line x1="42" x2="960" y1={y} y2={y} stroke="currentColor" stroke-opacity="0.55" stroke-dasharray={hour === 12 ? '4 4' : '1 6'} /><text x="4" y={y + 4} fill="var(--color-subtle)" font-size="10" font-family="monospace">{hour}h</text></g>;
					})}
					<line x1="42" x2="960" y1="202" y2="202" stroke="currentColor" stroke-opacity="0.8" />
					{['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((label, index) => {
						const x = 42 + (index / 5) * 918;
						return <text x={x} y="226" text-anchor={index === 0 ? 'start' : index === 5 ? 'end' : 'middle'} fill="var(--color-subtle)" font-size="10" font-family="monospace">{label}</text>;
					})}
					<line x1={42 + ((266 - 1) / 364) * 918} x2={42 + ((266 - 1) / 364) * 918} y1="24" y2="202" stroke="var(--color-signal)" stroke-opacity="0.7" stroke-dasharray="3 5" />
					<text x={42 + ((266 - 1) / 364) * 918 + 8} y="37" fill="var(--color-signal)" font-size="10" font-family="monospace">Sep equinox</text>
					{places.map((place) => <polyline fill="none" stroke={place.colour} stroke-width="3" points={samples.map((day) => point(day, place.latitude)).join(' ')} />)}
				</svg>
			</div>
			<div class="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[var(--color-muted)]">
				{places.map((place) => <p><span class="mr-2 inline-block size-2 rounded-full" style={{ backgroundColor: place.colour }}></span>{place.name}</p>)}
			</div>
		</figure>
	);
}
