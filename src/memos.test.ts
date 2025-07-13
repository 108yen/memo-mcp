import { describe, expect, it } from "vitest"
import { setup } from "../tests/vitest.setup"
import {
  createMemo,
  deleteMemo,
  getMemo,
  getMemos,
  searchMemos,
  updateMemo,
} from "./memos"

setup()

describe("memo tool", () => {
  it("should create a memo", async () => {
    const memo = await createMemo("test title", "test memo")

    expect(memo.content).toBe("test memo")
    expect(memo.title).toBe("test title")
    expect(memo.createdAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    )
    expect(memo.updatedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    )

    const memos = await getMemos()

    expect(memos.length).toBe(1)
  })

  it("should get all memos", async () => {
    await createMemo("memo 1", "memo 1 content")
    await createMemo("memo 2", "memo 2 content")
    const memos = await getMemos()

    expect(memos.length).toBe(2)
  })

  it("should get a single memo", async () => {
    const memo = await createMemo("test title", "test memo")
    const foundMemo = await getMemo(memo.id)

    expect(foundMemo?.content).toBe("test memo")
    expect(foundMemo?.title).toBe("test title")
  })

  it("should update a memo", async () => {
    const memo = await createMemo("test title", "test memo")
    const updatedAt = new Date(memo.updatedAt)

    const updatedMemo = await updateMemo(
      memo.id,
      "updated title",
      "updated memo",
    )

    expect(updatedMemo).toBeDefined()
    expect(updatedMemo!.content).toBe("updated memo")
    expect(updatedMemo!.title).toBe("updated title")
    expect(new Date(updatedMemo!.updatedAt).getTime()).toBeGreaterThan(
      updatedAt.getTime(),
    )

    const foundMemo = await getMemo(memo.id)

    expect(foundMemo?.content).toBe("updated memo")
    expect(foundMemo?.title).toBe("updated title")
  })

  it("should delete a memo", async () => {
    const memo = await createMemo("test title", "test memo")
    const deletedMemo = await deleteMemo(memo.id)

    expect(deletedMemo?.content).toBe("test memo")

    const memos = await getMemos()

    expect(memos.length).toBe(0)
  })

  it("should search memos", async () => {
    await createMemo("this is a test title", "this is a test memo")
    await createMemo("another title", "another memo")
    const memosByContent = await searchMemos({ query: "test memo" })

    expect(memosByContent.length).toBe(1)
    expect(memosByContent[0]!.content).toBe("this is a test memo")

    const memosByTitle = await searchMemos({ query: "test title" })
    expect(memosByTitle.length).toBe(1)
    expect(memosByTitle[0]!.title).toBe("this is a test title")
  })

  it("should search memos by date", async () => {
    const now = new Date()

    await new Promise((resolve) => setTimeout(resolve, 100))
    await createMemo("memo 1", "memo 1 content")

    const middle = new Date()

    await new Promise((resolve) => setTimeout(resolve, 100))
    await createMemo("memo 2", "memo 2 content")

    const memos = await searchMemos({ start: now })
    expect(memos.length).toBe(2)

    const memos2 = await searchMemos({ end: middle, start: now })
    expect(memos2.length).toBe(1)

    const memos3 = await searchMemos({ end: now })
    expect(memos3.length).toBe(0)
  })
})
