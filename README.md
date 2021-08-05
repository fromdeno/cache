<!-- deno-fmt-ignore-file -->
# `@fromdeno/cache`

Simple [API] for Deno cache.

Differences from https://deno.land/x/cache or https://npm.im/deno-cache :

- High-level `readCache` and `fetchCache` return [`Response`], akin to `fetch`.

- Low-level `CacheEntry` can resolve where a file is (or would be) cached
  without performing IO.

[API]: https://doc.deno.land/https/deno.land/x/fromdeno_cache/src/mod.ts
[`Response`]: https://developer.mozilla.org/en-US/docs/Web/API/Response
