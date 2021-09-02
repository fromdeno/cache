import { assertEquals, assertMatch, cacheHitUrl } from "./shared.ts";
import { CacheEntry } from "../src/entry.ts";

Deno.test("CacheEntry -- string hit", async () => {
  const entry = new CacheEntry(cacheHitUrl.href);
  assertMatch(entry.hash, /^[0-9a-f]{64}$/);
  assertEquals(entry.url, cacheHitUrl);
  await Deno.stat(entry.metaPath);
  await Deno.stat(entry.jsPath);
  await Deno.stat(entry.path);
});

Deno.test("CacheEntry -- URL hit", async () => {
  const entry = new CacheEntry(cacheHitUrl);
  assertMatch(entry.hash, /^[0-9a-f]{64}$/);
  assertEquals(entry.url, cacheHitUrl);
  await Deno.stat(entry.metaPath);
  await Deno.stat(entry.jsPath);
  await Deno.stat(entry.path);
});
