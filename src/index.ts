import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { version } from "../package.json"
import { CONSTANTS } from "./constant"
import {
  createMemo,
  deleteMemo,
  getMemo,
  getMemos,
  searchMemos,
  updateMemo,
} from "./memos"
import { MemoSchema, SearchMemosSchema } from "./schemas"

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
    outputSchema: { memo: MemoSchema },
    title: "Create Memo",
  },
  async ({ content, title }) => {
    const newMemo = await createMemo(title, content)
    return {
      content: [{ text: JSON.stringify(newMemo), type: "text" }],
      structuredContent: { memo: newMemo },
    }
  },
)

server.registerTool(
  "getMemos",
  {
    description: "Get all memos",
    inputSchema: {},
    outputSchema: { memos: z.array(MemoSchema) },
    title: "Get Memos",
  },
  async () => {
    const memos = await getMemos()
    return {
      content: [{ text: JSON.stringify(memos), type: "text" }],
      structuredContent: { memos },
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
    outputSchema: { memo: MemoSchema.optional() },
    title: "Get Memo",
  },
  async ({ id }) => {
    const memo = await getMemo(id)
    return {
      content: [{ text: JSON.stringify(memo), type: "text" }],
      structuredContent: { memo },
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
    outputSchema: { memo: MemoSchema },
    title: "Update Memo",
  },
  async ({ content, id, title }) => {
    const updatedMemo = await updateMemo(id, title, content)
    if (!updatedMemo) {
      return {
        content: [{ text: "Memo not found", type: "text" }],
        isError: true,
      }
    }

    return {
      content: [{ text: JSON.stringify(updatedMemo), type: "text" }],
      structuredContent: { memo: updatedMemo },
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
    outputSchema: { memo: MemoSchema },
    title: "Delete Memo",
  },
  async ({ id }) => {
    const deletedMemo = await deleteMemo(id)
    if (!deletedMemo) {
      return {
        content: [{ text: "Memo not found", type: "text" }],
        isError: true,
      }
    }

    return {
      content: [{ text: JSON.stringify(deletedMemo), type: "text" }],
      structuredContent: { memo: deletedMemo },
    }
  },
)

server.registerTool(
  "searchMemos",
  {
    description: "Search memos by keyword and date range",
    inputSchema: SearchMemosSchema.shape,
    outputSchema: { memos: z.array(MemoSchema) },
    title: "Search Memos",
  },
  async (params) => {
    const memos = await searchMemos(params)
    return {
      content: [{ text: JSON.stringify(memos), type: "text" }],
      structuredContent: { memos },
    }
  },
)

export async function run() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}
