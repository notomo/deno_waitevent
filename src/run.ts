import * as flags from "https://deno.land/std@0.150.0/flags/mod.ts";

export async function run(rawArgs: string[]): Promise<boolean> {
  const server = Deno.listen({ transport: "tcp", port: 0 });
  try {
    const command = buildCommand(rawArgs, server.addr as Deno.NetAddr);
    const process = Deno.run({ cmd: command });
    const status = await process.status();
    process.close();
    if (!status.success) {
      return false;
    }
    return await receiveOne(server);
  } finally {
    server.close();
  }
}

export function buildCommand(
  rawArgs: string[],
  address: Deno.NetAddr,
): string[] {
  const parsed = flags.parse(rawArgs);
  const args = parsed._.map((e) => {
    return e.toString();
  });

  const lastArg = args.at(-1) ?? "";
  const serverAddress = `${address.hostname}:${address.port}`;
  return args.map((e) => {
    return e
      .replaceAll("{argument}", lastArg)
      .replaceAll("{serverAddress}", serverAddress);
  });
}

export async function receiveOne(server: Deno.Listener): Promise<boolean> {
  const connection = await server.accept();
  for await (const rawMessage of connection.readable) {
    const message = new TextDecoder().decode(rawMessage);
    connection.close();
    return message === "done";
  }
  return false;
}
