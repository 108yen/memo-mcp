import { nanoid } from "nanoid"
import { db } from "./db"

export const createMemo = (content: string) => {
  const newMemo = { content, id: nanoid() }
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

export const updateMemo = (id: string, content: string) => {
  const memo = db.data.memos.find((memo) => memo.id === id)
  if (memo) {
    memo.content = content
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

export const searchMemos = (query: string) => {
  return db.data.memos.filter((memo) => memo.content.includes(query))
}
