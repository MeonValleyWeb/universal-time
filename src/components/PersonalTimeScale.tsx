import { useMemo, useState } from 'preact/hooks';
import { ageOn, isRealCalendarDate } from '../lib/newsletter';

const DAY_MS = 86_400_000;
const ILLUSTRATIVE_YEARS = 80;

type FormState = 'idle' | 'sending' | 'success' | 'error';

const number = new Intl.NumberFormat('en-GB');
const decimal = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1 });

const calculateLife = (birthDate: string) => {
	if (!isRealCalendarDate(birthDate)) return null;
	const [year, month, day] = birthDate.split('-').map(Number);
	const born = Date.UTC(year, month - 1, day);
	const now = Date.now();
	if (born > now || ageOn(birthDate) > 120) return null;
	const yardstick = Date.UTC(year + ILLUSTRATIVE_YEARS, month - 1, day);
	const daysLived = Math.max(0, Math.floor((now - born) / DAY_MS));
	const daysToYardstick = Math.max(0, Math.ceil((yardstick - now) / DAY_MS));
	const progress = Math.min(100, Math.max(0, ((now - born) / (yardstick - born)) * 100));
	return {
		daysLived,
		weeksLived: Math.floor(daysLived / 7),
		moons: Math.floor(daysLived / 29.53059),
		orbits: decimal.format(daysLived / 365.2422),
		daysToYardstick,
		progress,
	};
};

