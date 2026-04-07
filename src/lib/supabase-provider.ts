import { createClient } from "./supabase";
import type { DataProvider } from "./api";
import type { Category, Todo, Completion } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function createSupabaseProvider(): DataProvider {
  const supabase = createClient();

  return {
    async fetchCategories(): Promise<Category[]> {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, color, sort_order")
        .order("sort_order");

      if (error) throw new Error(error.message);
      return (data ?? []).map((row: any) => ({
        id: row.id,
        name: row.name,
        color: row.color,
        sortOrder: row.sort_order,
      }));
    },

    async createCategory(catData): Promise<Category> {
      const user = await getCurrentUser();
      const { data: row, error } = await supabase
        .from("categories")
        .insert({
          user_id: user.id,
          name: catData.name,
          color: catData.color,
          sort_order: catData.sortOrder,
        })
        .select("id, name, color, sort_order")
        .single();

      if (error || !row) throw new Error(error?.message ?? "Insert failed");
      return { id: (row as any).id, name: (row as any).name, color: (row as any).color, sortOrder: (row as any).sort_order };
    },

    async fetchTodos(): Promise<Todo[]> {
      const { data, error } = await supabase
        .from("todos")
        .select("id, category_id, title, start_date, end_date, is_routine, routine_days, routine_end_date, sort_order")
        .order("sort_order");

      if (error) throw new Error(error.message);
      return (data ?? []).map((row: any) => mapTodo(row));
    },

    async createTodo(todoData): Promise<Todo> {
      const user = await getCurrentUser();
      const { data: row, error } = await supabase
        .from("todos")
        .insert({
          user_id: user.id,
          category_id: todoData.categoryId,
          title: todoData.title,
          start_date: todoData.startDate,
          end_date: todoData.endDate,
          is_routine: todoData.isRoutine,
          routine_days: todoData.routineDays,
          routine_end_date: todoData.routineEndDate,
          sort_order: todoData.sortOrder,
        })
        .select("id, category_id, title, start_date, end_date, is_routine, routine_days, routine_end_date, sort_order")
        .single();

      if (error || !row) throw new Error(error?.message ?? "Insert failed");
      return mapTodo(row as any);
    },

    async updateTodo(id, updates): Promise<Todo> {
      const updateData: Record<string, unknown> = {};
      if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId;
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.startDate !== undefined) updateData.start_date = updates.startDate;
      if (updates.endDate !== undefined) updateData.end_date = updates.endDate;
      if (updates.isRoutine !== undefined) updateData.is_routine = updates.isRoutine;
      if (updates.routineDays !== undefined) updateData.routine_days = updates.routineDays;
      if (updates.routineEndDate !== undefined) updateData.routine_end_date = updates.routineEndDate;
      if (updates.sortOrder !== undefined) updateData.sort_order = updates.sortOrder;

      const { data: row, error } = await supabase
        .from("todos")
        .update(updateData)
        .eq("id", id)
        .select("id, category_id, title, start_date, end_date, is_routine, routine_days, routine_end_date, sort_order")
        .single();

      if (error || !row) throw new Error(error?.message ?? "Update failed");
      return mapTodo(row as any);
    },

    async deleteTodo(id): Promise<void> {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },

    async fetchCompletions(): Promise<Completion[]> {
      const { data, error } = await supabase
        .from("completions")
        .select("id, todo_id, completed_date");

      if (error) throw new Error(error.message);
      return (data ?? []).map((row: any) => ({
        id: row.id,
        todoId: row.todo_id,
        completedDate: row.completed_date,
      }));
    },

    async toggleCompletion(todoId, date): Promise<void> {
      const { data: existing } = await supabase
        .from("completions")
        .select("id")
        .eq("todo_id", todoId)
        .eq("completed_date", date)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase.from("completions").delete().eq("id", (existing as any).id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("completions").insert({ todo_id: todoId, completed_date: date });
        if (error) throw new Error(error.message);
      }
    },
  };

  async function getCurrentUser() {
    const result = await supabase.auth.getUser();
    if (result.error || !result.data.user) throw new Error("Not authenticated");
    return result.data.user;
  }
}

function mapTodo(row: any): Todo {
  return {
    id: row.id,
    categoryId: row.category_id,
    title: row.title,
    startDate: row.start_date,
    endDate: row.end_date,
    isRoutine: row.is_routine,
    routineDays: row.routine_days,
    routineEndDate: row.routine_end_date,
    sortOrder: row.sort_order,
  };
}
