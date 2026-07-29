import type { APIRoute } from 'astro';
import { cities, popularConverterSlugs } from '../lib/cities';

export const prerender = true;

const escapeXml = (value: string) =>
	value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export const GET: APIRoute = ({ site, url }) => {
	const base = site ?? new URL(url.origin);
	const popular = cities.filter((city) => popularConverterSlugs.includes(city.slug));
	const paths = [
		{ path: '/', priority: '1.0', frequency: 'daily' },
		{ path: '/meeting-planner', priority: '0.8', frequency: 'weekly' },
		...cities.map((city) => ({ path: `/time/${city.slug}`, priority: '0.8', frequency: 'daily' })),
		...popular.flatMap((from) =>
			popular
				.filter((to) => to.slug !== from.slug)
				.map((to) => ({ path: `/convert/${from.slug}/${to.slug}`, priority: '0.7', frequency: 'weekly' }))
		),
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
