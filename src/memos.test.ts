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
    const memo = createMemo("test memo")
    expect(memo.content).toBe("test memo")
    const memos = getMemos()
    expect(memos.length).toBe(1)
  })

  it("should get all memos", () => {
    createMemo("memo 1")
    createMemo("memo 2")
    const memos = getMemos()
    expect(memos.length).toBe(2)
  })

  it("should get a single memo", () => {
    const memo = createMemo("test memo")
    const foundMemo = getMemo(memo.id)
    expect(foundMemo?.content).toBe("test memo")
  })

  it("should update a memo", () => {
    const memo = createMemo("test memo")
    const updatedMemo = updateMemo(memo.id, "updated memo")
    expect(updatedMemo?.content).toBe("updated memo")
    const foundMemo = getMemo(memo.id)
    expect(foundMemo?.content).toBe("updated memo")
  })

  it("should delete a memo", () => {
    const memo = createMemo("test memo")
    const deletedMemo = deleteMemo(memo.id)
    expect(deletedMemo?.content).toBe("test memo")
    const memos = getMemos()
    expect(memos.length).toBe(0)
  })

  it("should search memos", () => {
    createMemo("this is a test memo")
    createMemo("another memo")
    const memos = searchMemos("test")
    expect(memos.length).toBe(1)
    if (memos[0]) {
      expect(memos[0].content).toBe("this is a test memo")
    }
  })
})
