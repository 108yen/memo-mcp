import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { version } from "../package.json"

const server = new McpServer({
  name: "memo-mcp",
  version,
})

// This is a simple example of a tool that adds two numbers together.
// server.registerTool(
//   "add",
//   {
//     description: "Add two numbers",
//     inputSchema: {
//       a: z.number().describe("The first number"),
//       b: z.number().describe("The second number"),
//     },
//     title: "Addition Tool",
//   },
//   ({ a, b }) => ({
//     content: [{ text: String(a + b), type: "text" }],
//   }),
// )

export async function run() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}
