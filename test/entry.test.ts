import { assertEquals, cacheHitUrl } from "./shared.ts";
import { CacheEntry } from "../src/entry.ts";

Deno.test("CacheEntry -- string hit", async () => {
  const entry = new CacheEntry(cacheHitUrl.href);
  assertEquals(entry.url, cacheHitUrl);
  await Deno.stat(entry.metaPath);
  await Deno.stat(entry.path);
});

Deno.test("CacheEntry -- URL hit", async () => {
  const entry = new CacheEntry(cacheHitUrl);
  assertEquals(entry.url, cacheHitUrl);
  await Deno.stat(entry.metaPath);
  await Deno.stat(entry.path);
});
