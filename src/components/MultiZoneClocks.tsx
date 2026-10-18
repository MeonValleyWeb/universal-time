import { useEffect, useState } from 'preact/hooks';
import type { CountryTimeZone } from '../lib/country-times';
import { formatClock, formatFullDate, formatOffset, getLocalParts, getOffsetMinutes } from '../lib/time';

interface Props {
	zones: CountryTimeZone[];
	initialNow: number;
}

export default function MultiZoneClocks({ zones, initialNow }: Props) {
	const [now, setNow] = useState(initialNow);

	useEffect(() => {
		const interval = window.setInterval(() => setNow(Date.now()), 30_000);
		return () => window.clearInterval(interval);
	}, []);

	return (
		<div class={`grid gap-px border border-[var(--color-line)] bg-[var(--color-line)] ${zones.length > 3 ? 'lg:grid-cols-2 xl:grid-cols-4' : 'lg:grid-cols-3'}`}>
			{zones.map((item) => {
				const parts = getLocalParts(now, item.zone);
				return (
					<section class="bg-[var(--color-surface)] p-6 sm:p-7">
						<div class="flex items-baseline justify-between gap-4">
							<p class="font-sans text-[10px] font-bold normal-case tracking-[0.16em] text-[var(--color-accent)]">{item.abbreviation}</p>
							<p class="font-sans text-[10px] normal-case tracking-wide text-[var(--color-muted)]">{formatOffset(getOffsetMinutes(now, item.zone))}</p>
						</div>
						<p class="mt-5 font-serif text-[clamp(3rem,7vw,4.8rem)] font-medium leading-none tracking-[-0.06em] tabular-nums">{formatClock(now, item.zone, false)}</p>
						<p class="mt-4 text-sm text-[var(--color-muted)]">{formatFullDate(now, item.zone)} · {parts.abbreviation}</p>
						<p class="mt-5 font-serif text-xl leading-snug text-[var(--color-ink)]">{item.name}</p>
						<p class="mt-2 text-sm leading-6 text-[var(--color-muted)]">{item.places}</p>
					</section>
				);
			})}
		</div>
	);
}
