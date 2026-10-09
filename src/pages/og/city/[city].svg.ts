import type { APIRoute } from 'astro';
import { cities, type City } from '../../../lib/cities';
import { citySocialCard } from '../../../lib/social-card';

export function getStaticPaths() {
	return cities.map((city) => ({ params: { city: city.slug }, props: { city } }));
}

export const GET: APIRoute = ({ props }) => new Response(citySocialCard(props.city as City), {
	headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
});
