import { describe, expect, it } from "vitest"
import { setup } from "../../tests/vitest.setup"
import { createCategory } from "./categories"
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
    const memo = await createMemo({ content: "test memo", title: "test title" })

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
    await createMemo({ content: "memo 1 content", title: "memo 1" })
    await createMemo({ content: "memo 2 content", title: "memo 2" })
    const memos = await getMemos()

    expect(memos.length).toBe(2)
  })

  it("should get a single memo", async () => {
    const memo = await createMemo({ content: "test memo", title: "test title" })
    const foundMemo = await getMemo(memo.id)

    expect(foundMemo?.content).toBe("test memo")
    expect(foundMemo?.title).toBe("test title")
  })

  it("should update a memo", async () => {
    const memo = await createMemo({ content: "test memo", title: "test title" })
    const updatedAt = new Date(memo.updatedAt)

    await new Promise((resolve) => setTimeout(resolve, 100))

    const updatedMemo = await updateMemo(memo.id, {
      content: "updated memo",
      title: "updated title",
    })

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
    const memo = await createMemo({ content: "test memo", title: "test title" })
    const deletedMemo = await deleteMemo(memo.id)

    expect(deletedMemo?.content).toBe("test memo")

    const memos = await getMemos()

    expect(memos.length).toBe(0)
  })

  it("should search memos", async () => {
    await createMemo({
      content: "this is a test memo",
      title: "this is a test title",
    })
    await createMemo({ content: "another memo", title: "another title" })
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
    await createMemo({ content: "memo 1 content", title: "memo 1" })

    const middle = new Date()

    await new Promise((resolve) => setTimeout(resolve, 100))
    await createMemo({ content: "memo 2 content", title: "memo 2" })

    const memos = await searchMemos({ start: now })
    expect(memos.length).toBe(2)

    const memos2 = await searchMemos({ end: middle, start: now })
    expect(memos2.length).toBe(1)

    const memos3 = await searchMemos({ end: now })
    expect(memos3.length).toBe(0)
  })

  it("should search memos by category", async () => {
    const category1 = await createCategory({ name: "category1" })
    const category2 = await createCategory({ name: "category2" })

    await createMemo({
      categoryId: category1.id,
      content: "memo 1 content",
      title: "memo 1",
    })
    await createMemo({
      categoryId: category2.id,
      content: "memo 2 content",
      title: "memo 2",
    })
    await createMemo({ content: "memo 3 content", title: "memo 3" })

    const memos = await searchMemos({ categoryId: category1.id })
    expect(memos.length).toBe(1)
    expect(memos[0]?.title).toBe("memo 1")
  })
})
