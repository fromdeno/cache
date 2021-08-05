import { CacheEntry } from "./entry.ts";

const headers = new Headers();
// https://deno.land/manual/typescript/overview#determining-the-type-of-file
headers.append("Accept", "application/typescript");
headers.append("Accept", "text/typescript");
headers.append("Accept", "application/x-typescript");
headers.append("Accept", "application/javascript");
headers.append("Accept", "text/javascript");
headers.append("Accept", "application/ecmascript");
headers.append("Accept", "text/ecmascript");
headers.append("Accept", "application/x-javascript");
headers.append("Accept", "application/node");
headers.append("Accept", "text/jsx");
headers.append("Accept", "text/tsx");

export async function fetchCache(url: string | URL): Promise<Response> {
  const entry = new CacheEntry(url);
  try {
    return await entry.read();
  } catch (error: unknown) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }
  const res = await fetch(url, { headers });
  if (res.status === 200) await entry.write(res.clone());
  return res;
}
