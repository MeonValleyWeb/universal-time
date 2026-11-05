import { useEffect, useState } from 'preact/hooks';

/** The server and first hydration render never expose a build-time clock. */
export const useCurrentTime = (interval = 30_000) => {
	const [now, setNow] = useState<number | null>(null);
	useEffect(() => {
		const refresh = () => setNow(Date.now());
		refresh();
		const timer = window.setInterval(refresh, interval);
		window.addEventListener('focus', refresh);
		document.addEventListener('visibilitychange', refresh);
		return () => {
			window.clearInterval(timer);
			window.removeEventListener('focus', refresh);
			document.removeEventListener('visibilitychange', refresh);
		};
	}, [interval]);
	return now;
};
