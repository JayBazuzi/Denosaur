import { download } from "https://deno.land/x/download@v2.0.2/mod.ts";
import { assertEquals } from "https://deno.land/std@0.212.0/assert/mod.ts";
import * as path from "https://deno.land/std@0.212.0/path/mod.ts";
import * as strings from "https://deno.land/std@0.34.0/strings/mod.ts";
import { decompress } from "https://deno.land/x/zip@v1.2.5/mod.ts";

import _DenoTempDir from "./_DenoTempDir.ts";

// TODO refactor
const sourceDir = path.dirname(path.fromFileUrl(import.meta.url));

const targetPlatform = {
  "windows": "pc-windows-msvc",
  "darwin": "apple-darwin",
  "linux": "unknown-linux-gnu",
}[Deno.build.os];

const deno_uri =
  `https://github.com/denoland/deno/releases/latest/download/deno-${Deno.build.arch}-${targetPlatform}.zip`;
console.log(`Downloading ${deno_uri}`);
const { fullPath } = await download(deno_uri, { file: `deno-${targetPlatform}.zip` });

await using tempDir = await _DenoTempDir.create({ prefix: "update-deno-" });
console.log(await decompress(fullPath, tempDir.path));

const output = await new Deno.Command(
  tempDir + `/deno`,
  {
    args: [
      "eval",
      "console.log(Deno.version.deno)",
    ],
    stdout: "piped",
  },
).output();
assertEquals(output.code, 0);
const version = strings.decode(output.stdout);

deno_version_path = `${sourceDir}/.deno_version`;
console.log(`Setting ${deno_version_path} to ${version}`);
await Deno.writeTextFile(
  deno_version_path,
  "v" + version,
);
