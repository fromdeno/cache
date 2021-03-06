import { Path, sha256 } from "./deps.deno.ts";
import { getCacheDir } from "./cache_dir.ts";

export class CacheEntry {
  /** Input URL */
  readonly url: Readonly<URL>;
  readonly hash: string;
  /** Path where the response body is (or would be) cached. */
  readonly path: string;
  /** Path where the compiled JS is (or would be) cached. */
  readonly jsPath: string;
  /**
   * Calculates where a gives URL is (or would be) cached.
   * Performs no IO.
   * @permissions `--allow-env`
   */
  constructor(url: string | URL) {
    this.url = new URL(String(url));
    this.hash = sha256(
      this.url.search
        ? `${this.url.pathname}?${this.url.search}`
        : this.url.pathname,
    );
    this.path = Path.join(
      getCacheDir(),
      "deps/",
      this.url.protocol.slice(0, -1),
      this.url.hostname,
      this.hash,
    );
    this.jsPath = Path.join(
      getCacheDir(),
      "gen/",
      this.url.protocol.slice(0, -1),
      this.url.hostname,
      this.hash + ".js",
    );
  }

  /** Path where the response headers are (or would be) cached. */
  get metaPath(): string {
    return `${this.path}.metadata.json`;
  }

  /**
   * @permissions `--allow-read`
   * @returns cached `Response` on success.
   * @throws `Deno.errors.NotFound` when the URL isn't cached.
   */
  async read(options?: Deno.ReadFileOptions): Promise<Response> {
    await Deno.permissions.request({ name: "read", path: getCacheDir() });
    const [body, { headers }] = await Promise.all([
      Deno.readFile(this.path, options),
      Deno.readTextFile(this.metaPath, options).then(JSON.parse),
    ]);
    return new Response(body, { headers });
  }

  /**
   * Stores the response in cache.
   * @permissions `--allow-write`
   */
  async write(res: Response): Promise<void> {
    await Deno.permissions.request({ name: "write", path: getCacheDir() });
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
