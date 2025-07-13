import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { version } from "../package.json"
import { CONSTANTS } from "./constant"
import { db } from "./db"
import {
  createMemo,
  deleteMemo,
  getMemo,
  getMemos,
  searchMemos,
  updateMemo,
} from "./memos"
import { SearchMemosSchema } from "./schemas"

const server = new McpServer(
  {
    name: "memo-mcp",
    version,
  },
  {
    instructions: CONSTANTS.MCP.INSTRUCTIONS,
  },
)

server.registerTool(
  "createMemo",
  {
    description: "Create a new memo",
    inputSchema: {
      content: z.string().describe("The content of the memo"),
      title: z.string().describe("The title of the memo"),
    },
    title: "Create Memo",
  },
  ({ content, title }) => {
    const newMemo = createMemo(title, content)
    return {
      content: [{ text: JSON.stringify(newMemo), type: "text" }],
    }
  },
)

server.registerTool(
  "getMemos",
  {
    description: "Get all memos",
    inputSchema: {},
    title: "Get Memos",
  },
  () => {
    const memos = getMemos()
    return {
      content: [{ text: JSON.stringify(memos), type: "text" }],
    }
  },
)

server.registerTool(
  "getMemo",
  {
    description: "Get a single memo by ID",
    inputSchema: {
      id: z.string().describe("The ID of the memo"),
    },
    title: "Get Memo",
  },
  ({ id }) => {
    const memo = getMemo(id)
    return {
      content: [{ text: JSON.stringify(memo), type: "text" }],
    }
  },
)

server.registerTool(
  "updateMemo",
  {
    description: "Update a memo",
    inputSchema: {
      content: z.string().describe("The new content of the memo"),
      id: z.string().describe("The ID of the memo"),
      title: z.string().describe("The new title of the memo"),
    },
    title: "Update Memo",
  },
  ({ content, id, title }) => {
    const updatedMemo = updateMemo(id, title, content)
    return {
      content: [{ text: JSON.stringify(updatedMemo), type: "text" }],
    }
  },
)

server.registerTool(
  "deleteMemo",
  {
    description: "Delete a memo",
    inputSchema: {
      id: z.string().describe("The ID of the memo"),
    },
    title: "Delete Memo",
  },
  ({ id }) => {
    const deletedMemo = deleteMemo(id)
    return {
      content: [{ text: JSON.stringify(deletedMemo), type: "text" }],
    }
  },
)

server.registerTool(
  "searchMemos",
  {
    description: "Search memos by keyword and date range",
    inputSchema: SearchMemosSchema.shape,
    title: "Search Memos",
  },
  (params) => {
    const memos = searchMemos(params)
    return {
      content: [{ text: JSON.stringify(memos), type: "text" }],
    }
  },
)

export async function run() {
  await db.read()

  const transport = new StdioServerTransport()
  await server.connect(transport)
}
