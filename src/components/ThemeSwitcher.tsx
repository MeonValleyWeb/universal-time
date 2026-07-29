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

export default function ThemeSwitcher() {
	const [preference, setPreference] = useState<ThemePreference>('auto');
	const [open, setOpen] = useState(false);

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
					<span aria-hidden="true">◐</span>
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
