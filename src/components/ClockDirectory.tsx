import { cities, type City } from '../lib/cities';
import { formatOffset, getOffsetMinutes } from '../lib/time';
import { useCurrentTime } from '../lib/use-current-time';

export default function ClockDirectory() {
	const now = useCurrentTime();
	const groups = new Map<number, City[]>();
	for (const city of cities) {
		const offset = now === null ? 0 : getOffsetMinutes(now, city.zone);
		groups.set(offset, [...(groups.get(offset) ?? []), city]);
	}
	return <div class="mt-8 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3" data-clock-directory>
		{[...groups].sort(([a], [b]) => a - b).map(([offset, places]) => {
			const label = now === null ? 'City clocks' : offset === 0 ? 'UTC / GMT' : formatOffset(offset);
			return <section key={offset} class="border-t border-[var(--color-border)] pt-4" aria-label={`${label} city clocks`}>
				<div class="flex items-baseline justify-between gap-3">
					<h3 class="text-sm font-medium text-[var(--color-accent)]">{label}</h3>
					<span class="text-xs text-[var(--color-muted)]">{places.length} {places.length === 1 ? 'place' : 'places'}</span>
				</div>
				<div class="mt-2">
					{[...places].sort((a, b) => a.name.localeCompare(b.name)).map((city) => (
						<a key={city.slug} href={`/time/${city.slug}`} class="flex items-center justify-between gap-3 border-b border-[var(--color-border)] py-3 text-sm text-[var(--color-fg)] hover:text-[var(--color-accent)]">
							<span>{city.name}</span><span class="shrink-0 text-xs text-[var(--color-muted)]">{city.country}</span>
						</a>
					))}
				</div>
			</section>;
		})}
	</div>;
}
