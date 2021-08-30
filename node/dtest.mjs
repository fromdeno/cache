#!/usr/bin/env node
/// <reference types="node" />

/**
 * Runs `deno.ns`'s `Deno.test`s on Node.js.
 *
 * Usage:
 *
 * ```sh
 * $ npm install @fromdeno/cache
 * $ dtest <testFiles>
 * ```
 *
 * Lives here for ease of dogfooding.
 * Feel free to turn it into a separate package, to add more functionality.
 * Name and license it however you want.
 * Just please put "@wojpawlik" in the initial commit to notify me.
 */

import { pathToFileURL } from "url";
import { tests } from "deno.ns/tests";
import "deno.ns/global";

const cwd = pathToFileURL(process.cwd() + "/");
const failures = [];

for (const path of Deno.args) {
  tests.length = 0;
  const url = new URL(path, cwd);
  await import(url.href);
  process.stdout.write(`running ${tests.length} tests from ${url}\n`);
  for (const test of tests) {
    process.stdout.write(`test ${test.name} ... `);
    if (test.ignore === true) {
      process.stdout.write("ignored\n");
      continue;
    }
    try {
      await test.fn();
      process.stdout.write("ok\n");
    } catch (error) {
      process.exitCode = 1;
      process.stdout.write("FAILED\n");
      failures.push({ test, error });
    }
  }
}

if (failures.length) {
  process.stdout.write(`\n${failures.length} tests failed:\n`);
  for (const { test, error } of failures) {
    process.stdout.write(`\n${test.name}\n${error.stack}\n`);
  }
}
