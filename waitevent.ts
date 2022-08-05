import { run } from "./src/run.ts";
if (!await run(Deno.args)) {
  Deno.exit(1);
}
