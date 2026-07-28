import { useEffect, useMemo, useState } from 'preact/hooks';
import { cities, featuredCitySlugs, type City } from '../lib/cities';
import {
	formatClock,
	formatDate,
	formatFullDate,
	getLocalParts,
	getOffsetMinutes,
	zonedDateToUtc,
} from '../lib/time';

interface Props {
	initialNow: number;
	initialQuery?: string;
}

interface Result {
	source: City;
	target: City;
	timestamp: number;
}

const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const matchingCities = (input: string) => {
	const lower = input.toLocaleLowerCase();
	return cities
		.map((city) => ({
			city,
			index: Math.min(...city.aliases.map((alias) => {
				const index = lower.indexOf(alias);
				return index === -1 ? Number.POSITIVE_INFINITY : index;
			})),
		}))
		.filter(({ index }) => Number.isFinite(index))
		.sort((a, b) => a.index - b.index)
		.filter((entry, index, all) => !all.slice(0, index).some((prior) => prior.city.zone === entry.city.zone && prior.index === entry.index))
		.map(({ city }) => city);
};

const localDateParts = (timestamp: number, timeZone: string) => {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	}).formatToParts(timestamp);
	const values = Object.fromEntries(parts.map((part) => [part.type, Number(part.value)]));
	return { year: values.year, month: values.month, day: values.day };
};

const resolveDate = (input: string, source: City, now: number) => {
	const local = localDateParts(now, source.zone);
	const date = new Date(Date.UTC(local.year, local.month - 1, local.day));
	const lower = input.toLocaleLowerCase();

	if (lower.includes('tomorrow')) date.setUTCDate(date.getUTCDate() + 1);
	const weekday = weekdays.findIndex((day) => lower.includes(day));
	if (weekday >= 0) {
		let advance = (weekday - date.getUTCDay() + 7) % 7;
		if (advance === 0 || lower.includes('next ')) advance += 7;
		date.setUTCDate(date.getUTCDate() + advance);
	}

	const iso = input.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);
	if (iso) return { year: Number(iso[1]), month: Number(iso[2]), day: Number(iso[3]) };
	return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
};

const parseQuery = (input: string, now: number): Result | null => {
	const found = matchingCities(input);
	if (!found.length) return null;
	const source = found[0];
	const target = found[1] ?? source;
	const match = input.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
	if (!match) return { source, target, timestamp: now };

	let hour = Number(match[1]);
	const minute = Number(match[2] ?? 0);
	const period = match[3]?.toLocaleLowerCase();
	if (period === 'pm' && hour < 12) hour += 12;
	if (period === 'am' && hour === 12) hour = 0;
	if (hour > 23 || minute > 59) return null;
	const date = resolveDate(input, source, now);

	return {
		source,
		target,
		timestamp: zonedDateToUtc(date.year, date.month, date.day, hour, minute, source.zone),
	};
};

export default function NaturalTime({
	initialNow,
	initialQuery = '3pm London in Tokyo next Thursday',
}: Props) {
	const [now, setNow] = useState(initialNow);
	const [query, setQuery] = useState(initialQuery);
	const [submitted, setSubmitted] = useState(initialQuery);
	const [copied, setCopied] = useState(false);
	const result = useMemo(() => parseQuery(submitted, now), [submitted, now]);
	const featured = featuredCitySlugs.map((slug) => cities.find((city) => city.slug === slug)!);

	useEffect(() => {
		const interval = window.setInterval(() => setNow(Date.now()), 30_000);
		return () => window.clearInterval(interval);
	}, []);

	const submit = (event: Event) => {
		event.preventDefault();
		setSubmitted(query.trim());
		setCopied(false);
	};

	const copy = async () => {
		if (!result) return;
		const text = `${formatDate(result.timestamp, result.source.zone)} ${formatClock(result.timestamp, result.source.zone, true)} ${result.source.name} · ${formatDate(result.timestamp, result.target.zone)} ${formatClock(result.timestamp, result.target.zone, true)} ${result.target.name}`;
		await navigator.clipboard.writeText(text);
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
								</div>
								<div class="flex gap-2">
									<button type="button" onClick={copy} class="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:border-stone-950">
										{copied ? 'Copied' : 'Copy answer'}
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
