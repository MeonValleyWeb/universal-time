import type { APIRoute } from 'astro';
import { plannerSocialCard } from '../../lib/social-card';

export const prerender = true;

export const GET: APIRoute = () => new Response(plannerSocialCard(), {
	headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
});
