export * as Path from "https://deno.land/std@0.97.0/path/mod.ts";

import { Sha256 } from "https://deno.land/std@0.97.0/hash/sha256.ts";

export const sha256 = (data: string) => new Sha256().update(data).toString();
