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
			<section class="time-instrument min-w-0 border border-[var(--color-line)] bg-[var(--color-surface)]/92 backdrop-blur-[3px]">
				<form onSubmit={submit} class="grid border-b border-[var(--color-line)] md:grid-cols-[12rem_1fr_auto]">
					<label for="time-query" class="flex items-center border-b border-[var(--color-line)] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-subtle)] md:border-b-0 md:border-r">
						Ask about time
					</label>
					<div class="relative px-5 py-4 focus-within:bg-[var(--color-input)]">
						<input
							id="time-query"
							value={query}
							onInput={(event) => setQuery(event.currentTarget.value)}
							class="w-full bg-transparent font-serif text-xl leading-tight tracking-[-0.025em] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-subtle)] sm:text-2xl lg:text-3xl"
							placeholder="4pm New York in London tomorrow"
							autocomplete="off"
						/>
					</div>
					<button class="m-3 min-h-12 bg-[var(--color-ink)] px-7 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-canvas)] hover:bg-[var(--color-signal)] hover:text-[var(--color-signal-ink)] active:translate-y-px">
						Find the time
					</button>
				</form>

				<div aria-live="polite" class="min-h-[300px]">
					{result ? (
						<div class="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.5fr)]">
							<div class="min-w-0 border-b border-[var(--color-line)] p-5 sm:p-7 lg:border-b-0 lg:border-r lg:p-9">
								<div class="flex flex-wrap items-center justify-between gap-3">
									<p class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-subtle)]">
										{result.intent === 'before-bed'
											? (goodTime ? `A good time to call ${result.target.name}` : `${result.target.name} may be asleep`)
											: (goodTime ? 'A good time to call' : 'Outside usual working hours')}
									</p>
									<p class="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-signal)]">
										Local reference: {localTarget.name}
									</p>
								</div>
								<div class="mt-7 flex min-w-0 items-start">
									<span class="min-w-0 font-['Share_Tech_Mono'] text-[clamp(5.4rem,15vw,13rem)] leading-[0.72] tracking-[-0.075em] text-[var(--color-ink)]">
										{formatClock(result.timestamp, result.answer.zone, false)}
									</span>
									<span class="ml-3 border border-[var(--color-signal)] px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--color-signal)] sm:mt-2">
										{getLocalParts(result.timestamp, result.answer.zone).abbreviation}
									</span>
								</div>
							</div>
							<div class="flex flex-col justify-between p-5 sm:p-7 lg:p-9">
								<div>
									<p class="font-serif text-4xl leading-[0.95] tracking-[-0.04em] text-[var(--color-ink)]">{result.answer.name}</p>
									<p class="mt-4 text-base leading-6 text-[var(--color-muted)]">{formatFullDate(result.timestamp, result.answer.zone)}</p>
									<p class="mt-2 text-sm leading-6 text-[var(--color-subtle)]">
										{result.intent === 'before-bed'
											? `${formatClock(result.timestamp, result.target.zone, false)} ${formatFullDate(result.timestamp, result.target.zone)} in ${result.target.name}`
											: hourDifference === 0
											? `Same time as ${result.source.name}`
											: `${Math.abs(hourDifference)} hours ${hourDifference > 0 ? 'ahead of' : 'behind'} ${result.source.name}`}
									</p>
									{result.warnings.map((warning) => (
										<p class="mt-3 text-xs leading-5 text-[var(--color-signal)]">{warning}</p>
									))}
								</div>
								<div class="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-[var(--color-line)] pt-5">
									<button type="button" onClick={copy} class="text-sm text-[var(--color-muted)] underline-offset-4 hover:text-[var(--color-ink)] hover:underline">
										{copied ? 'Copied' : 'Copy answer'}
									</button>
									<button type="button" onClick={share} class="text-sm text-[var(--color-muted)] underline-offset-4 hover:text-[var(--color-ink)] hover:underline">
										Share query
									</button>
									{result.source.slug !== 'local' ? (
										<a href={`/convert/${result.source.slug}/${result.target.slug}`} class="text-sm font-medium text-[var(--color-signal)] underline-offset-4 hover:underline">
											Open converter →
										</a>
									) : (
										<a href="/meeting-planner" class="text-sm font-medium text-[var(--color-signal)] underline-offset-4 hover:underline">
											Open planner →
										</a>
									)}
								</div>
							</div>
						</div>
					) : (
						<div class="p-7 sm:p-10">
							<p class="font-serif text-4xl text-[var(--color-ink)]">We couldn’t place that time yet.</p>
							<p class="mt-3 text-sm text-[var(--color-muted)]">Try “9:30am New York in London tomorrow”.</p>
						</div>
					)}
				</div>
			</section>
	);
}
