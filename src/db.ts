import { Low } from "lowdb"
import { JSONFile } from "lowdb/node"
import { envSchema } from "./schemas"

interface Memo {
  content: string
  id: string
}

interface Schema {
  memos: Memo[]
}

const env = envSchema.parse(process.env)

const adapter = new JSONFile<Schema>(env.DB_PATH)
const defaultData: Schema = { memos: [] }

export const db = new Low(adapter, defaultData)
