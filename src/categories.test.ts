import { beforeEach, describe, expect, it } from "vitest"
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "./categories"
import { db } from "./db"
import { createMemo } from "./memos"

describe("categories", () => {
  beforeEach(async () => {
    db.data = { categories: [], memos: [] }
    await db.write()
  })

  it("should create a category", async () => {
    const category = await createCategory({ name: "test" })
    expect(category.name).toBe("test")
    expect(db.data.categories.length).toBe(1)
  })

  it("should get all categories", async () => {
    await createCategory({ name: "test1" })
    await createCategory({ name: "test2" })
    const categories = await getCategories()
    expect(categories.length).toBe(2)
  })

  it("should get a category by id", async () => {
    const category = await createCategory({ name: "test" })
    const found = await getCategory(category.id)
    expect(found?.name).toBe("test")
  })

  it("should update a category", async () => {
    const category = await createCategory({ name: "test" })
    const updated = await updateCategory(category.id, { name: "updated" })
    if (updated) {
      expect(updated.name).toBe("updated")
    }
    if (db.data.categories[0]) {
      expect(db.data.categories[0].name).toBe("updated")
    }
  })

  it("should delete a category and update memos", async () => {
    const category = await createCategory({ name: "test" })
    const memo = await createMemo({
      categoryId: category.id,
      content: "content",
      title: "memo",
    })!

    await deleteCategory(category.id)

    expect(db.data.categories.length).toBe(0)
    const updatedMemo = db.data.memos.find((m) => m.id === memo.id)!
    expect(updatedMemo.categoryId).toBeUndefined()
  })
})
