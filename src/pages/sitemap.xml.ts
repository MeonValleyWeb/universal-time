import type { APIRoute } from 'astro';
import { cities, converterPairs } from '../lib/cities';
import { timeGuides } from '../lib/guides';

export const prerender = true;

const escapeXml = (value: string) =>
	value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export const GET: APIRoute = ({ site, url }) => {
	const base = site ?? new URL(url.origin);
	const paths = [
		{ path: '/', priority: '1.0', frequency: 'daily' },
		{ path: '/meeting-planner', priority: '0.8', frequency: 'weekly' },
		{ path: '/time-zones', priority: '0.8', frequency: 'daily' },
		{ path: '/astronomy', priority: '0.8', frequency: 'daily' },
		{ path: '/guides', priority: '0.8', frequency: 'weekly' },
		{ path: '/privacy', priority: '0.3', frequency: 'yearly' },
		...timeGuides.map((guide) => ({
			path: `/guides/${guide.slug}`,
			priority: '0.7',
			frequency: 'monthly',
		})),
		...cities.map((city) => ({ path: `/time/${city.slug}`, priority: '0.8', frequency: 'daily' })),
		...converterPairs.map((pair) => ({
			path: `/convert/${pair.from}/${pair.to}`,
			priority: '0.7',
			frequency: 'weekly',
		})),
	];

	const entries = paths.map(({ path, priority, frequency }) => [
		'<url>',
		`<loc>${escapeXml(new URL(path, base).toString())}</loc>`,
		`<changefreq>${frequency}</changefreq>`,
		`<priority>${priority}</priority>`,
		'</url>',
	].join('')).join('');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`,
		{ headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
	);
};
