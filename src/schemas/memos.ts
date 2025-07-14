import { z } from "zod"

export const MemoSchema = z.object({
  categoryId: z.string().optional(),
  content: z.string(),
  createdAt: z
    .string()
    .datetime()
    .transform((date) => new Date(date))
    .describe(
      "The date when the memo was created. Display in ISO 8601 format, UTC+0 timezone.",
    ),
  id: z.string(),
  title: z.string(),
  updatedAt: z
    .string()
    .datetime()
    .transform((date) => new Date(date))
    .describe(
      "The date when the memo was last updated. Display in ISO 8601 format, UTC+0 timezone.",
    ),
})

export type Memo = z.input<typeof MemoSchema>

export const CreateMemoSchema = z.object({
  categoryId: z.string().optional(),
  content: z.string(),
  title: z.string(),
})

export type CreateMemo = z.infer<typeof CreateMemoSchema>

export const UpdateMemoSchema = z.object({
  categoryId: z.string().optional(),
  content: z.string().optional(),
  title: z.string().optional(),
})

export type UpdateMemo = z.infer<typeof UpdateMemoSchema>

export const SearchMemosSchema = z.object({
  categoryId: z.string().optional(),
  end: z
    .string()
    .datetime({
      message: "Invalid date format. Please use ISO 8601 format.",
      offset: true,
    })
    .transform((date) => new Date(date))
    .optional()
    .describe(
      "End date for the search range use ISO 8601 format. ex: 2020-02-01T00:00:00+09:00",
    ),
  query: z.string().optional(),
  start: z
    .string()
    .datetime({
      message: "Invalid date format. Please use ISO 8601 format.",
      offset: true,
    })
    .transform((date) => new Date(date))
    .optional()
    .describe(
      "Start date for the search range use ISO 8601 format. ex: 2020-01-01T00:00:00+09:00",
    ),
})

export type SearchMemosParams = z.infer<typeof SearchMemosSchema>
