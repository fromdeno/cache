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

const cwd = pathToFileURL(process.cwd() + "/");
const failures = [];
const stats = {
  passed: 0,
  ignored: 0,
};

for (const path of process.argv.slice(2)) {
  tests.length = 0;
  const url = new URL(path, cwd);
  await import(url.href);
  process.stdout.write(`running ${tests.length} tests from ${url}\n`);
  for (const test of tests) {
    process.stdout.write(`test ${test.name} ...`);
    const start = Date.now();
    try {
      if (test.ignore === true) {
        process.stdout.write("\x1b[33m ignored");
        stats.ignored++;
        continue;
      }
      await test.fn();
      process.stdout.write("\x1b[32m ok");
      stats.passed++;
    } catch (error) {
      process.stdout.write("\x1b[31m FAILED");
      failures.push({ test, error });
    } finally {
      const finish = Date.now();
      process.stdout.write(`\x1b[90m (${finish - start}ms)\n\x1b[0m`);
    }
  }
}

if (failures.length) {
  process.stdout.write(`\nfailures:\n`);
  for (const { test, error } of failures) {
    process.stdout.write(`\n${test.name}\n${error.stack}\n`);
  }
  process.stdout.write("\ntest result:\x1b[31m FAILED\x1b[0m. ");
  process.exitCode = 1;
} else {
  process.stdout.write("\ntest result:\x1b[32m ok\x1b[0m. ");
}

process.stdout.write(`\
${stats.passed} passed; \
${failures.length} failed; \
${stats.ignored} ignored \
\x1b[90m(${performance.now().toFixed(0)}ms)\x1b[0m
`);
