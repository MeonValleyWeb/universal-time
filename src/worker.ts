const canonicalHost = 'universaltime.app';

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);

		if (url.hostname === `www.${canonicalHost}`) {
			url.hostname = canonicalHost;
			return Response.redirect(url.toString(), 308);
		}

		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<Env>;
