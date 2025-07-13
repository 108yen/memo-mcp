import z from "zod"

export const envSchema = z.object({
  DB_PATH: z
    .string({ message: "PATH should be a string" })
    .endsWith(".json", {
      message: "PATH should be a valid JSON file name",
    })
    .or(z.string().default("memo.json")),
})
