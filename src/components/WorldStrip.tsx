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
		<div class="grid grid-cols-2 border-l border-t border-stone-950/20 sm:grid-cols-3 lg:grid-cols-6">
			{featured.map((city) => {
				const hour = getLocalParts(now, city.zone).hour;
				const daylight = hour >= 7 && hour < 20;
				return (
					<a
						href={`/time/${city.slug}`}
						class="atlas-clock group min-w-0 border-b border-r border-stone-950/20 bg-[#f6f0e4]/75 p-4 transition hover:bg-stone-950 hover:text-white sm:min-h-36 sm:p-5"
					>
						<div class="flex items-start justify-between gap-2">
							<span class="min-w-0 font-mono text-[8px] uppercase tracking-[0.14em] text-stone-500 group-hover:text-stone-400">
								{city.country}
							</span>
							<span
								class={`mt-1 size-1.5 shrink-0 rounded-full ${daylight ? 'bg-orange-600' : 'bg-stone-500 group-hover:bg-stone-300'}`}
							/>
						</div>
						<p class="mt-7 truncate font-serif text-xl">{city.name}</p>
						<p class="mt-1 font-['Share_Tech_Mono'] text-3xl tracking-[-0.055em]">
							{formatClock(now, city.zone, false)}
						</p>
					</a>
				);
			})}
		</div>
	);
}
