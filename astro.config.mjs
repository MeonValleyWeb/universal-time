// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

const { PUBLIC_SITE_URL } = loadEnv('production', new URL('.', import.meta.url).pathname, '');

// https://astro.build/config
export default defineConfig({
  site: PUBLIC_SITE_URL || 'https://universaltime.app',
  integrations: [preact()],

  vite: {
    plugins: [tailwindcss()]
  }
});
