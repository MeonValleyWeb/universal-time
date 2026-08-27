import { useEffect, useState } from 'preact/hooks';
import { formatClock, formatFullDate, formatOffset, getLocalParts, getOffsetMinutes } from '../lib/time';

export default function CityClock({ zone, initialNow }: { zone: string; initialNow: number }) {
	const [now, setNow] = useState(initialNow);

	useEffect(() => {
		const interval = window.setInterval(() => setNow(Date.now()), 1000);
		return () => window.clearInterval(interval);
	}, []);

	const parts = getLocalParts(now, zone);
	return (
		<div>
			<div class="font-serif text-6xl font-medium tracking-[-0.065em] tabular-nums sm:text-8xl lg:text-[9.5rem]">
				{formatClock(now, zone, false)}
				<span class="ml-2 align-top font-mono text-[0.2em] tracking-normal text-[var(--color-accent)]">{String(new Date(now).getUTCSeconds()).padStart(2, '0')}</span>
			</div>
			<div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--color-muted)]">
				<span>{formatFullDate(now, zone)}</span>
				<span class="size-1 rounded-full bg-[var(--color-accent)]" />
				<span>{parts.abbreviation} · {formatOffset(getOffsetMinutes(now, zone))}</span>
			</div>
		</div>
	);
}
