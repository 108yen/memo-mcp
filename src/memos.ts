import { nanoid } from "nanoid"
import type { CreateMemo, SearchMemosParams, UpdateMemo } from "./schemas"
import { db } from "./db"

export const createMemo = async (memo: CreateMemo) => {
  const now = new Date().toISOString()

  const newMemo = {
    ...memo,
    createdAt: now,
    id: nanoid(),
    updatedAt: now,
  }
  db.data.memos.push(newMemo)
  await db.write()

  return newMemo
}

export const getMemos = async () => {
  await db.read()
  return db.data.memos
}

export const getMemo = async (id: string) => {
  await db.read()
  return db.data.memos.find((memo) => memo.id === id)
}

export const updateMemo = async (id: string, memo: UpdateMemo) => {
  await db.read()
  const index = db.data.memos.findIndex((memo) => memo.id === id)
  if (index !== -1) {
    const existingMemo = db.data.memos[index]
    if (!existingMemo) {
      return undefined
    }
    const newMemo = {
      ...existingMemo,
      ...memo,
      createdAt: existingMemo.createdAt,
      id: existingMemo.id,
      updatedAt: new Date().toISOString(),
    }
    db.data.memos[index] = newMemo
    await db.write()
    return newMemo
  }
  return null
}

export const deleteMemo = async (id: string) => {
  await db.read()
  const index = db.data.memos.findIndex((memo) => memo.id === id)
  if (index !== -1) {
    const [deletedMemo] = db.data.memos.splice(index, 1)
    await db.write()
    return deletedMemo
  }
  return null
}

export const searchMemos = async (params: SearchMemosParams) => {
  const { categoryId, end, query, start } = params
  await db.read()

  return db.data.memos.filter((memo) => {
    if (query && !memo.content.includes(query) && !memo.title.includes(query)) {
      return false
    }

    if (categoryId && memo.categoryId !== categoryId) {
      return false
    }

    const updatedAt = new Date(memo.updatedAt).getTime()

    if (start && updatedAt < start.getTime()) {
      return false
    }
    if (end && updatedAt > end.getTime()) {
      return false
    }
    return true
  })
}
