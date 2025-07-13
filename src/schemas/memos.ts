import { z } from "zod"

export const MemoSchema = z.object({
  content: z.string(),
  createdAt: z.date(),
  id: z.string(),
  title: z.string(),
  updatedAt: z.date(),
})

export type Memo = z.infer<typeof MemoSchema>

export const SearchMemosSchema = z.object({
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
