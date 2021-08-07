import {
  assertEquals,
  assertThrowsAsync,
  cacheHitUrl,
  cacheMissUrl,
} from "./shared.ts";
import { readCache } from "../src/read.ts";

Deno.test("readCache -- string hit", async () => {
  const res = await readCache(cacheHitUrl.href);
  assertEquals(res.status, 200);
});

Deno.test("readCache -- URL hit", async () => {
  const res = await readCache(cacheHitUrl);
  assertEquals(res.status, 200);
});

Deno.test("readCache -- miss", async () => {
  await assertThrowsAsync(() => readCache(cacheMissUrl), Deno.errors.NotFound);
});
