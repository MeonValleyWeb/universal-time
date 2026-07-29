import { useEffect, useMemo, useState } from 'preact/hooks';

const events = [
	{
		name: 'Total solar eclipse',
		kind: 'Eclipse',
		at: '2026-08-12T17:45:51Z',
		detail: 'Greatest eclipse. Totality crosses Greenland, Iceland, northern Russia and Spain; a partial eclipse is visible across a much wider region.',
		source: 'https://science.nasa.gov/eclipses/future-eclipses/',
	},
	{
		name: 'Perseid meteor peak',
		kind: 'Meteor shower',
		at: '2026-08-13T01:56:00Z',
		detail: 'Earth reaches the heart of the debris stream left by comet 109P/Swift-Tuttle.',
		source: 'https://eclipse.gsfc.nasa.gov/SKYCAL/SKYCAL.html?cal=2026',
	},
	{
		name: 'Partial lunar eclipse',
		kind: 'Eclipse',
		at: '2026-08-28T04:14:04Z',
		detail: 'Greatest eclipse. Visible from the eastern Pacific, the Americas, Europe and Africa.',
		source: 'https://eclipse.gsfc.nasa.gov/LEdecade/LEdecade2021.html',
	},
];

const splitRemaining = (milliseconds: number) => {
	const seconds = Math.max(0, Math.floor(milliseconds / 1000));
	return {
		days: Math.floor(seconds / 86_400),
		hours: Math.floor((seconds % 86_400) / 3_600),
		minutes: Math.floor((seconds % 3_600) / 60),
		seconds: seconds % 60,
	};
};

export default function SkyCountdowns({ initialNow }: { initialNow: number }) {
	const [now, setNow] = useState(initialNow);
	useEffect(() => {
		const interval = window.setInterval(() => setNow(Date.now()), 1000);
		return () => window.clearInterval(interval);
	}, []);
	const formatter = useMemo(
		() => new Intl.DateTimeFormat([], { dateStyle: 'full', timeStyle: 'short' }),
		[],
	);

	return (
		<div class="grid gap-px bg-[var(--color-line)] lg:grid-cols-3">
			{events.map((event) => {
				const timestamp = new Date(event.at).getTime();
				const remaining = splitRemaining(timestamp - now);
				const passed = timestamp <= now;
				return (
					<article class="bg-[var(--color-surface)] p-6 sm:p-8">
						<div class="flex items-center justify-between gap-4">
							<span class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-signal)]">{event.kind}</span>
							<span class="font-mono text-[8px] uppercase tracking-wider text-[var(--color-subtle)]">NASA sourced</span>
						</div>
						<h3 class="mt-5 font-serif text-3xl tracking-[-0.035em]">{event.name}</h3>
						<p class="mt-2 text-xs leading-5 text-[var(--color-muted)]">{formatter.format(timestamp)}</p>
						{passed ? (
							<p class="mt-8 font-mono text-sm uppercase tracking-wider text-[var(--color-subtle)]">Event has passed</p>
						) : (
							<div class="mt-8 grid grid-cols-4 gap-2">
								{Object.entries(remaining).map(([label, value]) => (
									<div>
										<p class="font-['Share_Tech_Mono'] text-3xl text-[var(--color-ink)]">{String(value).padStart(2, '0')}</p>
										<p class="font-mono text-[7px] uppercase tracking-wider text-[var(--color-subtle)]">{label}</p>
									</div>
								))}
							</div>
						)}
						<p class="mt-8 text-sm leading-6 text-[var(--color-muted)]">{event.detail}</p>
						<a href={event.source} target="_blank" rel="noreferrer" class="mt-5 inline-flex font-mono text-[9px] uppercase tracking-wider text-[var(--color-signal)] hover:underline">
							Official source ↗
						</a>
					</article>
				);
			})}
		</div>
	);
}
