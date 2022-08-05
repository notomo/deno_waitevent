await main(Deno.args[0], Deno.args[1]);

async function main(address: string, message: string) {
  const [hostname, port] = address.split(":");
  const connection = await Deno.connect({
    hostname: hostname,
    port: Number(port),
  });
  await connection.write(new TextEncoder().encode(message));
}
