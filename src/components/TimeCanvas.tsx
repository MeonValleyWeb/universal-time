import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import {
	formatClock,
	formatDate,
	formatFullDate,
	formatOffset,
	findBestMeetingStart,
	getDayPhase,
	getDayRelation,
	getLocalParts,
	getMeetingScore,
	getOffsetMinutes,
	getTimeZoneOptions,
	zoneOption,
} from '../lib/time';

interface Props {
	initialNow: number;
}

const HOUR = 3_600_000;
const CELL_WIDTH = 72;
const HOURS_VISIBLE = 48;
const STORAGE_KEY = 'worldtime:locations';
const fallbackLocations = ['Europe/London', 'America/New_York', 'Asia/Tokyo', 'Australia/Sydney'];
const searchAliases: Record<string, string> = {
	'Asia/Calcutta': 'Kolkata India',
	'Asia/Katmandu': 'Kathmandu Nepal',
	'Europe/Kiev': 'Kyiv Ukraine',
};

const unique = (zones: string[]) => [...new Set(zones)];
type ThemePreference = 'light' | 'dark' | 'system';

const resolveTheme = (preference: ThemePreference) => {
	if (preference !== 'system') return preference;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export default function TimeCanvas({ initialNow }: Props) {
	const [now, setNow] = useState(initialNow);
	const [dayOffset, setDayOffset] = useState(0);
	const [locations, setLocations] = useState(fallbackLocations);
	const [query, setQuery] = useState('');
	const [hour12, setHour12] = useState(false);
	const [selectedTime, setSelectedTime] = useState(Math.ceil(initialNow / HOUR) * HOUR);
	const [durationMinutes, setDurationMinutes] = useState(60);
	const [themePreference, setThemePreference] = useState<ThemePreference>('system');
	const [themeReady, setThemeReady] = useState(false);
	const [copied, setCopied] = useState(false);
	const [dragging, setDragging] = useState(false);
	const timelineRef = useRef<HTMLDivElement>(null);
	const drag = useRef({ pointerId: 0, startX: 0, startScroll: 0 });

	const zoneOptions = useMemo(() => getTimeZoneOptions(), []);
	const baseStart = Math.floor(initialNow / HOUR) * HOUR - 6 * HOUR;
	const timelineStart = baseStart + dayOffset * 24 * HOUR;
	const timestamps = useMemo(
		() => Array.from({ length: HOURS_VISIBLE }, (_, index) => timelineStart + index * HOUR),
		[timelineStart],
	);
	const homeZone = locations[0] ?? 'UTC';
	const meetingEnd = selectedTime + durationMinutes * 60_000;
	const meetingScore = useMemo(
		() => getMeetingScore(selectedTime, durationMinutes, locations),
		[selectedTime, durationMinutes, locations],
	);
	const bestRangeStart = dayOffset === 0
		? Math.max(timelineStart, Math.ceil(now / (30 * 60_000)) * 30 * 60_000)
		: timelineStart;
	const bestMeeting = useMemo(
		() => findBestMeetingStart(bestRangeStart, timelineStart + HOURS_VISIBLE * HOUR, durationMinutes, locations),
		[bestRangeStart, timelineStart, durationMinutes, locations],
	);

	const suggestions = useMemo(() => {
		const needle = query.trim().toLocaleLowerCase();
		if (needle.length < 2) return [];

		return zoneOptions
			.filter(
				(zone) => {
					const searchText = `${zone.label} ${zone.id} ${searchAliases[zone.id] ?? ''}`.toLocaleLowerCase();
					return !locations.includes(zone.id) && searchText.includes(needle);
				},
			)
			.slice(0, 7);
	}, [locations, query, zoneOptions]);

	useEffect(() => {
		const interval = window.setInterval(() => setNow(Date.now()), 30_000);
		const saved = window.localStorage.getItem(STORAGE_KEY);
		const savedTheme = window.localStorage.getItem('worldtime:theme');
		if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
			setThemePreference(savedTheme);
		}
		setThemeReady(true);

		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.every((zone) => typeof zone === 'string')) {
					setLocations(parsed);
				}
			} catch {
				window.localStorage.removeItem(STORAGE_KEY);
			}
		} else {
			const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
			setLocations(unique([detected, ...fallbackLocations]));
		}

		window.requestAnimationFrame(() => {
			if (timelineRef.current) timelineRef.current.scrollLeft = CELL_WIDTH * 4.5;
		});

		return () => window.clearInterval(interval);
	}, []);

	useEffect(() => {
		if (!themeReady) return;
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const apply = () => {
			document.documentElement.dataset.theme = resolveTheme(themePreference);
			document.documentElement.dataset.themePreference = themePreference;
		};
		apply();
		window.localStorage.setItem('worldtime:theme', themePreference);
		media.addEventListener('change', apply);
		return () => media.removeEventListener('change', apply);
	}, [themePreference, themeReady]);

	useEffect(() => {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
	}, [locations]);

	useEffect(() => {
		setSelectedTime(Math.ceil((timelineStart + 6 * HOUR) / HOUR) * HOUR);
		if (timelineRef.current) timelineRef.current.scrollTo({ left: CELL_WIDTH * 4.5, behavior: 'smooth' });
	}, [timelineStart]);

	const addLocation = (zone: string) => {
		setLocations((current) => [...current, zone]);
		setQuery('');
	};

	const removeLocation = (zone: string) => {
		setLocations((current) => current.filter((location) => location !== zone));
	};

	const chooseBestMeeting = () => {
		setSelectedTime(bestMeeting.timestamp);
		if (timelineRef.current) {
			const left = ((bestMeeting.timestamp - timelineStart) / HOUR) * CELL_WIDTH;
			timelineRef.current.scrollTo({ left: Math.max(0, left - CELL_WIDTH * 2), behavior: 'smooth' });
		}
	};

	const copyMeeting = async () => {
		const lines = locations.map((zone) => {
			const city = zoneOption(zone).city;
			return `${city}: ${formatDate(selectedTime, zone)}, ${formatClock(selectedTime, zone, hour12)}–${formatClock(meetingEnd, zone, hour12)}`;
		});
		try {
			await navigator.clipboard.writeText(`Meeting time\n${lines.join('\n')}`);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} catch {
			setCopied(false);
		}
	};

	const handlePointerDown = (event: PointerEvent) => {
		if (event.pointerType !== 'mouse' || event.button !== 0) return;
		const target = event.currentTarget as HTMLDivElement;
		drag.current = {
			pointerId: event.pointerId,
			startX: event.clientX,
			startScroll: target.scrollLeft,
		};
		target.setPointerCapture(event.pointerId);
		setDragging(true);
	};

	const handlePointerMove = (event: PointerEvent) => {
		if (!dragging || event.pointerId !== drag.current.pointerId) return;
		const target = event.currentTarget as HTMLDivElement;
		target.scrollLeft = drag.current.startScroll - (event.clientX - drag.current.startX);
	};

	const stopDragging = (event: PointerEvent) => {
		if (event.pointerId === drag.current.pointerId) setDragging(false);
	};

	const nowPosition = ((now - timelineStart) / HOUR) * CELL_WIDTH;
	const nowIsVisible = nowPosition >= 0 && nowPosition <= HOURS_VISIBLE * CELL_WIDTH;
	const selectedPosition = ((selectedTime - timelineStart) / HOUR) * CELL_WIDTH;
	const selectionWidth = (durationMinutes / 60) * CELL_WIDTH;
	const scoreLabel = meetingScore >= 90 ? 'Excellent' : meetingScore >= 70 ? 'Strong' : meetingScore >= 50 ? 'Workable' : 'Difficult';

	return (
		<section class="overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-surface)]/95 shadow-2xl shadow-black/20 backdrop-blur-xl">
			<div class="border-b border-[var(--color-line)] p-4 sm:p-6">
				<div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
					<div class="relative max-w-xl flex-1">
						<label class="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300" for="zone-search">
							Add a place or time zone
						</label>
						<div class="flex items-center rounded-full border border-[var(--color-line)] bg-[var(--color-input)] px-4 transition focus-within:border-cyan-300/70 focus-within:ring-4 focus-within:ring-cyan-300/10">
							<span aria-hidden="true" class="mr-3 text-cyan-300">⌕</span>
							<input
								id="zone-search"
								value={query}
								onInput={(event) => setQuery(event.currentTarget.value)}
								placeholder="Try Kathmandu, Chicago, Pacific…"
								autocomplete="off"
								class="h-12 w-full bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-subtle)]"
							/>
						</div>
						{suggestions.length > 0 && (
							<div class="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-1.5 shadow-2xl">
								{suggestions.map((zone) => (
									<button
										type="button"
										onClick={() => addLocation(zone.id)}
										class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-cyan-300/10 focus:bg-cyan-300/10 focus:outline-none"
									>
										<span class="text-sm font-medium text-[var(--color-ink)]">{zone.city}</span>
										<span class="ml-4 truncate font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">{zone.region}</span>
									</button>
								))}
							</div>
						)}
					</div>

					<div class="flex flex-wrap items-center gap-2">
						<div class="flex rounded-full border border-[var(--color-line)] bg-[var(--color-input)] p-1">
							<button type="button" aria-label="Previous day" onClick={() => setDayOffset((value) => value - 1)} class="grid size-9 place-items-center rounded-full text-[var(--color-muted)] transition hover:bg-cyan-300/10 hover:text-[var(--color-ink)]">←</button>
							<button type="button" onClick={() => setDayOffset(0)} class="rounded-full px-3 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-200 transition hover:bg-white/10">Today</button>
							<button type="button" aria-label="Next day" onClick={() => setDayOffset((value) => value + 1)} class="grid size-9 place-items-center rounded-full text-[var(--color-muted)] transition hover:bg-cyan-300/10 hover:text-[var(--color-ink)]">→</button>
						</div>
						<button
							type="button"
							onClick={() => setHour12((value) => !value)}
							class="h-11 rounded-full border border-[var(--color-line)] bg-[var(--color-input)] px-4 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] transition hover:border-cyan-300/40 hover:text-[var(--color-ink)]"
						>
							{hour12 ? '12 hour' : '24 hour'}
						</button>
					</div>
				</div>

				<div class="mt-5 flex flex-col gap-3 border-t border-[var(--color-line)] pt-5 lg:flex-row lg:items-center lg:justify-between">
					<div class="flex flex-wrap items-center gap-2">
						<span class="mr-1 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--color-subtle)]">Meeting length</span>
						{[30, 60, 90, 120].map((minutes) => (
							<button
								type="button"
								onClick={() => setDurationMinutes(minutes)}
								aria-pressed={durationMinutes === minutes}
								class={`rounded-full border px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-wider transition ${durationMinutes === minutes ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-[var(--color-line)] text-[var(--color-muted)] hover:border-cyan-400/50'}`}
							>
								{minutes < 60 ? `${minutes} min` : `${minutes / 60} hr`}
							</button>
						))}
						<button type="button" onClick={chooseBestMeeting} class="ml-1 rounded-full border border-amber-400/40 bg-amber-300/10 px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--color-warm)] transition hover:bg-amber-300/20">
							Best overlap · {bestMeeting.score}%
						</button>
					</div>

					<div class="flex items-center gap-2">
						<span class="mr-1 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--color-subtle)]">Appearance</span>
						<div class="flex rounded-full border border-[var(--color-line)] bg-[var(--color-input)] p-1">
							{(['light', 'dark', 'system'] as ThemePreference[]).map((preference) => (
								<button
									type="button"
									onClick={() => setThemePreference(preference)}
									aria-pressed={themePreference === preference}
									class={`rounded-full px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-wider transition ${themePreference === preference ? 'bg-[var(--color-ink)] text-[var(--color-canvas)]' : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'}`}
								>
									{preference}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-[9rem_1fr] sm:grid-cols-[14rem_1fr]">
				<div class="relative z-20 border-r border-[var(--color-line)] bg-[var(--color-surface)]">
					<div class="flex h-16 items-end border-b border-[var(--color-line)] px-4 pb-3 sm:px-5">
						<p class="font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--color-subtle)]">Place / live offset</p>
					</div>
					{locations.map((zone, index) => {
						const option = zoneOption(zone);
						const local = getLocalParts(now, zone);
						return (
							<div class="group flex h-24 items-center justify-between border-b border-[var(--color-line)] px-3 sm:px-5">
								<div class="min-w-0">
									<div class="flex items-baseline gap-2">
										<p class="truncate text-sm font-semibold text-[var(--color-ink)] sm:text-base">{option.city}</p>
										{index === 0 && <span class="hidden font-mono text-[8px] uppercase tracking-widest text-cyan-300 sm:inline">Home</span>}
									</div>
									<p class="mt-1 font-mono text-[10px] text-[var(--color-muted)]">{formatClock(now, zone, hour12)} · {local.abbreviation}</p>
									<p class="mt-1 font-mono text-[9px] text-[var(--color-subtle)]">{getDayPhase(now, zone)} · {formatOffset(getOffsetMinutes(now, zone))}</p>
								</div>
								{locations.length > 1 && (
									<button type="button" aria-label={`Remove ${option.city}`} onClick={() => removeLocation(zone)} class="ml-1 grid size-7 shrink-0 place-items-center rounded-full text-slate-600 opacity-100 transition hover:bg-rose-400/10 hover:text-rose-300 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100">×</button>
								)}
							</div>
						);
					})}
				</div>

				<div
					ref={timelineRef}
					onPointerDown={handlePointerDown}
					onPointerMove={handlePointerMove}
					onPointerUp={stopDragging}
					onPointerCancel={stopDragging}
					class={`relative overflow-x-auto overscroll-x-contain ${dragging ? 'cursor-grabbing select-none' : 'cursor-grab'} [scrollbar-color:rgba(103,232,249,.35)_transparent] [scrollbar-width:thin]`}
				>
					<div class="relative" style={{ width: `${HOURS_VISIBLE * CELL_WIDTH}px` }}>
						<div class="grid h-16 border-b border-[var(--color-line)]" style={{ gridTemplateColumns: `repeat(${HOURS_VISIBLE}, ${CELL_WIDTH}px)` }}>
							{timestamps.map((timestamp) => {
								const parts = getLocalParts(timestamp, homeZone);
								return (
									<div class="flex flex-col justify-end border-r border-[var(--color-line)] px-2 pb-2">
										{parts.hour === 0 || timestamp === timestamps[0] ? (
											<span class="font-mono text-[9px] font-bold uppercase tracking-wider text-amber-200">{parts.weekday} {parts.day}</span>
										) : <span class="h-3" />}
										<span class="mt-1 font-mono text-[9px] text-[var(--color-subtle)]">{formatClock(timestamp, homeZone, hour12)}</span>
									</div>
								);
							})}
						</div>

						{locations.map((zone) => (
							<div class="grid h-24 border-b border-[var(--color-line)]" style={{ gridTemplateColumns: `repeat(${HOURS_VISIBLE}, ${CELL_WIDTH}px)` }}>
								{timestamps.map((timestamp) => {
									const parts = getLocalParts(timestamp, zone);
									const isNight = parts.hour < 7 || parts.hour >= 20;
									const isWork = parts.hour >= 9 && parts.hour < 17;
									const selected = selectedTime >= timestamp && selectedTime < timestamp + HOUR;
									return (
										<button
											type="button"
											onClick={() => setSelectedTime(timestamp)}
											aria-label={`${formatFullDate(timestamp, zone)} at ${formatClock(timestamp, zone, hour12)} in ${zoneOption(zone).city}`}
											class={`relative flex flex-col items-center justify-center border-r border-[var(--color-line)] transition focus:z-20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-300 ${isNight ? 'bg-[var(--color-night-cell)]' : 'bg-[var(--color-day-cell)]'} ${isWork ? 'after:absolute after:inset-x-2 after:bottom-2 after:h-0.5 after:rounded-full after:bg-amber-400/60' : ''} ${selected ? 'text-cyan-500' : 'text-[var(--color-muted)] hover:brightness-110'}`}
										>
											<span class="font-mono text-sm font-semibold">{formatClock(timestamp, zone, hour12).replace(':00', '')}</span>
											{parts.hour === 0 && <span class="mt-1 font-mono text-[8px] uppercase tracking-wider text-amber-200/80">{parts.month} {parts.day}</span>}
										</button>
									);
								})}
							</div>
						))}

						{nowIsVisible && (
							<div aria-hidden="true" class="pointer-events-none absolute inset-y-0 z-30 w-px bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,.8)]" style={{ left: `${nowPosition}px` }}>
								<span class="absolute left-1 top-1.5 rounded-full bg-cyan-300 px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wider text-slate-950">Now</span>
							</div>
						)}
						<div aria-hidden="true" class="pointer-events-none absolute bottom-0 top-16 z-20 border-x border-cyan-400/50 bg-cyan-300/10" style={{ left: `${selectedPosition}px`, width: `${selectionWidth}px` }} />
					</div>
				</div>
			</div>

			<div class="grid gap-6 border-t border-[var(--color-line)] bg-[var(--color-input)] p-5 lg:grid-cols-[0.9fr_2fr] lg:p-7">
				<div>
					<div class="flex items-center gap-2">
						<p class="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-cyan-500">Meeting window</p>
						<span class={`rounded-full px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wider ${meetingScore >= 70 ? 'bg-emerald-400/15 text-emerald-500' : meetingScore >= 50 ? 'bg-amber-400/15 text-amber-500' : 'bg-rose-400/15 text-rose-500'}`}>
							{scoreLabel} · {meetingScore}%
						</span>
					</div>
					<p class="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">{formatClock(selectedTime, homeZone, hour12)}–{formatClock(meetingEnd, homeZone, hour12)}</p>
					<p class="mt-1 text-sm text-[var(--color-muted)]">{formatFullDate(selectedTime, homeZone)}</p>
					<button type="button" onClick={copyMeeting} class="mt-4 rounded-full border border-[var(--color-line)] px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted)] transition hover:border-cyan-400/50 hover:text-cyan-500">
						{copied ? 'Copied' : 'Copy all times'}
					</button>
				</div>
				<div class="grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-4" aria-live="polite">
					{locations.map((zone) => (
						<div class="border-l border-[var(--color-line)] pl-3">
							<div class="flex items-center justify-between gap-2">
								<p class="truncate text-xs text-[var(--color-subtle)]">{zoneOption(zone).city}</p>
								<p class="font-mono text-[8px] uppercase tracking-wider text-amber-500">{getDayPhase(selectedTime, zone)}</p>
							</div>
							<p class="mt-1 font-mono text-sm text-[var(--color-ink)]">{formatClock(selectedTime, zone, hour12)}–{formatClock(meetingEnd, zone, hour12)}</p>
							<p class="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-subtle)]">{formatDate(selectedTime, zone)} · {getDayRelation(selectedTime, zone, homeZone)}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
