import {
  assertEquals,
  assertThrowsAsync,
  cacheHitUrl,
  cacheMissUrl,
} from "./shared.ts";
import { fetchCache } from "../src/fetch.ts";

Deno.test("fetchCache -- string hit", async () => {
  const res = await fetchCache(cacheHitUrl.href);
  assertEquals(res.status, 200);
});

Deno.test("fetchCache -- URL hit", async () => {
  const res = await fetchCache(cacheHitUrl);
  assertEquals(res.status, 200);
});

Deno.test("fetchCache -- miss", async () => {
  await assertThrowsAsync(
    () => fetchCache(cacheMissUrl),
    Deno.errors.PermissionDenied,
  );
});

Deno.test("fetchCache -- abort", async () => {
  const abortController = new AbortController();
  abortController.abort();
  await assertThrowsAsync(
    () => fetchCache(cacheHitUrl, { signal: abortController.signal }),
    DOMException,
    "The read operation was aborted",
  );
  await assertThrowsAsync(
    () => fetchCache(cacheMissUrl, { signal: abortController.signal }),
    DOMException,
    "Ongoing fetch was aborted.",
  );
});
