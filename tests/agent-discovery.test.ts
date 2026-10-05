import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readProjectFile = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('advertises the API catalog and agent discovery resources on the homepage', async () => {
	const worker = await readProjectFile('src/worker.ts');

	assert.match(worker, /<\/.well-known\/api-catalog>; rel="api-catalog"/);
	assert.match(worker, /<\/openapi.json>; rel="service-desc"/);
	assert.match(worker, /<\/api>; rel="service-doc"/);
	assert.match(worker, /<\/.well-known\/ai-catalog.json>; rel="describedby"/);
	assert.match(worker, /content-signal/);
});

test('publishes valid catalogs and a verifiable Agent Skills digest', async () => {
	const [catalog, ard, skillsIndex, skill] = await Promise.all([
		readProjectFile('public/.well-known/api-catalog'),
		readProjectFile('public/.well-known/ai-catalog.json'),
		readProjectFile('public/.well-known/agent-skills/index.json'),
		readProjectFile('public/.well-known/agent-skills/worldtime-navigation/SKILL.md'),
	]);
	const parsedCatalog = JSON.parse(catalog) as { linkset: unknown[] };
	const parsedArd = JSON.parse(ard) as { specVersion: string; entries: unknown[] };
	const parsedSkills = JSON.parse(skillsIndex) as { skills: Array<{ digest: string }> };

	assert.equal(parsedCatalog.linkset.length, 1);
	assert.equal(parsedArd.specVersion, '1.0');
	assert.ok(parsedArd.entries.length > 0);
	assert.equal(parsedSkills.skills[0]?.digest, `sha256:${createHash('sha256').update(skill).digest('hex')}`);
});

test('defines a public API health response and Content Signals policy', async () => {
	const [worker, robots] = await Promise.all([
		readProjectFile('src/worker.ts'),
		readProjectFile('src/pages/robots.txt.ts'),
	]);

	assert.match(worker, /url\.pathname === '\/api\/health'/);
	assert.match(robots, /Content-Signal: ai-train=no, search=yes, ai-input=yes/);
	assert.match(robots, /Agentmap:/);
});