export default function PersonalTimeScale() {
	const [birthDate, setBirthDate] = useState('');
	const [email, setEmail] = useState('');
	const [consent, setConsent] = useState(false);
	const [website, setWebsite] = useState('');
	const [state, setState] = useState<FormState>('idle');
	const [message, setMessage] = useState('');
	const life = useMemo(() => calculateLife(birthDate), [birthDate]);

	const subscribe = async (event: Event) => {
		event.preventDefault();
		setState('sending');
		setMessage('');
		try {
			const response = await fetch('/api/newsletter', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ email, birthDate, consent, website }),
			});
			const result = await response.json() as { message?: string; error?: string };
			if (!response.ok) throw new Error(result.error || 'The subscription could not be saved.');
			setState('success');
			setMessage(result.message || 'You are on the list.');
		} catch (error) {
			setState('error');
			setMessage(error instanceof Error ? error.message : 'The subscription could not be saved.');
		}
	};

	return (
		<section class="border-b border-[var(--color-line)] bg-[var(--color-ink)] px-5 py-16 text-[var(--color-canvas)] sm:px-8 lg:py-24">
			<div class="mx-auto max-w-[1500px]">
				<div class="grid gap-12 xl:grid-cols-[0.8fr_1.2fr] xl:gap-20">
					<div>
						<p class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-signal)]">Your place on the absurdly long timeline</p>
						<h2 class="mt-5 max-w-2xl font-serif text-5xl leading-[0.9] tracking-[-0.055em] sm:text-7xl">
							So, how much time have you got?
						</h2>
						<p class="mt-6 max-w-xl text-base leading-7 text-[var(--color-subtle)]">
							We cannot predict your lifespan. Frankly, neither can the internet. But we can show the time you have lived and use an 80th birthday as a clearly labelled measuring stick.
						</p>

						<div class="mt-10">
							<label for="life-birth-date" class="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-subtle)]">Your date of birth</label>
							<input
								id="life-birth-date"
								type="date"
								value={birthDate}
								onInput={(event) => {
									setBirthDate(event.currentTarget.value);
									setState('idle');
								}}
								class="mt-3 block w-full max-w-sm border-b border-[var(--color-line)] bg-transparent py-3 font-serif text-3xl text-[var(--color-canvas)] outline-none focus:border-[var(--color-signal)]"
							/>
						</div>

						{life ? (
							<div class="mt-10" aria-live="polite">
								<div class="flex items-end justify-between gap-4">
									<p class="font-serif text-3xl">{decimal.format(life.progress)}%</p>
									<p class="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-subtle)]">of the 80-year yardstick</p>
								</div>
								<div class="mt-3 h-3 overflow-hidden rounded-full bg-[var(--color-surface)]">
									<div class="h-full rounded-full bg-[var(--color-signal)] transition-[width] duration-700" style={{ width: `${life.progress}%` }} />
								</div>
								<div class="mt-6 grid gap-px bg-[var(--color-line)] sm:grid-cols-3">
									<div class="bg-[var(--color-ink)] p-5">
										<p class="font-serif text-3xl">{number.format(life.daysLived)}</p>
										<p class="mt-2 font-mono text-[9px] uppercase tracking-wider text-[var(--color-subtle)]">days lived</p>
									</div>
									<div class="bg-[var(--color-ink)] p-5">
										<p class="font-serif text-3xl">{life.orbits}</p>
										<p class="mt-2 font-mono text-[9px] uppercase tracking-wider text-[var(--color-subtle)]">orbits of the Sun</p>
									</div>
									<div class="bg-[var(--color-ink)] p-5">
										<p class="font-serif text-3xl">{number.format(life.daysToYardstick)}</p>
										<p class="mt-2 font-mono text-[9px] uppercase tracking-wider text-[var(--color-subtle)]">days to 80*</p>
									</div>
								</div>
								<p class="mt-3 text-xs leading-5 text-[var(--color-subtle)]">
									* A playful yardstick, not a forecast, diagnosis or appointment with the Grim Reaper.
								</p>
							</div>
						) : birthDate ? (
							<p class="mt-5 text-sm text-[var(--color-signal)]">That date appears to have fallen out of the calendar.</p>
						) : null}
					</div>

					<div class="grid content-start gap-px bg-[var(--color-line)] sm:grid-cols-2">
						<article class="bg-[var(--color-surface)] p-6 text-[var(--color-ink)] sm:p-8">
							<p class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-signal)]">One second</p>
							<p class="mt-14 font-serif text-4xl">9,192,631,770</p>
							<p class="mt-3 text-sm leading-6 text-[var(--color-muted)]">Oscillations of caesium-133. A second is surprisingly busy.</p>
						</article>
						<article class="bg-[var(--color-surface)] p-6 text-[var(--color-ink)] sm:p-8">
							<p class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-signal)]">Your scale</p>
							<p class="mt-14 font-serif text-4xl">{life ? number.format(life.weeksLived) : '—'}</p>
							<p class="mt-3 text-sm leading-6 text-[var(--color-muted)]">Weeks so far. Enough Mondays to deserve some credit.</p>
						</article>
						<article class="bg-[var(--color-surface)] p-6 text-[var(--color-ink)] sm:p-8">
							<p class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-signal)]">About 5 billion years</p>
							<p class="mt-14 font-serif text-4xl">Red giant</p>
							<p class="mt-3 text-sm leading-6 text-[var(--color-muted)]">
								The Sun will expand into a red giant. It will not explode as a supernova; it lacks the mass for that particular drama.
							</p>
						</article>
						<article class="bg-[var(--color-surface)] p-6 text-[var(--color-ink)] sm:p-8">
							<p class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-signal)]">After that</p>
							<p class="mt-14 font-serif text-4xl">White dwarf</p>
							<p class="mt-3 text-sm leading-6 text-[var(--color-muted)]">
								The remnant will cool for an almost unreasonable length of time. Your calendar should be clear.
							</p>
						</article>

						<form onSubmit={subscribe} class="bg-[var(--color-canvas)] p-6 text-[var(--color-ink)] sm:col-span-2 sm:p-8">
							<p class="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-signal)]">On this day…</p>
							<h3 class="mt-4 font-serif text-4xl tracking-[-0.04em]">Make your date mean something.</h3>
							<p class="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
								Join the future newsletter for remarkable events, celestial anniversaries and odd fragments of time connected to your date. No daily avalanche.
							</p>
							<div class="mt-7 grid gap-5 sm:grid-cols-2">
								<div>
									<label for="newsletter-email" class="font-mono text-[9px] uppercase tracking-wider text-[var(--color-subtle)]">Email address</label>
									<input
										id="newsletter-email"
										type="email"
										required
										autocomplete="email"
										value={email}
										onInput={(event) => setEmail(event.currentTarget.value)}
										class="mt-2 w-full border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-signal)]"
										placeholder="you@example.com"
									/>
								</div>
								<div>
									<label for="newsletter-birth-date" class="font-mono text-[9px] uppercase tracking-wider text-[var(--color-subtle)]">Date of birth</label>
									<input
										id="newsletter-birth-date"
										type="date"
										required
										value={birthDate}
										onInput={(event) => setBirthDate(event.currentTarget.value)}
										class="mt-2 w-full border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-signal)]"
									/>
								</div>
							</div>
							<div class="pointer-events-none absolute -left-[10000px]" aria-hidden="true">
								<label for="newsletter-website">Website</label>
								<input id="newsletter-website" tabindex={-1} autocomplete="off" value={website} onInput={(event) => setWebsite(event.currentTarget.value)} />
							</div>
							<label class="mt-6 flex items-start gap-3 text-sm leading-6 text-[var(--color-muted)]">
								<input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.currentTarget.checked)} class="mt-1 accent-[var(--color-signal)]" />
								<span>I am 18 or over and agree to receive the “On this day…” newsletter. I can unsubscribe at any time. Read the <a href="/privacy#newsletter" class="text-[var(--color-signal)] hover:underline">privacy details</a>.</span>
							</label>
							<div class="mt-6 flex flex-wrap items-center gap-4">
								<button disabled={state === 'sending'} class="rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-medium text-[var(--color-canvas)] hover:bg-[var(--color-signal)] disabled:opacity-50">
									{state === 'sending' ? 'Saving your place…' : 'Join the timeline →'}
								</button>
								<p aria-live="polite" class={`text-sm ${state === 'error' ? 'text-red-700' : 'text-[var(--color-muted)]'}`}>{message}</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
