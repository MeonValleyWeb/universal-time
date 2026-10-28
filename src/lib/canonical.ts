const canonicalHost = 'universaltime.app';

export const canonicalRedirect = (url: URL): string | null => {
	const hasCanonicalHost = url.hostname === canonicalHost || url.hostname === `www.${canonicalHost}`;
	if (!hasCanonicalHost || (url.protocol === 'https:' && url.hostname === canonicalHost)) return null;

	return `https://${canonicalHost}${url.pathname}${url.search}`;
};
