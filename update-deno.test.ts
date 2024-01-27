import { assertEquals, assertMatch, assertNotEquals } from "std/assert/mod.ts";
import * as path from "std/path/mod.ts";
import _DenowTestSetup from "./_DenowTestSetup.ts";

const AN_OLDER_DENO_VERSION = "1.39.0";

Deno.test("Update to the latest Deno", async () => {
  await using subject = await _DenowTestSetup.create();

  await subject.writeVersionFile(AN_OLDER_DENO_VERSION);

  await subject.runDenow([
    "run",
    "--allow-net",
    "--allow-write=.",
    "update_deno.ts",
  ]);

  const result = await subject.readVersionFile();
  assertMatch(result, /\d+\.\d+\.\d+/);
  assertNotEquals(result, AN_OLDER_DENO_VERSION);

  // Upgrade a 2nd time should be a no-op
  await subject.runDenow([
    "run",
    "--allow-net",
    "--allow-write=.",
    "update_deno.ts",
  ]);

  const result2 = await subject.readVersionFile();
  assertEquals(result, result2);
});
