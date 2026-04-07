import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Todo, Completion, Category } from "@/types";
import { api } from "@/lib/api";

interface CalendarState {
  // UI state (persisted)
  currentYear: number;
  currentMonth: number; // 0-indexed
  selectedDate: string | null; // YYYY-MM-DD or null (calendar view)

  // Data (from Supabase, not persisted locally)
  categories: Category[];
  todos: Todo[];
  completions: Completion[];

  // Loading state
  isLoading: boolean;

  // Actions
  setMonth: (year: number, month: number) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  selectDate: (date: string | null) => void;
  addTodo: (todo: Omit<Todo, "id">) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleCompletion: (todoId: string, date: string) => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  isCompleted: (todoId: string, date: string) => boolean;
  getTodosForDate: (date: string) => Todo[];
  getCompletionRate: (date: string) => number;
}

const now = new Date();

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth(),
      selectedDate: null,

      categories: [],
      todos: [],
      completions: [],
      isLoading: false,

      setMonth: (year, month) => set({ currentYear: year, currentMonth: month }),

      nextMonth: () => {
        const { currentYear, currentMonth } = get();
        if (currentMonth === 11) {
          set({ currentYear: currentYear + 1, currentMonth: 0 });
        } else {
          set({ currentMonth: currentMonth + 1 });
        }
      },

      prevMonth: () => {
        const { currentYear, currentMonth } = get();
        if (currentMonth === 0) {
          set({ currentYear: currentYear - 1, currentMonth: 11 });
        } else {
          set({ currentMonth: currentMonth - 1 });
        }
      },

      selectDate: (date) => {
        const prev = get().selectedDate;
        if (date && !prev) {
          window.history.pushState({ selectedDate: date }, "");
        }
        set({ selectedDate: date });
      },

      addTodo: async (todoData) => {
        set({ isLoading: true });
        try {
          const todo = await api.createTodo(todoData);
          set((s) => ({ todos: [...s.todos, todo], isLoading: false }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateTodo: async (id, updates) => {
        set({ isLoading: true });
        try {
          const updated = await api.updateTodo(id, updates);
          set((s) => ({
            todos: s.todos.map((t) => (t.id === id ? updated : t)),
            isLoading: false,
          }));
        } catch {
          set({ isLoading: false });
        }
      },

      deleteTodo: async (id) => {
        set({ isLoading: true });
        try {
          await api.deleteTodo(id);
          set((s) => ({
            todos: s.todos.filter((t) => t.id !== id),
            completions: s.completions.filter((c) => c.todoId !== id),
            isLoading: false,
          }));
        } catch {
          set({ isLoading: false });
        }
      },

      toggleCompletion: async (todoId, date) => {
        const existing = get().completions.find(
          (c) => c.todoId === todoId && c.completedDate === date
        );

        // Optimistic update for responsiveness
        if (existing) {
          set((s) => ({
            completions: s.completions.filter((c) => c.id !== existing.id),
          }));
        } else {
          set((s) => ({
            completions: [
              ...s.completions,
              { id: crypto.randomUUID(), todoId, completedDate: date },
            ],
          }));
        }

        try {
          await api.toggleCompletion(todoId, date);
          // Refresh completions from server to get real IDs
          const completions = await api.fetchCompletions();
          set({ completions });
        } catch {
          // Revert optimistic update
          const completions = await api.fetchCompletions().catch(() => get().completions);
          set({ completions });
        }
      },

      addCategory: async (categoryData) => {
        try {
          const category = await api.createCategory(categoryData);
          set((s) => ({ categories: [...s.categories, category] }));
        } catch {
          // silently fail
        }
      },

      isCompleted: (todoId, date) =>
        get().completions.some(
          (c) => c.todoId === todoId && c.completedDate === date
        ),

      getTodosForDate: (date) => {
        const { todos } = get();
        const d = new Date(date);
        const dow = d.getDay();

        return todos.filter((todo) => {
          // Routine
          if (todo.isRoutine && todo.routineDays) {
            if (!todo.routineDays.includes(dow)) return false;
            if (date < todo.startDate) return false;
            if (todo.routineEndDate && date > todo.routineEndDate) return false;
            return true;
          }
          // Multi-day
          if (todo.endDate) {
            return date >= todo.startDate && date <= todo.endDate;
          }
          // Single day
          return date === todo.startDate;
        });
      },

      getCompletionRate: (date) => {
        const todos = get().getTodosForDate(date);
        if (todos.length === 0) return -1;
        const completed = todos.filter((t) => get().isCompleted(t.id, date));
        return completed.length / todos.length;
      },
    }),
    {
      name: "living-calendar",
      partialize: (state) => ({
        currentYear: state.currentYear,
        currentMonth: state.currentMonth,
      }),
      skipHydration: true,
    }
  )
);
