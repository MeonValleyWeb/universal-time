import { useEffect, useMemo, useState } from 'preact/hooks';
import { cities, type City } from '../lib/cities';
import { formatClock, formatDate, formatOffset, getDayRelation, getLocalParts, getOffsetMinutes } from '../lib/time';

const featuredSlugs = ['london', 'new-york', 'los-angeles', 'sao-paulo', 'paris', 'dubai', 'delhi', 'singapore', 'tokyo', 'sydney', 'auckland'];

const cityByZone = (zone: string) => cities.find((city) => city.zone === zone);

const seasonalRule = (zone: string, timestamp: number) => {
	const year = new Date(timestamp).getUTCFullYear();
	const winter = getOffsetMinutes(Date.UTC(year, 0, 15, 12), zone);
	const summer = getOffsetMinutes(Date.UTC(year, 6, 15, 12), zone);
	return winter === summer ? 'No seasonal clock change detected' : 'Seasonal clock rule changes this year';
};

export default function TimeZoneExplorer({ initialNow }: { initialNow: number }) {
	const [now, setNow] = useState(initialNow);
	const [referenceZone, setReferenceZone] = useState('Europe/London');
	const [search, setSearch] = useState('');

	useEffect(() => {
		const browserZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		if (cityByZone(browserZone)) setReferenceZone(browserZone);
		const timer = window.setInterval(() => setNow(Date.now()), 1_000);
		return () => window.clearInterval(timer);
	}, []);

	const reference = cityByZone(referenceZone) ?? cities[0];
	const visibleCities = useMemo(() => {
		const term = search.trim().toLocaleLowerCase();
		const list = featuredSlugs.map((slug) => cities.find((city) => city.slug === slug)!).filter(Boolean);
		if (!term) return list;
		return cities.filter((city) => [city.name, city.country, city.zone, ...city.aliases].join(' ').toLocaleLowerCase().includes(term)).slice(0, 12);
	}, [search]);

	return (
		<div class="border border-[var(--color-line)] bg-[var(--color-surface)]">
			<div class="grid border-b border-[var(--color-line)] lg:grid-cols-[1fr_.82fr]">
				<div class="p-6 sm:p-8">
					<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-subtle)]">Your reference clock</p>
					<label class="mt-5 block text-sm text-[var(--color-muted)]" for="reference-zone">Compare every city with</label>
					<select id="reference-zone" value={referenceZone} onChange={(event) => setReferenceZone(event.currentTarget.value)} class="mt-2 w-full border border-[var(--color-line)] bg-[var(--color-canvas)] px-4 py-3 font-serif text-xl text-[var(--color-ink)] outline-none focus:border-[var(--color-signal)]">
						{cities.filter((city, index, items) => items.findIndex((item) => item.zone === city.zone) === index).map((city) => <option value={city.zone}>{city.name} · {city.zone}</option>)}
					</select>
					<p class="mt-7 font-mono text-5xl tracking-[-0.07em] sm:text-6xl">{formatClock(now, referenceZone, false)}</p>
					<p class="mt-3 text-sm text-[var(--color-muted)]">{formatDate(now, referenceZone)} · {getLocalParts(now, referenceZone).abbreviation} · {formatOffset(getOffsetMinutes(now, referenceZone))}</p>
				</div>
				<div class="border-t border-[var(--color-line)] bg-[var(--color-ink)] p-6 text-[var(--color-canvas)] lg:border-l lg:border-t-0 sm:p-8">
					<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-signal)]">What this changes</p>
					<p class="mt-5 font-serif text-3xl leading-tight">A city name carries the date and clock rule. An offset alone does not.</p>
					<p class="mt-5 text-sm leading-6 text-[var(--color-subtle)]">{reference.name} uses {referenceZone}. {seasonalRule(referenceZone, now)}. Switch the reference to see what your own local time means elsewhere.</p>
				</div>
			</div>

			<div class="p-6 sm:p-8">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 class="font-serif text-4xl tracking-[-0.045em]">The world, relative to you</h2>
						<p class="mt-2 max-w-xl text-sm leading-6 text-[var(--color-muted)]">Live time, date relation and current UTC offset across useful global hubs.</p>
					</div>
					<label class="block sm:w-72"><span class="sr-only">Find a city or time zone</span><input value={search} onInput={(event) => setSearch(event.currentTarget.value)} placeholder="Find a city or IANA zone" class="w-full border-b border-[var(--color-ink)] bg-transparent px-0 py-2 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-subtle)] focus:border-[var(--color-signal)]" /></label>
				</div>
				<div class="mt-8 grid gap-px bg-[var(--color-line)] sm:grid-cols-2 xl:grid-cols-3">
					{visibleCities.map((city: City) => {
						const currentOffset = getOffsetMinutes(now, city.zone);
						return <article class="group bg-[var(--color-surface)] p-5 hover:bg-[var(--color-canvas)]">
							<div class="flex items-start justify-between gap-4"><div><p class="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-subtle)]">{city.country}</p><h3 class="mt-2 font-serif text-3xl tracking-[-0.04em]">{city.name}</h3></div><span class="font-mono text-xs text-[var(--color-signal)]">{formatOffset(currentOffset)}</span></div>
							<p class="mt-7 font-mono text-4xl tracking-[-0.07em]">{formatClock(now, city.zone, false)}</p>
							<p class="mt-2 text-sm text-[var(--color-muted)]">{formatDate(now, city.zone)} · {getDayRelation(now, city.zone, referenceZone)}</p>
							<div class="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[9px] uppercase tracking-[0.12em]"><a href={`/time/${city.slug}`} class="text-[var(--color-ink)] hover:text-[var(--color-signal)]">City time →</a>{city.zone !== referenceZone && <a href="/meeting-planner" class="text-[var(--color-muted)] hover:text-[var(--color-signal)]">Plan together →</a>}</div>
						</article>;
					})}
				</div>
				{visibleCities.length === 0 && <p class="mt-8 text-sm text-[var(--color-muted)]">No city matched that search. Try London, India, America/New_York or UTC.</p>}
			</div>
		</div>
	);
}
