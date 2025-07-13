import { nanoid } from "nanoid"
import type { SearchMemosParams } from "./schemas"
import { db } from "./db"

export const createMemo = async (title: string, content: string) => {
  const now = new Date().toISOString()

  const newMemo = {
    content,
    createdAt: now,
    id: nanoid(),
    title,
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

export const updateMemo = async (
  id: string,
  title: string,
  content: string,
) => {
  await db.read()
  const memo = db.data.memos.find((memo) => memo.id === id)
  if (memo) {
    memo.content = content
    memo.title = title
    memo.updatedAt = new Date().toISOString()

    await db.write()
    return memo
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
  const { end, query, start } = params
  await db.read()

  return db.data.memos.filter((memo) => {
    if (query && !memo.content.includes(query) && !memo.title.includes(query)) {
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
