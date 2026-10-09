import type { APIRoute } from 'astro';
import { cities, converterPairs, type City } from '../../../lib/cities';
import { converterSocialCard } from '../../../lib/social-card';

interface Props { from: City; to: City }

export function getStaticPaths() {
	return converterPairs.map((pair) => ({
		params: { slug: `${pair.from}-to-${pair.to}` },
		props: {
			from: cities.find((city) => city.slug === pair.from)!,
			to: cities.find((city) => city.slug === pair.to)!,
		},
	}));
}

export const GET: APIRoute = ({ props }) => {
	const { from, to } = props as Props;
	return new Response(converterSocialCard(from, to), {
		headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
	});
};
