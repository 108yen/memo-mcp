import { nanoid } from "nanoid"
import type { SearchMemosParams } from "./schemas"
import { db } from "./db"

export const createMemo = (title: string, content: string) => {
  const now = new Date().toISOString()

  const newMemo = {
    content,
    createdAt: now,
    id: nanoid(),
    title,
    updatedAt: now,
  }
  db.data.memos.push(newMemo)
  db.write()
  return newMemo
}

export const getMemos = () => {
  return db.data.memos
}

export const getMemo = (id: string) => {
  return db.data.memos.find((memo) => memo.id === id)
}

export const updateMemo = (id: string, title: string, content: string) => {
  const memo = db.data.memos.find((memo) => memo.id === id)
  if (memo) {
    memo.content = content
    memo.title = title
    memo.updatedAt = new Date().toISOString()

    db.write()
    return memo
  }
  return null
}

export const deleteMemo = (id: string) => {
  const index = db.data.memos.findIndex((memo) => memo.id === id)
  if (index !== -1) {
    const [deletedMemo] = db.data.memos.splice(index, 1)
    db.write()
    return deletedMemo
  }
  return null
}

export const searchMemos = (params: SearchMemosParams) => {
  const { end, query, start } = params
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
