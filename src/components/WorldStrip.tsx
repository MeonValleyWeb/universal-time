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
		<div class="grid grid-cols-2 border-l border-t border-[var(--color-line)] sm:grid-cols-3 lg:grid-cols-6">
			{featured.map((city) => {
				const hour = getLocalParts(now, city.zone).hour;
				const daylight = hour >= 7 && hour < 20;
				return (
					<a
						href={`/time/${city.slug}`}
						class="atlas-clock group min-w-0 border-b border-r border-[var(--color-line)] bg-[var(--color-surface)]/72 p-4 transition hover:bg-[var(--color-ink)] hover:text-[var(--color-canvas)] sm:min-h-32 sm:p-5"
					>
						<div class="flex items-start justify-between gap-2">
							<span class="min-w-0 font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
								{city.country}
							</span>
							<span
								class={`mt-1 size-1.5 shrink-0 rounded-full ${daylight ? 'bg-orange-600' : 'bg-stone-500 group-hover:bg-stone-300'}`}
							/>
						</div>
						<p class="mt-6 truncate font-serif text-lg">{city.name}</p>
						<p class="mt-1 font-['Share_Tech_Mono'] text-4xl leading-none tracking-[-0.055em]">
							{formatClock(now, city.zone, false)}
						</p>
					</a>
				);
			})}
		</div>
	);
}
