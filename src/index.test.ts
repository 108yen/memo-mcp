import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"
import { beforeAll, describe, expect, it } from "vitest"
import { setup } from "../tests/vitest.setup"
import { registerTools, server } from "./server"

setup()

describe("mcp test", () => {
  const client = new Client({
    name: "test client",
    version: "0.1.0",
  })

  beforeAll(async () => {
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair()

    registerTools(server)

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ])
  })

  describe("tools", () => {
    it("should create a memo", async () => {
      const result = await client.callTool({
        arguments: {
          content: "test memo",
          title: "test title",
        },
        name: "createMemo",
      })

      expect(result).toEqual({
        content: [{ text: expect.any(String), type: "text" }],
        structuredContent: {
          memo: {
            content: "test memo",
            createdAt: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
            ),
            id: expect.any(String),
            title: "test title",
            updatedAt: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
            ),
          },
        },
      })
    })
  })
})
