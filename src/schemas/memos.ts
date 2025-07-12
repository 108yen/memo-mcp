import { z } from "zod"

export const MemoSchema = z.object({
  content: z.string(),
  createdAt: z.date(),
  id: z.string(),
  title: z.string(),
  updatedAt: z.date(),
})

export type Memo = z.infer<typeof MemoSchema>
