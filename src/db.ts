import { Low } from "lowdb"
import { JSONFile } from "lowdb/node"

interface Memo {
  content: string
  id: string
}

interface Schema {
  memos: Memo[]
}

const adapter = new JSONFile<Schema>("db.json")
const defaultData: Schema = { memos: [] }
export const db = new Low(adapter, defaultData)

await db.read()
