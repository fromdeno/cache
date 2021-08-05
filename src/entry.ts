import { Path, sha256 } from "./deps.deno.ts";
import { getCacheDir } from "./cache_dir.ts";

export class CacheEntry {
  readonly url: Readonly<URL>;
  readonly hash: string;
  readonly path: string;
  constructor(url: string | URL) {
    this.url = new URL(String(url));
    this.hash = sha256(
      url.search ? `${this.url.pathname}?${url.search}` : this.url.pathname,
    );
    this.path = Path.resolve(
      getCacheDir(),
      "deps/",
      this.url.protocol.slice(0, -1),
      this.url.hostname,
      this.hash,
    );
  }

  get metaPath(): string {
    return `${this.path}.metadata.json`;
  }

  async read(): Promise<Response> {
    const [body, meta] = await Promise.all([
      Deno.readFile(this.path),
      Deno.readTextFile(this.metaPath).then(JSON.parse),
    ]);
    const headers = new Headers(meta.headers);
    return new Response(body, { headers });
  }

  async write(res: Response): Promise<void> {
    const body = new Uint8Array(await res.arrayBuffer());
    const meta = { headers: Object.fromEntries(res.headers), url: this.url };
    const metaText = JSON.stringify(meta, undefined, 2);
    await Deno.mkdir(Path.dirname(this.path), { recursive: true });
    await Promise.all([
      Deno.writeFile(this.path, body),
      Deno.writeTextFile(this.metaPath, metaText),
    ]);
  }
}
