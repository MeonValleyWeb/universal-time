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
		window.localStorage.setItem('worldtime:theme', next);
		applyTheme(next);
	};

	return (
		<div
			class="fixed bottom-4 right-4 z-[100] flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-[var(--color-surface-elevated)]/95 p-1 shadow-lg backdrop-blur"
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
					title={option === 'auto' ? 'Use paper by day and dark after 7pm' : `Use ${option} theme`}
				>
					{option}
				</button>
			))}
		</div>
	);
}
