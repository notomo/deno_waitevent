import { buildCommand, receiveOne, run } from "./run.ts";
import { testClient, testEditor } from "../test/helper.ts";
import { assertEquals } from "https://deno.land/std@0.171.0/testing/asserts.ts";

Deno.test("run", async (t) => {
  await t.step("returns true if receives done event", async () => {
    const got = await run([
      ...testEditor(),
      "{serverAddress}",
      "done",
    ]);
    assertEquals(true, got);
  });

  await t.step("returns false if receives cancel event", async () => {
    const got = await run([
      ...testEditor(),
      "{serverAddress}",
      "cancel",
    ]);
    assertEquals(false, got);
  });
});

Deno.test("receiveOne", async (t) => {
  await t.step("returns true if receives done message", async () => {
    const [client, teardown] = await testClient();

    const got = receiveOne(client.server);
    await client.connection.write(new TextEncoder().encode("done"));
    assertEquals(true, await got);

    teardown();
  });

  await t.step("returns false if receives cancel message", async () => {
    const [client, teardown] = await testClient();

    const got = receiveOne(client.server);
    await client.connection.write(new TextEncoder().encode("cancel"));
    assertEquals(false, await got);

    teardown();
  });

  await t.step("returns false if receives no messages", async () => {
    const [client] = await testClient();

    const got = receiveOne(client.server);
    client.connection.close();
    assertEquals(false, await got);

    client.server.close();
  });
});

Deno.test("buildCommand", async (t) => {
  await t.step(
    "replaces command {argument} and {serverAddress} strings",
    () => {
      const got = buildCommand(
        [
          "editor",
          `open("{argument}", "{serverAddress}")`,
          "file.txt",
        ],
        {
          transport: "tcp" as const,
          hostname: "0.0.0.0",
          port: 8888,
        },
      );

      assertEquals(
        ["editor", `open("file.txt", "0.0.0.0:8888")`, "file.txt"],
        got,
      );
    },
  );
});
