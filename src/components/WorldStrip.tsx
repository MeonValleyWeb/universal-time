import { useEffect, useState } from 'preact/hooks';
import { cities, featuredCitySlugs } from '../lib/cities';
import { formatClock, getLocalParts } from '../lib/time';

interface Props {
	initialNow: number;
}

export default function WorldStrip({ initialNow }: Props) {
	const [now, setNow] = useState(initialNow);
	const featured = featuredCitySlugs.map((slug) => cities.find((city) => city.slug === slug)!);

	useEffect(() => {
		const interval = window.setInterval(() => setNow(Date.now()), 30_000);
		return () => window.clearInterval(interval);
	}, []);

	return (
		<div class="grid grid-cols-2 overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-surface)] sm:grid-cols-3 lg:grid-cols-6">
			{featured.map((city) => {
				const hour = getLocalParts(now, city.zone).hour;
				const daylight = hour >= 7 && hour < 20;
				return (
					<a
						href={`/time/${city.slug}`}
						class="group min-w-0 border-b border-r border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:bg-[var(--color-surface-elevated)] sm:min-h-36 sm:p-5"
					>
						<div class="flex items-start justify-between gap-2">
							<span class="min-w-0 font-mono text-[9px] uppercase tracking-[0.13em] text-[var(--color-muted)]">
								{city.country}
							</span>
							<span
								class={`mt-1 size-1.5 shrink-0 rounded-full ${daylight ? 'bg-[var(--color-accent)] shadow-[0_0_0_4px_oklch(0.73_0.16_245/0.12)]' : 'bg-[var(--color-subtle)]'}`}
							/>
						</div>
						<p class="mt-7 truncate font-serif text-xl">{city.name}</p>
						<p class="mt-1 font-mono text-3xl font-semibold tracking-[-0.055em] tabular-nums">
							{formatClock(now, city.zone, false)}
						</p>
					</a>
				);
			})}
		</div>
	);
}
