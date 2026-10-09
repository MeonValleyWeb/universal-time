import type { APIRoute } from 'astro';
import { homepageSocialCard } from '../../lib/social-card';

export const prerender = true;

export const GET: APIRoute = () => new Response(homepageSocialCard(), {
	headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
});
