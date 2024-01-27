import * as path from "std/path/mod.ts";
import _DenoTempDir from "./_DenoTempDir.ts";

const scriptExtension = Deno.build.os == "windows" ? ".cmd" : "";

export default class _DenowTestSetup implements AsyncDisposable {
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

  async readVersionFile() {
    return await Deno.readTextFile(
      this.#testProjectDir + "/.deno_version",
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
