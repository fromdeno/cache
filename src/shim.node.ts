// Node-only, see https://doc.deno.land/https/deno.land/x/deno2node/src/mod.ts#deno2node
import { mkdir, readFile, writeFile } from "fs/promises";
const os = process.platform === "win32" ? "windows" : process.platform;
export const Deno = {
  // please keep sorted
  build: { os },
  env: { get: (key: string) => process.env[key] },
  mkdir,
  readTextFile: async (path: string) => await readFile(path, "utf8"),
  writeTextFile: writeFile,
};
