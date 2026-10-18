import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { siteRelease } from '../src/lib/release.ts';

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('keeps the package, site metadata and changelog on the same release version', async () => {
	const [packageJson, changelog, footer, baseLayout, plannerLayout, sitemap] = await Promise.all([
		read('package.json'),
		read('CHANGELOG.md'),
		read('src/components/SiteFooter.astro'),
		read('src/layouts/BaseLayout.astro'),
		read('src/layouts/PlannerLayout.astro'),
		read('src/pages/sitemap.xml.ts'),
	]);
	const manifest = JSON.parse(packageJson) as { version: string };

	assert.equal(manifest.version, siteRelease.version);
	assert.match(changelog, new RegExp(`## \\[${siteRelease.version.replaceAll('.', '\\.')}\\]`));
	assert.match(footer, /\/changelog/);
	assert.match(baseLayout, /application-version/);
	assert.match(plannerLayout, /application-version/);
	assert.match(sitemap, /path: '\/changelog'/);
});
