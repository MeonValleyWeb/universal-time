import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readPage = (path) => readFile(new URL(`../dist/${path === '/' ? '' : `${path.slice(1)}/`}index.html`, import.meta.url), 'utf8');
const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const pages = new Map(await Promise.all(paths.map(async (path) => [path, await readPage(path)])));
const converters = paths.filter((path) => path.startsWith('/convert/'));
assert.equal(converters.length, 100);

for (const path of converters) {
	const [, , from, to] = path.split('/');
	assert.ok(pages.get(`/time/${from}`).includes(`href="${path}"`), `Source city must link to ${path}`);
	assert.ok(pages.get(path).includes(`href="/time/${from}"`));
	assert.ok(pages.get(path).includes(`href="/time/${to}"`));
	assert.ok(pages.get(path).includes(`href="/convert/${to}/${from}"`), `${path} must link to its reverse`);
}

for (const [path, html] of pages) {
	if (path === '/' || path === '/meeting-planner' || path === '/time-zones' || path.startsWith('/time/') || path.startsWith('/convert/')) {
		assert.ok(!html.includes('&quot;initialNow&quot;'), `${path} must not embed a build-time current timestamp`);
		assert.ok(html.includes('Loading') || html.includes('--:--'), `${path} needs an honest live-time loading state`);
	}
}
assert.equal((pages.get('/').match(/href="\/time\//g) ?? []).length, 57, 'All 51 city links and 6 featured links remain server-rendered');
console.log(`Verified ${pages.size} pages: all 100 converters linked from source cities and back to city/reverse routes; current-time HTML has no build-time timestamp.`);
