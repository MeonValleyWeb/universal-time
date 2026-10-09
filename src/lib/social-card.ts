import type { City } from './cities';

const escapeXml = (value: string) => value
	.replaceAll('&', '&amp;')
	.replaceAll('<', '&lt;')
	.replaceAll('>', '&gt;')
	.replaceAll('"', '&quot;')
	.replaceAll("'", '&apos;');

interface CardCopy {
	eyebrow: string;
	title: string;
	subtitle: string;
	label: string;
}

const renderCard = ({ eyebrow, title, subtitle, label }: CardCopy) => {
	const titleSize = title.length > 31 ? 52 : title.length > 20 ? 64 : 82;
	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(title)} · WorldTime</title>
  <desc id="description">${escapeXml(subtitle)}</desc>
  <rect width="1200" height="630" fill="#0b1220"/>
  <path d="M0 484C186 377 322 628 551 494C741 383 892 396 1200 167V630H0Z" fill="#111c2e"/>
  <circle cx="1028" cy="-18" r="250" fill="none" stroke="#54a7f7" stroke-opacity=".25" stroke-width="2"/>
  <circle cx="1028" cy="-18" r="170" fill="none" stroke="#54a7f7" stroke-opacity=".13" stroke-width="2"/>
  <circle cx="92" cy="91" r="34" fill="none" stroke="#54a7f7" stroke-width="4"/>
  <path d="M92 91 109 77M92 91l13 11" fill="none" stroke="#54a7f7" stroke-linecap="round" stroke-width="4"/>
  <text x="146" y="101" fill="#f4f6fb" font-family="Georgia, serif" font-size="38">WorldTime</text>
  <text x="92" y="208" fill="#54a7f7" font-family="ui-monospace, monospace" font-size="20" font-weight="700" letter-spacing="5">${escapeXml(eyebrow.toUpperCase())}</text>
  <text x="92" y="330" fill="#f4f6fb" font-family="Georgia, serif" font-size="${titleSize}" font-weight="700">${escapeXml(title)}</text>
  <text x="92" y="395" fill="#b8c2d4" font-family="Arial, sans-serif" font-size="30">${escapeXml(subtitle)}</text>
  <rect x="92" y="472" width="${Math.max(208, label.length * 15 + 52)}" height="58" rx="8" fill="#54a7f7"/>
  <text x="118" y="509" fill="#0b1220" font-family="ui-monospace, monospace" font-size="18" font-weight="700" letter-spacing="2">${escapeXml(label.toUpperCase())} →</text>
</svg>`;
};

export const citySocialCard = (city: City) => renderCard({
	eyebrow: `${city.country} · Live city clock`,
	title: `Time in ${city.name}`,
	subtitle: `${city.description} Live time, local date and seasonal clock rules.`,
	label: 'Open city clock',
});

export const converterSocialCard = (from: City, to: City) => renderCard({
	eyebrow: 'Time converter · Working-hour context',
	title: `${from.name} → ${to.name}`,
	subtitle: `Convert time, compare dates and find a sensible moment to call.`,
	label: 'Open converter',
});

export const plannerSocialCard = () => renderCard({
	eyebrow: 'Meeting planner',
	title: 'Find the overlap.',
	subtitle: 'Compare working hours across every city on one clear timeline.',
	label: 'Plan a meeting',
});

export const homepageSocialCard = () => renderCard({
	eyebrow: 'World time, made clear',
	title: 'Every hour, in its right place.',
	subtitle: 'Convert time, compare cities and plan better meetings across time zones.',
	label: 'Open WorldTime',
});
