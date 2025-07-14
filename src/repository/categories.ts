import { nanoid } from "nanoid"
import type { Category, CreateCategory, UpdateCategory } from "../schemas"
import { db } from "../db"

export const createCategory = async (
  category: CreateCategory,
): Promise<Category> => {
  const now = new Date().toISOString()
  const newCategory: Category = {
    ...category,
    createdAt: now,
    id: nanoid(),
    updatedAt: now,
  }
  db.data.categories.push(newCategory)
  await db.write()
  return newCategory
}

export const getCategories = async (): Promise<Category[]> => {
  await db.read()
  return db.data.categories
}

export const getCategory = async (
  id: string,
): Promise<Category | undefined> => {
  await db.read()
  return db.data.categories.find((c) => c.id === id)
}

export const updateCategory = async (
  id: string,
  category: UpdateCategory,
): Promise<Category | undefined> => {
  const index = db.data.categories.findIndex((c) => c.id === id)
  if (index === -1) {
    return undefined
  }
  const now = new Date().toISOString()
  const existingCategory = db.data.categories[index]
  if (!existingCategory) {
    return undefined
  }
  const newCategory: Category = {
    ...existingCategory,
    createdAt: existingCategory.createdAt,
    id: existingCategory.id,
    name: category.name || existingCategory.name,
    updatedAt: now,
  }
  db.data.categories[index] = newCategory
  await db.write()
  return newCategory
}

export const deleteCategory = async (
  id: string,
): Promise<Category | undefined> => {
  const index = db.data.categories.findIndex((c) => c.id === id)
  if (index === -1) {
    return undefined
  }
  const deletedCategory = db.data.categories.splice(index, 1)[0]
  // メモからカテゴリー情報を削除
  db.data.memos.forEach((memo) => {
    if (memo.categoryId === id) {
      memo.categoryId = undefined
    }
  })
  await db.write()
  return deletedCategory
}
