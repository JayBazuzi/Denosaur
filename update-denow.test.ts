import { assertEquals, assertGreater } from "std/assert/mod.ts";
import * as path from "std/path/mod.ts";
import _DenoTempDir from "./_DenoTempDir.ts";

Deno.test("Download the latest Denow", async () => {
  const sourceDir = path.dirname(path.fromFileUrl(import.meta.url));

  await using tempDir = await _DenoTempDir.create({
    prefix: "update-denow.test-",
  });

  const output = await new Deno.Command(
    sourceDir + "/denow",
    {
      args: [
        "run",
        "--allow-net",
        "--allow-write=.",
        `${sourceDir}/update-denow.ts`,
      ],
      cwd: tempDir.path,
    },
  ).output();

  assertEquals(output.code, 0);
  const { size } = await Deno.stat(`${tempDir.path}/denow`);
  assertGreater(size, 500);
});
