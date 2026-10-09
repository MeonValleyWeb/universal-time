import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { cities, converterPairs } from '../src/lib/cities.ts';
import {
	citySocialCard,
	converterSocialCard,
	homepageSocialCard,
	plannerSocialCard,
} from '../src/lib/social-card.ts';

const output = join(process.cwd(), 'public', 'og');

const writeCard = async (path, svg) => {
	await mkdir(dirname(path), { recursive: true });
	const image = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
	await writeFile(path, image);
};


const cards = [
	{ path: join(output, 'home.png'), svg: homepageSocialCard() },
	{ path: join(output, 'planner.png'), svg: plannerSocialCard() },
	...cities.map((city) => ({ path: join(output, 'city', `${city.slug}.png`), svg: citySocialCard(city) })),
	...converterPairs.map((pair) => {
		const from = cities.find((city) => city.slug === pair.from);
		const to = cities.find((city) => city.slug === pair.to);
		if (!from || !to) throw new Error(`Unknown social-card route: ${pair.from}/${pair.to}`);
		return { path: join(output, 'convert', `${pair.from}-to-${pair.to}.png`), svg: converterSocialCard(from, to) };
	}),
];

for (const card of cards) await writeCard(card.path, card.svg);
