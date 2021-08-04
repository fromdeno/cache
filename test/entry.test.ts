import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import * as cache from "../src/entry.ts";

Deno.test("cache.entry() locates cached files", async () => {
  const url = new URL("https://deno.land/std@0.97.0/testing/asserts.ts");
  const entry = cache.entry(url);
  assertEquals(entry.url, url);
  await Deno.stat(entry.metaPath);
  await Deno.stat(entry.path);
});
