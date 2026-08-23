# Storyblok Starter

Next.js App Router + Storyblok. Block schema lives in code and is pushed to the
space with the Storyblok CLI.

**This is a starting point, not a framework.** It makes a few opinionated
choices — components registered automatically by filename, the visual editor and
draft mode wired up, a fixed folder structure, so a new project has something
working on day one. Every one of those is meant to be changed once the project
has opinions of its own. Nothing here is load-bearing enough to be worth
defending.

## Getting started

1. Copy `.env.example` to `.env` and fill in:

   | Variable                       | Where to find it                                      |
   | ------------------------------ | ----------------------------------------------------- |
   | `STORYBLOK_SPACE_ID`           | Settings → General                                    |
   | `STORYBLOK_DELIVERY_API_TOKEN` | Settings → Access Tokens. Must be a **Preview** token |

2. Log the CLI in once, for the schema commands:

   ```bash
   npx storyblok login
   ```

3. Point the space at the app — **Settings → Visual Editor → Location**:

   ```
   https://localhost:3000/api/draft?slug=
   ```

4. Start it:

   ```bash
   npm run dev
   ```

Runs on HTTPS, which the visual editor requires. Spaces outside the EU need
`region` changed in `src/lib/storyblok.ts`.

## Commands

| Command                       | Does                                        |
| ----------------------------- | ------------------------------------------- |
| `npm run dev`                 | Dev server on `https://localhost:3000`      |
| `npm run build` / `npm start` | Production build and serve                  |
| `npm run lint`                | ESLint                                      |
| `npm run schema:validate`     | Check the schema without touching the space |
| `npm run schema:diff`         | Preview what a push would change            |
| `npm run schema:push`         | Apply the schema to the space               |
| `npm run schema:pull`         | Regenerate the schema from the space        |

## Adding a content type

Content types are `is_root` blocks — every story in Storyblok is one, and the
catch-all route renders it at the story's slug.

**1. Define it** in `.storyblok/schema/blocks/landing.ts`:

```ts
import { defineBlock, defineField } from '@storyblok/schema';

export const landingBlock = defineBlock({
  name: 'landing',
  is_root: true,
  is_nestable: false,
  fields: [defineField('body', { type: 'bloks' })],
});
```

**2. Register it** in `.storyblok/schema/schema.ts` under `blocks`.

**3. Push it:** `npm run schema:diff` to check, then `npm run schema:push`.

**4. Build the component** at `src/components/pages/Landing.tsx` — see
`Page.tsx` for the pattern: it maps over a `bloks` field with
`StoryblokServerComponent`.

Then create a story of that type in Storyblok. It renders at its slug with no
routing to add — `/about` finds the `about` story on its own.

## Adding a block

Nestable blocks are what editors drop into a `bloks` field. Same three schema
steps as above, with the flags flipped:

```ts
export const heroBlock = defineBlock({
  name: 'hero',
  is_root: false,
  is_nestable: true,
  fields: [defineField('headline', { type: 'text' })],
});
```

The component goes in `src/components/storyblok/` instead:

```tsx
import type { Block } from '@schema';
import { storyblokEditable } from '@storyblok/react/rsc';

export default function Hero({ blok }: { blok: Block<'hero'> }) {
  return <h2 {...storyblokEditable(blok)}>{blok.headline}</h2>;
}
```

Two rules apply to both folders:

- **The filename must match the block name.** Components register by
  snake_cased filename — `HeroSection.tsx` becomes `hero_section`. No registry
  to update, and a mismatch shows up as a "component not found" placeholder.
- **Spread `storyblokEditable(blok)`** onto the outer element, or the block
  renders but can't be clicked in the visual editor.

Field types come from the schema via the `@schema` alias, so `blok.headline` is
typed from the definition you pushed — as nullable, since fields can be empty.

## Adding a UI component

`src/components/ui/` is not scanned by the component factory — only `storyblok/`
and `pages/` are — so it's yours to structure however you like: nest it, name
files freely, and skip `storyblokEditable` entirely. Keeping the rendering here
lets block components stay thin: they read fields off `blok`, pass them down,
and nothing else.

`Feature` is the worked example. `src/components/ui/FeatureCard.tsx` takes a
plain `title` and spreads the rest onto its root element:

```tsx
export default function FeatureCard({ title, ...rest }: FeatureCardProps) {
  return (
    <div
      className="rounded-lg border border-foreground/15 p-6"
      {...rest}
    >
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
  );
}
```

