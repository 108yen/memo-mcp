import { Low } from "lowdb"
import { JSONFile } from "lowdb/node"
import type { Category, Memo } from "./schemas"
import { envSchema } from "./schemas"

interface Schema {
  categories: Category[]
  memos: Memo[]
}

const env = envSchema.parse(process.env)

const adapter = new JSONFile<Schema>(env.DB_PATH)
const defaultData: Schema = { categories: [], memos: [] }

export const db = new Low(adapter, defaultData)
