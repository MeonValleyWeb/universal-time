import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = () => {
	const clientId = import.meta.env.PUBLIC_ADSENSE_CLIENT?.trim() ?? '';
	const publisherId = clientId.replace(/^ca-/, '');
	const body = /^pub-\d+$/.test(publisherId)
		? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
		: '# AdSense publisher ID is not configured yet.\n';

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
