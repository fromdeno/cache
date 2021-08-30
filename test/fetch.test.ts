import {
  assert,
  assertEquals,
  assertThrowsAsync,
  cacheHitUrl,
  cacheMissUrl,
} from "./shared.ts";
import { fetchCache } from "../src/fetch.ts";

const inNodeJs = "global" in globalThis;

Deno.test("fetchCache -- string hit", async () => {
  const res = await fetchCache(cacheHitUrl.href);
  assert(res.headers.has("Content-Type"));
  assertEquals(res.status, 200);
});

Deno.test("fetchCache -- URL hit", async () => {
  const res = await fetchCache(cacheHitUrl);
  assert(res.headers.has("Content-Type"));
  assertEquals(res.status, 200);
});

Deno.test({
  name: "fetchCache -- miss",
  ignore: inNodeJs,
  fn: async () => {
    await assertThrowsAsync(
      () => fetchCache(cacheMissUrl),
      Deno.errors.PermissionDenied,
    );
  },
});

Deno.test("fetchCache -- abort", async () => {
  const abortController = new AbortController();
  abortController.abort();
  await assertThrowsAsync(
    () => fetchCache(cacheHitUrl, { signal: abortController.signal }),
    undefined,
    "operation was aborted",
  );
  await assertThrowsAsync(
    () => fetchCache(cacheMissUrl, { signal: abortController.signal }),
    undefined,
    "was aborted",
  );
});
