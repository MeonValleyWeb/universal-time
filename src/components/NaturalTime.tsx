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
			<section class="atlas-panel min-w-0 border border-stone-950/20 bg-[#fbf7ed]/90 p-5 shadow-[0_24px_70px_rgba(68,54,36,0.10)] backdrop-blur-[2px] sm:p-8 lg:p-10">
				<form onSubmit={submit}>
					<div class="mb-3 flex flex-wrap items-center justify-between gap-2">
						<label for="time-query" class="block font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
							Ask anything about time
						</label>
						<span class="font-mono text-[9px] uppercase tracking-[0.14em] text-orange-700">
							Your time · {localTarget.name}
						</span>
					</div>
					<div class="relative border-b-2 border-stone-950 pb-3 focus-within:border-orange-600">
						<input
							id="time-query"
							value={query}
							onInput={(event) => setQuery(event.currentTarget.value)}
							class="w-full bg-transparent pr-14 font-serif text-xl leading-tight tracking-[-0.025em] text-stone-950 outline-none placeholder:text-stone-400 sm:text-4xl"
							placeholder="4pm New York in London tomorrow"
							autocomplete="off"
						/>
						<button aria-label="Convert time" class="absolute bottom-3 right-0 grid size-10 place-items-center rounded-full bg-orange-600 text-xl text-white hover:scale-105 active:scale-95">
							→
						</button>
					</div>
				</form>

				<div aria-live="polite" class="mt-9 min-h-[255px]">
					{result ? (
						<div>
							<div class="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
								<span class={`size-2 rounded-full ${goodTime ? 'bg-emerald-500' : 'bg-orange-500'}`} />
								{result.intent === 'before-bed'
									? (goodTime ? `A good time to call ${result.target.name}` : `${result.target.name} may be asleep`)
									: (goodTime ? 'A good time to call' : 'Outside usual working hours')}
								{result.detectedTimeCount > 1 && <span>· first of {result.detectedTimeCount} times</span>}
							</div>
							<div class="mt-5 flex min-w-0 items-start">
								<span class="min-w-0 font-['Share_Tech_Mono'] text-[clamp(4.5rem,9.5vw,9.5rem)] leading-[0.78] tracking-[-0.075em] text-stone-950">
									{formatClock(result.timestamp, result.answer.zone, false)}
								</span>
								<span class="ml-3 mt-1 rounded-full bg-orange-600 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white sm:mt-3">
									{getLocalParts(result.timestamp, result.answer.zone).abbreviation}
								</span>
							</div>
							<div class="mt-7 flex flex-wrap items-end justify-between gap-5">
								<div>
									<p class="font-serif text-2xl text-stone-950">{formatFullDate(result.timestamp, result.answer.zone)} in {result.answer.name}</p>
									<p class="mt-1 text-sm text-stone-500">
										{result.intent === 'before-bed'
											? `${formatClock(result.timestamp, result.target.zone, false)} ${formatFullDate(result.timestamp, result.target.zone)} in ${result.target.name}`
											: hourDifference === 0
											? `Same time as ${result.source.name}`
											: `${Math.abs(hourDifference)} hours ${hourDifference > 0 ? 'ahead of' : 'behind'} ${result.source.name}`}
									</p>
									{result.warnings.map((warning) => (
										<p class="mt-2 max-w-xl text-xs leading-5 text-orange-700">{warning}</p>
									))}
								</div>
								<div class="flex flex-wrap gap-2">
									<button type="button" onClick={copy} class="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:border-stone-950">
										{copied ? 'Copied' : 'Copy answer'}
									</button>
									<button type="button" onClick={share} class="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:border-stone-950">
										Share query
									</button>
									{result.source.slug !== 'local' ? (
										<a href={`/convert/${result.source.slug}/${result.target.slug}`} class="rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
											Open converter
										</a>
									) : (
										<a href="/meeting-planner" class="rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
											Open planner
										</a>
									)}
								</div>
							</div>
						</div>
					) : (
						<div class="border-l-2 border-orange-600 pl-5">
							<p class="font-serif text-2xl text-stone-950">We couldn’t place that time yet.</p>
							<p class="mt-2 text-sm text-stone-500">Try “9:30am New York in London tomorrow”.</p>
						</div>
					)}
				</div>
			</section>
	);
}
