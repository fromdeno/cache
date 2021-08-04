import { Path, sha256 } from "./deps.deno.ts";
import { getCacheDir } from "./cache_dir.ts";

export interface Entry {
  readonly url: Readonly<URL>;
  readonly hash: string;
  readonly path: string;
  readonly metaPath: string;
}

export function entry(url: Readonly<URL>): Entry {
  const formatted = url.search ? `${url.pathname}?${url.search}` : url.pathname;
  const hash = sha256(formatted);
  const path = Path.resolve(
    getCacheDir(),
    "deps/",
    url.protocol.slice(0, -1),
    url.hostname,
    hash,
  );
  const metaPath = `${path}.metadata.json`;
  return { url, hash, path, metaPath };
}
