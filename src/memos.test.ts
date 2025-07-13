import { beforeEach, describe, expect, it } from "vitest"
import { db } from "./db"
import {
  createMemo,
  deleteMemo,
  getMemo,
  getMemos,
  searchMemos,
  updateMemo,
} from "./memos"

describe("memo tool", () => {
  beforeEach(async () => {
    db.data.memos = []
    await db.write()
  })

  it("should create a memo", () => {
    const memo = createMemo("test title", "test memo")
    expect(memo.content).toBe("test memo")
    expect(memo.title).toBe("test title")
    expect(memo.createdAt).toBeInstanceOf(Date)
    expect(memo.updatedAt).toBeInstanceOf(Date)
    const memos = getMemos()
    expect(memos.length).toBe(1)
  })

  it("should get all memos", () => {
    createMemo("memo 1", "memo 1 content")
    createMemo("memo 2", "memo 2 content")
    const memos = getMemos()
    expect(memos.length).toBe(2)
  })

  it("should get a single memo", () => {
    const memo = createMemo("test title", "test memo")
    const foundMemo = getMemo(memo.id)
    expect(foundMemo?.content).toBe("test memo")
    expect(foundMemo?.title).toBe("test title")
  })

  it("should update a memo", async () => {
    const memo = createMemo("test title", "test memo")
    const updatedAt = memo.updatedAt

    await new Promise((resolve) => setTimeout(resolve, 100))

    const updatedMemo = updateMemo(memo.id, "updated title", "updated memo")
    expect(updatedMemo?.content).toBe("updated memo")
    expect(updatedMemo?.title).toBe("updated title")
    expect(updatedMemo?.updatedAt.getTime()).toBeGreaterThan(
      updatedAt.getTime(),
    )
    const foundMemo = getMemo(memo.id)
    expect(foundMemo?.content).toBe("updated memo")
    expect(foundMemo?.title).toBe("updated title")
  })

  it("should delete a memo", () => {
    const memo = createMemo("test title", "test memo")
    const deletedMemo = deleteMemo(memo.id)
    expect(deletedMemo?.content).toBe("test memo")
    const memos = getMemos()
    expect(memos.length).toBe(0)
  })

  it("should search memos", () => {
    createMemo("this is a test title", "this is a test memo")
    createMemo("another title", "another memo")
    const memosByContent = searchMemos({ query: "test memo" })
    expect(memosByContent.length).toBe(1)
    if (memosByContent[0]) {
      expect(memosByContent[0].content).toBe("this is a test memo")
    }

    const memosByTitle = searchMemos({ query: "test title" })
    expect(memosByTitle.length).toBe(1)
    if (memosByTitle[0]) {
      expect(memosByTitle[0].title).toBe("this is a test title")
    }
  })

  it("should search memos by date", async () => {
    const now = new Date()

    await new Promise((resolve) => setTimeout(resolve, 100))
    createMemo("memo 1", "memo 1 content")

    const middle = new Date()

    await new Promise((resolve) => setTimeout(resolve, 100))
    createMemo("memo 2", "memo 2 content")

    const memos = searchMemos({ start: now })
    expect(memos.length).toBe(2)

    const memos2 = searchMemos({ end: middle, start: now })
    expect(memos2.length).toBe(1)

    const memos3 = searchMemos({ end: now })
    expect(memos3.length).toBe(0)
  })
})
