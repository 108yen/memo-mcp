import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerTools, server } from "./server"

export async function run() {
  registerTools(server)

  const transport = new StdioServerTransport()
  await server.connect(transport)
}
