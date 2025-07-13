import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { version } from "../../package.json"
import { CONSTANTS } from "../constant"

export const server = new McpServer(
  {
    name: "memo-mcp",
    version,
  },
  {
    instructions: CONSTANTS.MCP.INSTRUCTIONS,
  },
)
