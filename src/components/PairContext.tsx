import type { City } from '../lib/cities';
import { getPairContext } from '../lib/search-context';
import { useCurrentTime } from '../lib/use-current-time';

export default function PairContext({ from, to }: { from: City; to: City }) {
	const now = useCurrentTime();
	const context = now === null ? null : getPairContext(from, to, now);
	return <div class="grid gap-px bg-[var(--color-line)] sm:grid-cols-2">
		<article class="bg-[var(--color-surface)] p-6">
			<p class="font-sans text-[9px] normal-case tracking-[0.18em] text-[var(--color-muted)]">Working-hour overlap</p>
			<h3 class="mt-5 font-serif text-2xl">When both cities are at work</h3>
			<p class="mt-3 text-sm leading-6 text-[var(--color-muted)]">{context?.overlapSummary ?? 'Compare the local 09:00–17:00 working days for both cities using the date of your call.'}</p>
		</article>
		<article class="bg-[var(--color-surface)] p-6">
			<p class="font-sans text-[9px] normal-case tracking-[0.18em] text-[var(--color-muted)]">Calendar boundary</p>
			<h3 class="mt-5 font-serif text-2xl">Check the date, not just the hour</h3>
			<p class="mt-3 text-sm leading-6 text-[var(--color-muted)]">{context?.dateSummary ?? 'A conversion can land on a different local date. Check both cities before sending an invitation.'}</p>
		</article>
		<article class="bg-[var(--color-surface)] p-6 sm:col-span-2">
			<p class="font-sans text-[9px] normal-case tracking-[0.18em] text-[var(--color-muted)]">Daylight saving time</p>
			<h3 class="mt-5 font-serif text-2xl">The gap can move during the year</h3>
			<p class="mt-3 text-sm leading-6 text-[var(--color-muted)]">{context?.dstSummary ?? 'Time differences follow each city’s seasonal rules. Use a named city and an exact date for a future meeting.'}</p>
		</article>
	</div>;
}
