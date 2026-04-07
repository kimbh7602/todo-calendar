import { createClient } from "./supabase";
import type { DataProvider } from "./api";
import type { Category, Todo, Completion } from "@/types";

export function createSupabaseProvider(): DataProvider {
  const supabase = createClient();

  return {
    async fetchCategories(): Promise<Category[]> {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, color, sort_order")
        .order("sort_order");

      if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        color: row.color,
        sortOrder: row.sort_order,
      }));
    },

    async createCategory(data): Promise<Category> {
      const user = await getCurrentUser();
      const { data: row, error } = await supabase
        .from("categories")
        .insert({
          user_id: user.id,
          name: data.name,
          color: data.color,
          sort_order: data.sortOrder,
        })
        .select("id, name, color, sort_order")
        .single();

      if (error) throw new Error(`Failed to create category: ${error.message}`);
      return {
        id: row.id,
        name: row.name,
        color: row.color,
        sortOrder: row.sort_order,
      };
    },

    async fetchTodos(): Promise<Todo[]> {
      const { data, error } = await supabase
        .from("todos")
        .select("id, category_id, title, start_date, end_date, is_routine, routine_days, routine_end_date, sort_order")
        .order("sort_order");

      if (error) throw new Error(`Failed to fetch todos: ${error.message}`);
      return (data ?? []).map((row) => ({
        id: row.id,
        categoryId: row.category_id,
        title: row.title,
        startDate: row.start_date,
        endDate: row.end_date,
        isRoutine: row.is_routine,
        routineDays: row.routine_days,
        routineEndDate: row.routine_end_date,
        sortOrder: row.sort_order,
      }));
    },

    async createTodo(data): Promise<Todo> {
      const user = await getCurrentUser();
      const { data: row, error } = await supabase
        .from("todos")
        .insert({
          user_id: user.id,
          category_id: data.categoryId,
          title: data.title,
          start_date: data.startDate,
          end_date: data.endDate,
          is_routine: data.isRoutine,
          routine_days: data.routineDays,
          routine_end_date: data.routineEndDate,
          sort_order: data.sortOrder,
        })
        .select("id, category_id, title, start_date, end_date, is_routine, routine_days, routine_end_date, sort_order")
        .single();

      if (error) throw new Error(`Failed to create todo: ${error.message}`);
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

      if (error) throw new Error(`Failed to update todo: ${error.message}`);
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
    },

    async deleteTodo(id): Promise<void> {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw new Error(`Failed to delete todo: ${error.message}`);
    },

    async fetchCompletions(): Promise<Completion[]> {
      const { data, error } = await supabase
        .from("completions")
        .select("id, todo_id, completed_date");

      if (error) throw new Error(`Failed to fetch completions: ${error.message}`);
      return (data ?? []).map((row) => ({
        id: row.id,
        todoId: row.todo_id,
        completedDate: row.completed_date,
      }));
    },

    async toggleCompletion(todoId, date): Promise<void> {
      // Check if completion exists
      const { data: existing } = await supabase
        .from("completions")
        .select("id")
        .eq("todo_id", todoId)
        .eq("completed_date", date)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("completions")
          .delete()
          .eq("id", existing.id);
        if (error) throw new Error(`Failed to remove completion: ${error.message}`);
      } else {
        const { error } = await supabase
          .from("completions")
          .insert({ todo_id: todoId, completed_date: date });
        if (error) throw new Error(`Failed to add completion: ${error.message}`);
      }
    },
  };

  async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Not authenticated");
    return user;
  }
}
