await run_deno([
  "test",
  "--allow-all",
  "--parallel",
  "--ignore=_build_and_test.ts",
]);
await run_deno(["lint"]);
await run_deno(["fmt", "--check"]);

function run_deno(args: Array<string>) {
  const output = new Deno.Command(
    Deno.execPath(),
    {
      args: args,
      stdout: "inherit",
      stderr: "inherit",
    },
  ).outputSync();

  if (output.code != 0) {
    Deno.exit(output.code);
  }
}
