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
    describe("createMemo", () => {
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

    describe("getMemos", () => {
      it("should return empty array when no memos exist", async () => {
        const result = await client.callTool({
          arguments: {},
          name: "getMemos",
        })

        expect(result).toEqual({
          content: [{ text: "[]", type: "text" }],
          structuredContent: {
            memos: [],
          },
        })
      })

      it("should get all memos after creating one", async () => {
        await client.callTool({
          arguments: {
            content: "test memo",
            title: "test title",
          },
          name: "createMemo",
        })

        const result = await client.callTool({
          arguments: {},
          name: "getMemos",
        })

        expect(result).toEqual({
          content: [{ text: expect.any(String), type: "text" }],
          structuredContent: {
            memos: expect.arrayContaining([
              expect.objectContaining({
                content: "test memo",
                createdAt: expect.any(String),
                id: expect.any(String),
                title: "test title",
                updatedAt: expect.any(String),
              }),
            ]),
          },
        })
      })
    })

    describe("getMemo", () => {
      it("should return error when no memo exists match id", async () => {
        const result = await client.callTool({
          arguments: {
            id: "non-existent-id",
          },
          name: "getMemo",
        })

        expect(result).toEqual({
          content: [{ text: "Memo not found", type: "text" }],
          isError: true,
        })
      })

      it("should get a memo by ID", async () => {
        const createResult = await client.callTool({
          arguments: {
            content: "test memo",
            title: "test title",
          },
          name: "createMemo",
        })

        const createdMemoId = (createResult.structuredContent as any).memo.id

        const result = await client.callTool({
          arguments: {
            id: createdMemoId,
          },
          name: "getMemo",
        })

        expect(result).toEqual({
          content: [{ text: expect.any(String), type: "text" }],
          structuredContent: {
            memo: {
              content: "test memo",
              createdAt: expect.stringMatching(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
              ),
              id: createdMemoId,
              title: "test title",
              updatedAt: expect.stringMatching(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
              ),
            },
          },
        })
      })
    })

    describe("updateMemo", () => {
      it("should return error when updating non-existent memo", async () => {
        const result = await client.callTool({
          arguments: {
            content: "new content",
            id: "non-existent-id",
            title: "new title",
          },
          name: "updateMemo",
        })

        expect(result).toEqual({
          content: [{ text: "Memo not found", type: "text" }],
          isError: true,
        })
      })

      it("should update a memo", async () => {
        // メモを作成
        const createResult = await client.callTool({
          arguments: {
            content: "test memo",
            title: "test title",
          },
          name: "createMemo",
        })

        const createdMemoId = (createResult.structuredContent as any).memo.id

        const result = await client.callTool({
          arguments: {
            content: "updated content",
            id: createdMemoId,
            title: "updated title",
          },
          name: "updateMemo",
        })

        expect(result).toEqual({
          content: [{ text: expect.any(String), type: "text" }],
          structuredContent: {
            memo: {
              content: "updated content",
              createdAt: expect.stringMatching(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
              ),
              id: createdMemoId,
              title: "updated title",
              updatedAt: expect.stringMatching(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
              ),
            },
          },
        })
      })
    })

    describe("searchMemos", () => {
      it("should return empty array when no memos match search", async () => {
        const result = await client.callTool({
          arguments: {
            query: "non-existent-query",
          },
          name: "searchMemos",
        })

        expect(result).toEqual({
          content: [{ text: "[]", type: "text" }],
          structuredContent: {
            memos: [],
          },
        })
      })

      it("should search memos by query", async () => {
        // メモを作成
        await client.callTool({
          arguments: {
            content: "updated content",
            title: "updated title",
          },
          name: "createMemo",
        })

        const result = await client.callTool({
          arguments: {
            query: "updated",
          },
          name: "searchMemos",
        })

        expect(result).toEqual({
          content: [{ text: expect.any(String), type: "text" }],
          structuredContent: {
            memos: expect.arrayContaining([
              expect.objectContaining({
                content: "updated content",
                title: "updated title",
              }),
            ]),
          },
        })
      })

      it("should search memos with date range", async () => {
        // メモを作成
        const createResult = await client.callTool({
          arguments: {
            content: "test memo",
            title: "test title",
          },
          name: "createMemo",
        })

        const createdMemoId = (createResult.structuredContent as any).memo.id

        const now = new Date()
        const start = new Date(now.getTime() - 1000 * 60 * 60) // 1時間前
        const end = new Date(now.getTime() + 1000 * 60 * 60) // 1時間後

        const result = await client.callTool({
          arguments: {
            end: end.toISOString(),
            start: start.toISOString(),
          },
          name: "searchMemos",
        })

        expect(result).toEqual({
          content: [{ text: expect.any(String), type: "text" }],
          structuredContent: {
            memos: expect.arrayContaining([
              expect.objectContaining({
                id: createdMemoId,
              }),
            ]),
          },
        })
      })
    })

    describe("deleteMemo", () => {
      it("should return error when deleting non-existent memo", async () => {
        const result = await client.callTool({
          arguments: {
            id: "non-existent-id",
          },
          name: "deleteMemo",
        })

        expect(result).toEqual({
          content: [{ text: "Memo not found", type: "text" }],
          isError: true,
        })
      })

      it("should delete a memo", async () => {
        // メモを作成
        const createResult = await client.callTool({
          arguments: {
            content: "test memo",
            title: "test title",
          },
          name: "createMemo",
        })

        const createdMemoId = (createResult.structuredContent as any).memo.id

        const result = await client.callTool({
          arguments: {
            id: createdMemoId,
          },
          name: "deleteMemo",
        })

        expect(result).toEqual({
          content: [{ text: expect.any(String), type: "text" }],
          structuredContent: {
            memo: {
              content: "test memo",
              createdAt: expect.stringMatching(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
              ),
              id: createdMemoId,
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
})
