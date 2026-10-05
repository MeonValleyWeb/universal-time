import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site, url }) => {
	const base = site ?? new URL(url.origin);
	const body = [
		'User-agent: *',
		'Allow: /',
		'Content-Signal: ai-train=no, search=yes, ai-input=yes',
		'',
		`Sitemap: ${new URL('/sitemap.xml', base)}`,
		`Agentmap: ${new URL('/.well-known/ai-catalog.json', base)}`,
		'',
	].join('\n');

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
