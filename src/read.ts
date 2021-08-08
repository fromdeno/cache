import { CacheEntry } from "./entry.ts";

/**
 * @permissions `--allow-read --allow-env`
 * @returns cached `Response` on success.
 * @throws `Deno.errors.NotFound` when the URL isn't cached.
 */
export async function readCache(
  url: string | URL,
  options?: Deno.ReadFileOptions,
): Promise<Response> {
  return await new CacheEntry(url).read(options);
}
