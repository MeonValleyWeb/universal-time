import { useMemo } from 'preact/hooks';
import type { CelestialEvent } from '../lib/celestial-events';

export default function EventLocalTime({ event }: { event: CelestialEvent }) {
	const timeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
	const localTime = useMemo(
		() => new Intl.DateTimeFormat([], { dateStyle: 'full', timeStyle: 'short', timeZone }).format(new Date(event.at)),
		[event.at, timeZone],
	);

	return (
		<div class="border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-8">
			<p class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-signal)]">In your browser’s time zone</p>
			<p class="mt-4 font-serif text-3xl tracking-[-0.035em]">{localTime}</p>
			<p class="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">{timeZone}</p>
			<p class="mt-5 text-sm leading-6 text-[var(--color-muted)]">{event.localNote}</p>
		</div>
	);
}
