# Vinext remounts `loading.tsx` when a layout above the page is pending

In a production build, Vinext commits the prefetched loading shell on click. When an async layout above the route's `loading.tsx` is still pending, the RSC payload then mounts a **new** fallback element instead of keeping the shell's. The skeleton restarts once the layout resolves. An `enter`/`exit` `<ViewTransition>` around the fallback makes this visible as a second skeleton.

## Run

Uses the installed Google Chrome through `playwright-core`; it downloads no browser.

```bash
pnpm install
pnpm build
pnpm start          # http://localhost:7402
pnpm measure        # in a second terminal
```

`measure.mjs` clicks between sibling pages and counts distinct `[data-skeleton]` elements mounted per navigation (`+` mounted, `-` removed, ms after click).

## Routes

| Group | Layout | Page | `loading.tsx` |
| --- | --- | --- | --- |
| `/slow-layout/{a,b}` | async, `await headers()` then 800 ms | instant | per page |
| `/slow-page/{a,b}` (control) | sync | async, `await headers()` then 800 ms | per page |

## Result on vinext 1.2.1 (`pnpm build && pnpm start`)

```
slow-layout (async layout above loading.tsx)
  /slow-layout/a -> /slow-layout/b: 2 fallback element(s) mounted  +65ms #1 -874ms #1 +874ms #2 -1679ms #2
  /slow-layout/b -> /slow-layout/a: 1 fallback element(s) mounted  +985ms #1 -1785ms #1
  /slow-layout/a -> /slow-layout/b: 2 fallback element(s) mounted  +187ms #1 -996ms #1 +996ms #2 -1796ms #2

slow-page (control: async page under sync layout)
  /slow-page/a -> /slow-page/b: 2 fallback element(s) mounted  +70ms #1 -104ms #1 +104ms #2 -863ms #2
  /slow-page/b -> /slow-page/a: 1 fallback element(s) mounted  +39ms #1 -832ms #1
  /slow-page/a -> /slow-page/b: 2 fallback element(s) mounted  +31ms #1 -35ms #1 +35ms #2 -837ms #2
```

1.1.0 gives the same pattern. `pnpm dev` mounts one fallback per navigation, because dev does not prefetch the loading shell. The same `app/` built with Next.js 16.4.2 (`next build && next start`) mounts one fallback per navigation in both groups.
