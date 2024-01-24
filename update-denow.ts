import { assert } from "https://deno.land/std@0.212.0/assert/assert.ts";

const repoOrganizationAndName = "JayBazuzi/denow";

for (const f of ["denow", "denow.cmd"]) {
  const response = await fetch(
    `https://raw.githubusercontent.com/${repoOrganizationAndName}/main/${f}`,
  );
  assert(response.ok);

  await Deno.writeTextFile(f, await response.text());
}
