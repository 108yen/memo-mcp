import { z } from "zod"

export const CategorySchema = z.object({
  createdAt: z.string().datetime(),
  id: z.string().uuid(),
  name: z.string().min(1),
  updatedAt: z.string().datetime(),
})

export type Category = z.infer<typeof CategorySchema>

export const CreateCategorySchema = z.object({
  name: z.string().min(1),
})

export type CreateCategory = z.infer<typeof CreateCategorySchema>

export const UpdateCategorySchema = z.object({
  name: z.string().min(1).optional(),
})

export type UpdateCategory = z.infer<typeof UpdateCategorySchema>
