import { useEffect, useState } from 'preact/hooks';

type ThemePreference = 'auto' | 'paper' | 'dark';

const themeFor = (preference: ThemePreference) => {
	if (preference !== 'auto') return preference;
	const hour = new Date().getHours();
	return hour >= 7 && hour < 19 ? 'paper' : 'dark';
};

const applyTheme = (preference: ThemePreference) => {
	document.documentElement.dataset.theme = themeFor(preference);
	document.documentElement.dataset.themePreference = preference;
};

function AnalogClock({
	now,
	className = 'size-6',
	showSeconds = true,
}: {
	now: Date;
	className?: string;
	showSeconds?: boolean;
}) {
	const seconds = showSeconds ? now.getSeconds() : 0;
	const minutes = now.getMinutes() + seconds / 60;
	const hours = (now.getHours() % 12) + minutes / 60;

	return (
		<svg viewBox="0 0 24 24" class={className} aria-hidden="true">
			<circle cx="12" cy="12" r="9.25" fill="none" stroke="currentColor" stroke-width="1.25" />
			{[0, 3, 6, 9].map((hour) => (
				<line
					key={hour}
					x1="12"
					y1="3.8"
					x2="12"
					y2="5"
					stroke="currentColor"
					stroke-width="1"
					transform={`rotate(${hour * 30} 12 12)`}
				/>
			))}
			<line
				x1="12"
				y1="12"
				x2="12"
				y2="7.2"
				stroke="currentColor"
				stroke-width="1.7"
				stroke-linecap="round"
				transform={`rotate(${hours * 30} 12 12)`}
			/>
			<line
				x1="12"
				y1="12"
				x2="12"
				y2="5.4"
				stroke="currentColor"
				stroke-width="1.15"
				stroke-linecap="round"
				transform={`rotate(${minutes * 6} 12 12)`}
			/>
			{showSeconds && (
				<line
					x1="12"
					y1="13.5"
					x2="12"
					y2="4.8"
					class="text-[var(--color-signal)]"
					stroke="currentColor"
					stroke-width="0.8"
					stroke-linecap="round"
					transform={`rotate(${seconds * 6} 12 12)`}
				/>
			)}
			<circle cx="12" cy="12" r="1" class="fill-[var(--color-signal)]" />
		</svg>
	);
}

export default function ThemeSwitcher() {
	const [preference, setPreference] = useState<ThemePreference>('auto');
	const [open, setOpen] = useState(false);
	const [now, setNow] = useState(() => new Date());
	const [reducedMotion, setReducedMotion] = useState(false);

	useEffect(() => {
		const saved = window.localStorage.getItem('worldtime:theme');
		const initial = saved === 'paper' || saved === 'dark' || saved === 'auto' ? saved : 'auto';
		setPreference(initial);
		applyTheme(initial);
		const interval = window.setInterval(() => {
			if (initial === 'auto') applyTheme('auto');
		}, 60_000);
		return () => window.clearInterval(interval);
	}, []);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updatePreference = () => setReducedMotion(mediaQuery.matches);
		updatePreference();
		mediaQuery.addEventListener('change', updatePreference);
		return () => mediaQuery.removeEventListener('change', updatePreference);
	}, []);

	useEffect(() => {
		const interval = window.setInterval(() => setNow(new Date()), reducedMotion ? 60_000 : 1_000);
		return () => window.clearInterval(interval);
	}, [reducedMotion]);

	const choose = (next: ThemePreference) => {
		setPreference(next);
		setOpen(false);
		window.localStorage.setItem('worldtime:theme', next);
		applyTheme(next);
	};

	return (
		<>
			<div class="fixed bottom-3 right-3 z-[100] sm:hidden">
				<button
					type="button"
					onClick={() => setOpen((current) => !current)}
					aria-expanded={open}
					aria-controls="mobile-theme-options"
					aria-label={`Choose colour theme. Current setting: ${preference}`}
					class="grid size-11 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface-elevated)] text-lg text-[var(--color-ink)] shadow-lg backdrop-blur active:scale-95"
				>
					<AnalogClock now={now} showSeconds={!reducedMotion} />
				</button>
				{open && (
					<div
						id="mobile-theme-options"
						class="absolute bottom-14 right-0 flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-1 shadow-lg"
						aria-label="Colour theme"
					>
						{(['auto', 'paper', 'dark'] as ThemePreference[]).map((option) => (
							<button
								type="button"
								onClick={() => choose(option)}
								aria-pressed={preference === option}
								class={`whitespace-nowrap rounded-full px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.1em] ${
									preference === option
										? 'bg-[var(--color-ink)] text-[var(--color-canvas)]'
										: 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
								}`}
								title={option === 'auto' ? 'Follow local day and night' : `Use ${option} theme`}
							>
								{option === 'auto' ? 'Auto · local' : option}
							</button>
						))}
					</div>
				)}
			</div>

			<div
				class="fixed bottom-4 right-4 z-[100] hidden items-center gap-1 rounded-full border border-[var(--color-line)] bg-[var(--color-surface-elevated)]/95 p-1 shadow-lg backdrop-blur sm:flex"
				aria-label="Colour theme"
			>
				<time
					datetime={now.toISOString()}
					class="ml-1 grid size-8 place-items-center text-[var(--color-ink)]"
					title={`Local time ${now.toLocaleTimeString()}`}
				>
					<span class="sr-only">Local time {now.toLocaleTimeString()}</span>
					<AnalogClock now={now} className="size-5" showSeconds={!reducedMotion} />
				</time>
				{(['auto', 'paper', 'dark'] as ThemePreference[]).map((option) => (
					<button
						type="button"
						onClick={() => choose(option)}
						aria-pressed={preference === option}
						class={`rounded-full px-3 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.12em] transition ${
							preference === option
								? 'bg-[var(--color-ink)] text-[var(--color-canvas)]'
								: 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
						}`}
						title={option === 'auto' ? 'Follow local day and night' : `Use ${option} theme`}
					>
						{option}
					</button>
				))}
			</div>
		</>
	);
}
