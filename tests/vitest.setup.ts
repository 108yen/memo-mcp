import { afterAll, beforeEach } from "vitest"
import { db } from "../src/db"

export function setup() {
  beforeEach(async () => {
    db.data.memos = []
    db.data.categories = []
    await db.write()
  })

  afterAll(async () => {
    db.data.memos = []
    db.data.categories = []
    await db.write()
  })
}
