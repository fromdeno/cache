import { CacheEntry } from "./entry.ts";

export async function readCache(url: string | URL): Promise<Response> {
  return await new CacheEntry(url).read();
}
