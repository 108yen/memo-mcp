import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp"
import { z } from "zod"
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../categories"
import {
  createMemo,
  deleteMemo,
  getMemo,
  getMemos,
  searchMemos,
  updateMemo,
} from "../memos"
import {
  CategorySchema,
  CreateCategorySchema,
  CreateMemoSchema,
  MemoSchema,
  SearchMemosSchema,
  UpdateCategorySchema,
  UpdateMemoSchema,
} from "../schemas"

export function registerTools(server: McpServer) {
  server.registerTool(
    "createMemo",
    {
      description: "Create a new memo",
      inputSchema: CreateMemoSchema.shape,
      outputSchema: { memo: MemoSchema },
      title: "Create Memo",
    },
    async (memo) => {
      const newMemo = await createMemo(memo)
      return {
        content: [{ text: JSON.stringify(newMemo), type: "text" }],
        structuredContent: { memo: newMemo },
      }
    },
  )

  server.registerTool(
    "getMemos",
    {
      description: "Get all memos",
      inputSchema: {},
      outputSchema: { memos: z.array(MemoSchema) },
      title: "Get Memos",
    },
    async () => {
      const memos = await getMemos()
      return {
        content: [{ text: JSON.stringify(memos), type: "text" }],
        structuredContent: { memos },
      }
    },
  )

  server.registerTool(
    "getMemo",
    {
      description: "Get a single memo by ID",
      inputSchema: {
        id: z.string().describe("The ID of the memo"),
      },
      outputSchema: { memo: MemoSchema },
      title: "Get Memo",
    },
    async ({ id }) => {
      const memo = await getMemo(id)
      if (!memo) {
        return {
          content: [{ text: "Memo not found", type: "text" }],
          isError: true,
        }
      }

      return {
        content: [{ text: JSON.stringify(memo), type: "text" }],
        structuredContent: { memo },
      }
    },
  )

  server.registerTool(
    "updateMemo",
    {
      description: "Update a memo",
      inputSchema: {
        id: z.string().describe("The ID of the memo"),
        ...UpdateMemoSchema.shape,
      },
      outputSchema: { memo: MemoSchema },
      title: "Update Memo",
    },
    async ({ id, ...memo }) => {
      const updatedMemo = await updateMemo(id, memo)
      if (!updatedMemo) {
        return {
          content: [{ text: "Memo not found", type: "text" }],
          isError: true,
        }
      }

      return {
        content: [{ text: JSON.stringify(updatedMemo), type: "text" }],
        structuredContent: { memo: updatedMemo },
      }
    },
  )

  server.registerTool(
    "deleteMemo",
    {
      description: "Delete a memo",
      inputSchema: {
        id: z.string().describe("The ID of the memo"),
      },
      outputSchema: { memo: MemoSchema },
      title: "Delete Memo",
    },
    async ({ id }) => {
      const deletedMemo = await deleteMemo(id)
      if (!deletedMemo) {
        return {
          content: [{ text: "Memo not found", type: "text" }],
          isError: true,
        }
      }

      return {
        content: [{ text: JSON.stringify(deletedMemo), type: "text" }],
        structuredContent: { memo: deletedMemo },
      }
    },
  )

  server.registerTool(
    "searchMemos",
    {
      description: "Search memos by keyword and date range",
      inputSchema: SearchMemosSchema.shape,
      outputSchema: { memos: z.array(MemoSchema) },
      title: "Search Memos",
    },
    async (params) => {
      const memos = await searchMemos(params)
      return {
        content: [{ text: JSON.stringify(memos), type: "text" }],
        structuredContent: { memos },
      }
    },
  )

  server.registerTool(
    "createCategory",
    {
      description: "Create a new category",
      inputSchema: CreateCategorySchema.shape,
      outputSchema: { category: CategorySchema },
      title: "Create Category",
    },
    async (category) => {
      const newCategory = await createCategory(category)
      return {
        content: [{ text: JSON.stringify(newCategory), type: "text" }],
        structuredContent: { category: newCategory },
      }
    },
  )

  server.registerTool(
    "getCategories",
    {
      description: "Get all categories",
      inputSchema: {},
      outputSchema: { categories: z.array(CategorySchema) },
      title: "Get Categories",
    },
    async () => {
      const categories = await getCategories()
      return {
        content: [{ text: JSON.stringify(categories), type: "text" }],
        structuredContent: { categories },
      }
    },
  )

  server.registerTool(
    "getCategory",
    {
      description: "Get a single category by ID",
      inputSchema: {
        id: z.string().describe("The ID of the category"),
      },
      outputSchema: { category: CategorySchema },
      title: "Get Category",
    },
    async ({ id }) => {
      const category = await getCategory(id)
      if (!category) {
        return {
          content: [{ text: "Category not found", type: "text" }],
          isError: true,
        }
      }

      return {
        content: [{ text: JSON.stringify(category), type: "text" }],
        structuredContent: { category },
      }
    },
  )

  server.registerTool(
    "updateCategory",
    {
      description: "Update a category",
      inputSchema: {
        id: z.string().describe("The ID of the category"),
        ...UpdateCategorySchema.shape,
      },
      outputSchema: { category: CategorySchema },
      title: "Update Category",
    },
    async ({ id, ...category }) => {
      const updatedCategory = await updateCategory(id, category)
      if (!updatedCategory) {
        return {
          content: [{ text: "Category not found", type: "text" }],
          isError: true,
        }
      }

      return {
        content: [{ text: JSON.stringify(updatedCategory), type: "text" }],
        structuredContent: { category: updatedCategory },
      }
    },
  )

  server.registerTool(
    "deleteCategory",
    {
      description: "Delete a category",
      inputSchema: {
        id: z.string().describe("The ID of the category"),
      },
      outputSchema: { category: CategorySchema },
      title: "Delete Category",
    },
    async ({ id }) => {
      const deletedCategory = await deleteCategory(id)
      if (!deletedCategory) {
        return {
          content: [{ text: "Category not found", type: "text" }],
          isError: true,
        }
      }

      return {
        content: [{ text: JSON.stringify(deletedCategory), type: "text" }],
        structuredContent: { category: deletedCategory },
      }
    },
  )
}