That `...rest` is what carries `storyblokEditable`'s attributes through, letting
`Feature` stay a one-liner. Drop the spread and the block still renders but
stops being clickable in the editor — with no type error to warn you.

## Where things live

```
.storyblok/schema/        block definitions — the source of truth
src/app/[[...slug]]/      catch-all route, renders any story by slug
src/app/api/draft/        entry point for the visual editor
src/components/pages/     content types (is_root blocks)
src/components/storyblok/ nestable blocks
src/components/ui/        presentational components
src/lib/                  third-party clients and integrations
src/util/                 helpers
```

`pages/` and `storyblok/` are both flat — subdirectories aren't picked up, and
the filename is the block name. `ui/` has no such constraint.

## Troubleshooting

| Symptom                                       | Cause                                                                                                                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Block renders as "component not found"        | The filename doesn't snake_case to the block's technical name. `HeroSection.tsx` → `hero_section`. Check for a subdirectory too — those aren't scanned                       |
| Editor only ever shows published content      | `STORYBLOK_DELIVERY_API_TOKEN` isn't a **Preview** token, or is from another space. Unsigned requests fall through to published content silently, so there's no error to see |
| Editor iframe stays blank                     | Open `https://localhost:3000` in a normal tab first. If the certificate isn't trusted the iframe fails silently — there's no warning to click through inside an iframe       |
| Drafts don't show, but the page loads         | The browser is blocking the draft-mode cookie. It needs HTTPS and third-party cookies permitted for `localhost`                                                              |
| Edits made in the Storyblok UI keep reverting | `schema:push` overwrites `display_name`, `description`, `color`, `icon` and `preview_field`. Set them in the block definition                                                |
| Stuck seeing drafts outside the editor        | Visit `/api/disable-draft`. A session started _inside_ the editor can't be cleared this way — it ends when the browser closes                                                |
| Old blocks still in Storyblok after a rename  | Push with `--delete`, which removes remote blocks no longer in the schema                                                                                                    |

## Good to know

- **The space is downstream of the code.** A push overwrites `display_name`,
  `description`, `color`, `icon` and `preview_field` — set them in the block
  definition, not in the Storyblok UI, or the next push resets them.
- **`schema:pull` overwrites, it doesn't merge.** It regenerates the whole
  `.storyblok/schema` directory from the space and discards local edits. It's
  for adopting an existing space, not for syncing one — the normal direction is
  code → space via `schema:push`.
- **Draft mode is automatic in the editor.** Storyblok signs its preview
  requests, `/api/draft` verifies that signature and turns on draft mode, and
  pages then render unpublished content. Visit `/api/disable-draft` to leave a
  draft session started outside the editor.
- **Pages are cached for 3 minutes** (`revalidate` in the catch-all): rendered
  on first request, then served from cache and revalidated in the background.
  Draft mode bypasses it. 404s are cached too, so a newly published story can
  404 for up to 3 minutes if someone hit that URL first.
- **Route config is per file.** Everything routed through `[[...slug]]` shares
  one caching policy. To opt a path out, give it its own route file
  (`src/app/pricing/page.tsx`) with its own `dynamic`/`revalidate` — a specific
  segment wins over the catch-all.
- **Generated files are gitignored** — `.storyblok/logs`, `reports`,
  `components` and `schema/changesets`. Only `.storyblok/schema` is committed.

## Not included

Deliberate gaps, roughly in the order you're likely to hit them:

- **Rich text rendering.** The `richtext` field type needs a renderer to turn its
  document JSON into markup.
- **Images.** Storyblok's asset field gives you a URL and its image service
  handles resizing and format — worth wiring into `next/image`.
- **Link fields.** Internal links arrive as story references and need resolving
  to real hrefs.
- **Metadata.** No `generateMetadata`, so no per-story titles, descriptions or
  Open Graph tags.
- **On-demand revalidation.** Pages refresh on a timer, so a publish takes up
  to 3 minutes to appear. A webhook route calling `revalidatePath` would make it
  immediate.
- **A preview banner.** Nothing tells you you're viewing drafts, and nothing
  links to `/api/disable-draft`.
- **Deployment.** No CI config or host settings, though there isn't much to it:
  set the two env vars on the host, add the deployed URL as a second Visual
  Editor location in the space, and run `schema:push` after the build so the
  space matches what shipped. The push authenticates separately from the
  delivery token — `storyblok login --token <token>`, or all three of
  `STORYBLOK_LOGIN`, `STORYBLOK_TOKEN` and `STORYBLOK_REGION`. Set only some and
  the CLI silently falls back to your local login: fine locally, broken in CI.
