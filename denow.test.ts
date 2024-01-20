import {
  assertEquals,
  assertNotEquals,
  assertStringIncludes,
} from "std/assert/mod.ts";
import * as path from "std/path/mod.ts";
import * as strings from "https://deno.land/std@0.34.0/strings/mod.ts";

const A_DENO_VERSION = "1.39.0";
const A_NONEXISTENT_DENO_VERSION = "0.0.0.0";

const scriptExtension = Deno.build.os == "windows" ? ".cmd" : "";

//------------------------------------------------------------------------
Deno.test("happy path", async () => {
  await using subject = await _DenowTestSetup.create();

  await subject.writeVersionFile("v" + A_DENO_VERSION);

  const result = await subject.runDenow([
    "eval",
    "console.log(Deno.version.deno)",
  ]);

  assertEquals(result.code, 0);
  assertEquals(strings.decode(result.stdout), A_DENO_VERSION + "\n");
});

//------------------------------------------------------------------------
Deno.test("missing .deno_version", async () => {
  await using subject = await _DenowTestSetup.create();
  const result = await subject.runDenow([
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
  await using subject = await _DenowTestSetup.create();
  await subject.writeVersionFile(A_NONEXISTENT_DENO_VERSION);

  const result = await subject.runDenow([
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

class _DenoTempDir implements AsyncDisposable {
  path: string;
  private constructor(path: string) {
    this.path = path;
  }

  static async create(options?: Deno.MakeTempOptions): Promise<_DenoTempDir> {
    return new _DenoTempDir(await Deno.makeTempDir(options));
  }

  async [Symbol.asyncDispose]() {
    await Deno.remove(this.path, { recursive: true });
  }
}

class _DenowTestSetup implements AsyncDisposable {
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

  get #denowPath(): string {
    return this.#testProjectDir + "/denow" + scriptExtension;
  }

  static async create(): Promise<_DenowTestSetup> {
    const this_ = new _DenowTestSetup(
      await _DenoTempDir.create({ prefix: "denow.test-" }),
    );
    await Deno.mkdir(this_.#testProjectDir);
    await Deno.mkdir(this_.#tempHomeDir);

    const sourceDir = path.dirname(path.fromFileUrl(import.meta.url));

    await Deno.copyFile(
      sourceDir + "/denow" + scriptExtension,
      this_.#denowPath,
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

  async runDenow(args: Array<string>): Promise<Deno.CommandOutput> {
    return await new Deno.Command(
      this.#denowPath,
      {
        args: args,
        env: { "HOME": this.#tempHomeDir },
        cwd: this.#testProjectDir,
      },
    ).output();
  }
}
