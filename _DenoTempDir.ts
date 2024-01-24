export default class _DenoTempDir implements AsyncDisposable {
  path: string;
  private constructor(path: string) {
    this.path = path;
  }

  static async create(options?: Deno.MakeTempOptions): Promise<_DenoTempDir> {
    return new _DenoTempDir(await Deno.makeTempDir(options));
  }

  async [Symbol.asyncDispose]() {
    // await Deno.remove(this.path, { recursive: true });
  }
}
