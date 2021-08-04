import { Path } from "./deps.deno.ts";
import type { Entry } from "./entry.ts";

export interface File extends Entry {
  readonly text: string;
  readonly headers: Headers;
}

export async function write(entry: Entry, res: Response): Promise<File> {
  const text = await res.text();
  const meta = { headers: Object.fromEntries(res.headers), url: entry.url };
  const metaText = JSON.stringify(meta, undefined, 2);
  await Deno.mkdir(Path.dirname(entry.path), { recursive: true });
  await Promise.all([
    Deno.writeTextFile(entry.path, text),
    Deno.writeTextFile(entry.metaPath, metaText),
  ]);
  return { ...entry, text, headers: res.headers };
}
