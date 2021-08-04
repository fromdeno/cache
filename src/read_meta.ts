import type { Entry } from "./entry.ts";

export interface Meta extends Entry {
  readonly headers: Headers;
}

export async function readMeta(entry: Entry): Promise<Meta> {
  const metaText = await Deno.readTextFile(entry.metaPath);
  const meta = JSON.parse(metaText);
  const headers = new Headers(meta.headers);
  return { ...entry, headers };
}
