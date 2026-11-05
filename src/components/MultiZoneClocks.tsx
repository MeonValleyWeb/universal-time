import { useCurrentTime } from '../lib/use-current-time';
import type { CountryTimeZone } from '../lib/country-times';
import { formatClock, formatFullDate, formatOffset, getLocalParts, getOffsetMinutes } from '../lib/time';

interface Props {
	zones: CountryTimeZone[];
}

export default function MultiZoneClocks({ zones }: Props) {
	const now = useCurrentTime();

	return (
		<div class={`grid gap-px border border-[var(--color-line)] bg-[var(--color-line)] ${zones.length > 3 ? 'lg:grid-cols-2 xl:grid-cols-4' : 'lg:grid-cols-3'}`}>
			{zones.map((item) => {
				const parts = now === null ? null : getLocalParts(now, item.zone);
				return (
					<section class="bg-[var(--color-surface)] p-6 sm:p-7">
						<div class="flex items-baseline justify-between gap-4">
							<p class="font-sans text-[10px] font-bold normal-case tracking-[0.16em] text-[var(--color-accent)]">{item.abbreviation}</p>
							<p class="font-sans text-[10px] normal-case tracking-wide text-[var(--color-muted)]">{now === null ? 'UTC offset loading…' : formatOffset(getOffsetMinutes(now, item.zone))}</p>
						</div>
						<p class="mt-5 font-serif text-[clamp(3rem,7vw,4.8rem)] font-medium leading-none tracking-[-0.06em] tabular-nums">{now === null ? '--:--' : formatClock(now, item.zone, false)}</p>
						<p class="mt-4 text-sm text-[var(--color-muted)]">{now === null ? 'Loading current local date…' : `${formatFullDate(now, item.zone)} · ${parts?.abbreviation}`}</p>
						<p class="mt-5 font-serif text-xl leading-snug text-[var(--color-ink)]">{item.name}</p>
						<p class="mt-2 text-sm leading-6 text-[var(--color-muted)]">{item.places}</p>
					</section>
				);
			})}
		</div>
	);
}
