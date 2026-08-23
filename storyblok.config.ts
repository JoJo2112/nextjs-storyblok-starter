import { loadEnvConfig } from '@next/env';

// Same .env rules as Next.js. Shell vars win over the files, so:
// STORYBLOK_SPACE_ID=<id> npm run schema:push
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');

const config = {
  space: process.env.STORYBLOK_SPACE_ID,
};

export default config;
