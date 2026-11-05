import { useCurrentTime } from '../lib/use-current-time';
import { formatClock, formatFullDate, formatOffset, getLocalParts, getOffsetMinutes } from '../lib/time';

export default function CityClock({ zone }: { zone: string }) {
	const now = useCurrentTime(1000);
	const parts = now === null ? null : getLocalParts(now, zone);
	return (
		<div>
			<div class="font-serif text-6xl font-medium tracking-[-0.065em] tabular-nums sm:text-8xl lg:text-[9.5rem]">
				{now === null ? '--:--' : formatClock(now, zone, false)}
				<span class="ml-2 align-top font-sans text-[0.2em] tracking-normal text-[var(--color-accent)]">{now === null ? '--' : String(new Date(now).getUTCSeconds()).padStart(2, '0')}</span>
			</div>
			<div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--color-muted)]">
				<span>{now === null ? 'Loading current local time…' : formatFullDate(now, zone)}</span>
				<span class="size-1 rounded-full bg-[var(--color-accent)]" />
				<span>{now === null ? 'UTC offset loading…' : `${parts?.abbreviation} · ${formatOffset(getOffsetMinutes(now, zone))}`}</span>
			</div>
		</div>
	);
}
