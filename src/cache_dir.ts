// based on https://deno.land/x/cache@0.2.13

import { Path } from "./deps.deno.ts";

const POSIX_HOME = "HOME";

export function getCacheDir(): string {
  const env = Deno.env.get;
  const os = Deno.build.os;

  const deno = env("DENO_DIR");

  if (deno) return deno;

  let home: string | undefined;
  let path: string;
  switch (os) {
    case "linux": {
      const xdg = env("XDG_CACHE_HOME");
      home = xdg ?? env(POSIX_HOME);
      path = xdg ? "deno" : ".cache/deno/";
      break;
    }

    case "darwin":
      home = env(POSIX_HOME);
      path = "Library/Caches/deno/";
      break;

    case "windows":
      home = env("LOCALAPPDATA") ?? env("USERPROFILE");
      path = "deno";
      break;

    default:
      throw new Error(`Unsupported OS: ${os}`);
  }

  if (!home) return ".deno";
  return Path.resolve(home, path);
}
