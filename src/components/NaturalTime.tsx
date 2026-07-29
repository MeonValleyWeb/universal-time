import { useEffect, useMemo, useState } from 'preact/hooks';
import { cities, featuredCitySlugs, type City } from '../lib/cities';
import { parseNaturalTime } from '../lib/natural-time';
import {
	formatClock,
	formatDate,
	formatFullDate,
	getLocalParts,
	getOffsetMinutes,
} from '../lib/time';

interface Props {
	initialNow: number;
	initialQuery?: string;
}

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
	const featured = featuredCitySlugs.map((slug) => cities.find((city) => city.slug === slug)!);

	useEffect(() => {
		const interval = window.setInterval(() => setNow(Date.now()), 30_000);
		const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const knownCity = cities.find((city) => city.zone === localZone);
		if (knownCity) setLocalTarget(knownCity);
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
		<>
			<section class="rounded-[2rem] border border-stone-300 bg-[#faf8f2] p-6 shadow-[0_30px_80px_rgba(41,37,36,0.09)] sm:p-10 lg:p-12">
				<form onSubmit={submit}>
					<label for="time-query" class="mb-3 block font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
						Ask anything about time
					</label>
					<div class="relative border-b-2 border-stone-950 pb-3 focus-within:border-orange-600">
						<input
							id="time-query"
							value={query}
							onInput={(event) => setQuery(event.currentTarget.value)}
							class="w-full bg-transparent pr-14 font-serif text-2xl leading-tight tracking-[-0.025em] text-stone-950 outline-none placeholder:text-stone-400 sm:text-4xl"
							placeholder="4pm New York in London tomorrow"
							autocomplete="off"
						/>
						<button aria-label="Convert time" class="absolute bottom-3 right-0 grid size-10 place-items-center rounded-full bg-orange-600 text-xl text-white hover:scale-105 active:scale-95">
							→
						</button>
					</div>
				</form>

				<div aria-live="polite" class="mt-10 min-h-[255px]">
					{result ? (
						<div>
							<div class="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
								<span class={`size-2 rounded-full ${goodTime ? 'bg-emerald-500' : 'bg-orange-500'}`} />
								{goodTime ? 'A good time to call' : 'Outside usual working hours'}
								{result.detectedTimeCount > 1 && <span>· first of {result.detectedTimeCount} times</span>}
							</div>
							<div class="mt-5 flex items-start">
								<span class="font-mono text-[clamp(4.6rem,14vw,10.5rem)] font-medium leading-[0.78] tracking-[-0.095em] text-stone-950">
									{formatClock(result.timestamp, result.target.zone, false)}
								</span>
								<span class="ml-3 mt-1 rounded-full bg-orange-600 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white sm:mt-3">
									{getLocalParts(result.timestamp, result.target.zone).abbreviation}
								</span>
							</div>
							<div class="mt-7 flex flex-wrap items-end justify-between gap-5">
								<div>
									<p class="font-serif text-2xl text-stone-950">{formatFullDate(result.timestamp, result.target.zone)} in {result.target.name}</p>
									<p class="mt-1 text-sm text-stone-500">
										{hourDifference === 0
											? `Same time as ${result.source.name}`
											: `${Math.abs(hourDifference)} hours ${hourDifference > 0 ? 'ahead of' : 'behind'} ${result.source.name}`}
									</p>
									{result.warnings.map((warning) => (
										<p class="mt-2 max-w-xl text-xs leading-5 text-orange-700">{warning}</p>
									))}
								</div>
								<div class="flex gap-2">
									<button type="button" onClick={copy} class="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:border-stone-950">
										{copied ? 'Copied' : 'Copy answer'}
									</button>
									<button type="button" onClick={share} class="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:border-stone-950">
										Share query
									</button>
									<a href={`/convert/${result.source.slug}/${result.target.slug}`} class="rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
										Open converter
									</a>
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

			<div class="mt-14 grid grid-cols-2 border-l border-t border-stone-300 sm:grid-cols-3 lg:grid-cols-6">
				{featured.map((city) => {
					const hour = getLocalParts(now, city.zone).hour;
					return (
						<a href={`/time/${city.slug}`} class="group min-h-32 border-b border-r border-stone-300 p-4 hover:bg-stone-950 hover:text-white">
							<div class="flex items-center justify-between">
								<span class="font-mono text-[9px] uppercase tracking-[0.12em] text-stone-500 group-hover:text-stone-400">{city.country}</span>
								<span class={`size-1.5 rounded-full ${hour >= 7 && hour < 20 ? 'bg-emerald-500' : 'bg-indigo-400'}`} />
							</div>
							<p class="mt-6 font-serif text-lg">{city.name}</p>
							<p class="mt-1 font-mono text-2xl tracking-[-0.06em]">{formatClock(now, city.zone, false)}</p>
						</a>
					);
				})}
			</div>
		</>
	);
}
