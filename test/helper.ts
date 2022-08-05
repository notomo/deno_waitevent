import * as path from "https://deno.land/std@0.150.0/path/mod.ts";

type Client = {
  server: Deno.Listener;
  connection: Deno.TcpConn;
};

type Teardown = () => void;

export async function testClient(): Promise<[Client, Teardown]> {
  const server = Deno.listen({ transport: "tcp", port: 0 });
  const address = server.addr as Deno.NetAddr;

  const connection = await Deno.connect({
    hostname: address.hostname,
    port: address.port,
  });

  const client = {
    server: server,
    connection: connection,
  };
  const teardown = () => {
    connection.close();
    server.close();
  };
  return [client, teardown];
}

export function testEditor(): string[] {
  const editor = path.join(
    path.dirname(import.meta.url),
    "_editor.ts",
  );
  return [
    "--",
    "deno",
    "run",
    "--allow-run",
    "--allow-net",
    editor,
  ];
}
