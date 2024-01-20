import {
  assertEquals,
  assertNotEquals,
  assertStringIncludes,
} from "std/assert/mod.ts";
import * as path from "std/path/mod.ts";
import * as strings from "https://deno.land/std@0.34.0/strings/mod.ts";
import _DenoTempDir from "./_DenoTempDir.ts";

const A_DENO_VERSION = "1.39.0";
const A_NONEXISTENT_DENO_VERSION = "0.0.0.0";

const scriptExtension = Deno.build.os == "windows" ? ".cmd" : ".sh";

//------------------------------------------------------------------------
Deno.test("happy path", async () => {
  await using subject = await _DenosaurTestSetup.create();

  await subject.writeVersionFile("v" + A_DENO_VERSION);

  const result = await subject.runDenosaur([
    "eval",
    "console.log(Deno.version.deno)",
  ]);

  assertEquals(result.code, 0);
  assertEquals(strings.decode(result.stdout), A_DENO_VERSION + "\n");
});

//------------------------------------------------------------------------
Deno.test("missing .deno_version", async () => {
  await using subject = await _DenosaurTestSetup.create();
  const result = await subject.runDenosaur([
    "eval",
    "console.log(Deno.version.deno)",
  ]);

  assertNotEquals(result.code, 0);
  assertStringIncludes(
    strings.decode(result.stderr),
    "Error: .deno_version file not found.",
  );
});

//------------------------------------------------------------------------
Deno.test("version not available", async () => {
  await using subject = await _DenosaurTestSetup.create();
  await subject.writeVersionFile(A_NONEXISTENT_DENO_VERSION);

  const result = await subject.runDenosaur([
    "--help",
  ]);

  assertNotEquals(result.code, 0);
  assertStringIncludes(
    strings.decode(result.stderr),
    "Error: failed to download https://github.com/denoland/deno/releases/download/",
  );
});

// //------------------------------------------------------------------------
// Deno.test("works from a subdirectory", async () => {
//     mkdir foo
//     cd foo
//     ../deno --version # should work
// });

//------------------------------------------------------------------------
// Deno.test("a helpful error when unzip is not available", async () => {
//      remove unzip from path
//      deno --version
//      works
// });

class _DenosaurTestSetup implements AsyncDisposable {
  #tempDir: _DenoTempDir;

  private constructor(tempDir: _DenoTempDir) {
    this.#tempDir = tempDir;
  }

  get #tempHomeDir(): string {
    return this.#tempDir.path + "/home";
  }

  get #testProjectDir(): string {
    return this.#tempDir.path + "/test_project";
  }

  get #denosaurPath(): string {
    return this.#testProjectDir + "/deno" + scriptExtension;
  }

  static async create(): Promise<_DenosaurTestSetup> {
    const this_ = new _DenosaurTestSetup(
      await _DenoTempDir.create({ prefix: "denosaur.test-" }),
    );
    await Deno.mkdir(this_.#testProjectDir);
    await Deno.mkdir(this_.#tempHomeDir);

    const sourceDir = path.dirname(path.fromFileUrl(import.meta.url));

    await Deno.copyFile(
      sourceDir + "/denosaur" + scriptExtension,
      this_.#denosaurPath,
    );

    return this_;
  }

  async [Symbol.asyncDispose]() {
    await this.#tempDir[Symbol.asyncDispose]();
  }

  async writeVersionFile(version: string) {
    await Deno.writeTextFile(
      this.#testProjectDir + "/.deno_version",
      version,
    );
  }

  async runDenosaur(args: Array<string>): Promise<Deno.CommandOutput> {
    return await new Deno.Command(
      this.#denosaurPath,
      {
        args: args,
        env: { "HOME": this.#tempHomeDir },
        cwd: this.#testProjectDir,
      },
    ).output();
  }
}
