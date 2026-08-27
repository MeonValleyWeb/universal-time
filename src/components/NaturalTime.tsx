import { useEffect, useMemo, useState } from 'preact/hooks';
import { cities, type City } from '../lib/cities';
import { parseNaturalTime } from '../lib/natural-time';
import {
	formatClock,
	formatDate,
	formatFullDate,
	getLocalParts,
	getOffsetMinutes,
	zoneOption,
} from '../lib/time';

interface Props {
	initialNow: number;
	initialQuery?: string;
}

const cityForBrowserZone = (zone: string): City =>
	cities.find((city) => city.zone === zone) ?? {
		slug: 'local',
		name: zoneOption(zone).city,
		country: 'Your browser timezone',
		zone,
		aliases: [],
		description: 'The local timezone reported by your browser.',
	};

export default function NaturalTime({
	initialNow,
	initialQuery = '3pm London in Tokyo next Thursday',
}: Props) {
	const [now, setNow] = useState(initialNow);
	const [query, setQuery] = useState(initialQuery);
	const [submitted, setSubmitted] = useState(initialQuery);
	const [copied, setCopied] = useState(false);
	const [localTarget, setLocalTarget] = useState<City>(cities.find((city) => city.slug === 'london')!);
	const result = useMemo(() => parseNaturalTime(submitted, now, localTarget), [submitted, now, localTarget]);

	useEffect(() => {
		const interval = window.setInterval(() => setNow(Date.now()), 30_000);
		const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		setLocalTarget(cityForBrowserZone(localZone));
		const sharedQuery = new URLSearchParams(window.location.search).get('q');
		if (sharedQuery) {
			setQuery(sharedQuery);
			setSubmitted(sharedQuery);
		}
		return () => window.clearInterval(interval);
	}, []);

	const submit = (event: Event) => {
		event.preventDefault();
		const nextQuery = query.trim();
		setSubmitted(nextQuery);
		setCopied(false);
		const url = new URL(window.location.href);
		url.searchParams.set('q', nextQuery);
		window.history.replaceState({}, '', url);
	};

	const copy = async () => {
		if (!result) return;
		const text = `${formatDate(result.timestamp, result.source.zone)} ${formatClock(result.timestamp, result.source.zone, true)} ${result.source.name} · ${formatDate(result.timestamp, result.target.zone)} ${formatClock(result.timestamp, result.target.zone, true)} ${result.target.name}`;
		await navigator.clipboard.writeText(text);
		setCopied(true);
	};

	const share = async () => {
		const url = new URL(window.location.href);
		url.pathname = '/';
		url.search = '';
		url.searchParams.set('q', submitted);
		await navigator.clipboard.writeText(url.toString());
		setCopied(true);
	};

	const targetHour = result ? getLocalParts(result.timestamp, result.target.zone).hour : 0;
	const goodTime = targetHour >= 8 && targetHour < 18;
	const hourDifference = result
		? (getOffsetMinutes(result.timestamp, result.target.zone) - getOffsetMinutes(result.timestamp, result.source.zone)) / 60
		: 0;

	return (
			<section class="atlas-panel min-w-0 overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-panel)] sm:p-7 lg:p-8">
				<form onSubmit={submit}>
					<div class="mb-3 flex flex-wrap items-center justify-between gap-2">
						<label for="time-query" class="block font-mono text-[11px] uppercase tracking-[0.13em] text-[var(--color-muted)]">
							Ask anything about time
						</label>
						<span class="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[var(--color-fg)] before:size-1.5 before:rounded-full before:bg-[var(--color-accent)] before:shadow-[0_0_0_4px_oklch(0.73_0.16_245/0.12)]">
							Your time · {localTarget.name}
						</span>
					</div>
					<div class="relative border-b border-[var(--color-border)] pb-3 focus-within:border-[var(--color-accent)]">
						<input
							id="time-query"
							value={query}
							onInput={(event) => setQuery(event.currentTarget.value)}
							class="w-full bg-transparent pr-14 font-serif text-xl leading-tight tracking-[-0.025em] text-[var(--color-fg)] outline-none placeholder:text-[var(--color-subtle)] sm:text-3xl"
							placeholder="4pm New York in London tomorrow"
							autocomplete="off"
						/>
						<button aria-label="Convert time" class="absolute bottom-3 right-0 grid size-11 place-items-center rounded-[var(--radius-button)] border border-[var(--color-accent)] bg-[var(--color-accent)] text-xl text-[var(--color-signal-ink)] hover:-translate-y-px hover:brightness-110 active:translate-y-0">
							→
						</button>
					</div>
				</form>

				<div aria-live="polite" class="mt-8 min-h-[255px]">
					{result ? (
						<div>
							<div class="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.13em] text-[var(--color-muted)]">
								<span class={`size-2 rounded-full ${goodTime ? 'bg-[var(--color-accent)]' : 'bg-amber-400'}`} />
								{result.intent === 'before-bed'
									? (goodTime ? `A good time to call ${result.target.name}` : `${result.target.name} may be asleep`)
									: (goodTime ? 'A good time to call' : 'Outside usual working hours')}
								{result.detectedTimeCount > 1 && <span>· first of {result.detectedTimeCount} times</span>}
							</div>
							<div class="mt-5 flex min-w-0 items-start">
								<span class="min-w-0 font-serif text-[clamp(4.25rem,9vw,7rem)] font-medium leading-[0.82] tracking-[-0.065em] text-[var(--color-fg)] tabular-nums">
									{formatClock(result.timestamp, result.answer.zone, false)}
								</span>
								<span class="ml-3 mt-1 rounded-[var(--radius-control)] bg-[var(--color-accent)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-signal-ink)] sm:mt-3">
									{getLocalParts(result.timestamp, result.answer.zone).abbreviation}
								</span>
							</div>
							<div class="mt-7 flex flex-wrap items-end justify-between gap-5">
								<div>
									<p class="font-serif text-2xl text-[var(--color-fg)]">{formatFullDate(result.timestamp, result.answer.zone)} in {result.answer.name}</p>
									<p class="mt-1 text-sm text-[var(--color-muted)]">
										{result.intent === 'before-bed'
											? `${formatClock(result.timestamp, result.target.zone, false)} ${formatFullDate(result.timestamp, result.target.zone)} in ${result.target.name}`
											: hourDifference === 0
											? `Same time as ${result.source.name}`
											: `${Math.abs(hourDifference)} hours ${hourDifference > 0 ? 'ahead of' : 'behind'} ${result.source.name}`}
									</p>
									{result.warnings.map((warning) => (
										<p class="mt-2 max-w-xl text-xs leading-5 text-[var(--color-accent)]">{warning}</p>
									))}
								</div>
								<div class="flex flex-wrap gap-2">
									<button type="button" onClick={copy} class="rounded-[var(--radius-button)] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)] hover:border-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)]">
										{copied ? 'Copied' : 'Copy answer'}
									</button>
									<button type="button" onClick={share} class="rounded-[var(--radius-button)] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)] hover:border-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)]">
										Share query
									</button>
									{result.source.slug !== 'local' ? (
										<a href={`/convert/${result.source.slug}/${result.target.slug}`} class="inline-flex min-h-11 items-center rounded-[var(--radius-button)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-[var(--color-signal-ink)] hover:-translate-y-px hover:brightness-110">
											Open converter
										</a>
									) : (
										<a href="/meeting-planner" class="inline-flex min-h-11 items-center rounded-[var(--radius-button)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-[var(--color-signal-ink)] hover:-translate-y-px hover:brightness-110">
											Open planner
										</a>
									)}
								</div>
							</div>
						</div>
					) : (
						<div class="border-l-2 border-[var(--color-accent)] pl-5">
							<p class="font-serif text-2xl text-[var(--color-fg)]">We couldn’t place that time yet.</p>
							<p class="mt-2 text-sm text-[var(--color-muted)]">Try “9:30am New York in London tomorrow”.</p>
						</div>
					)}
				</div>
			</section>
	);
}
