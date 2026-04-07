import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Todo, Completion, Category } from "@/types";
import { DEFAULT_CATEGORIES } from "@/types";

interface CalendarState {
  // UI state (persisted)
  currentYear: number;
  currentMonth: number; // 0-indexed
  selectedDate: string | null; // YYYY-MM-DD or null (calendar view)

  // Data (not persisted, fetched from DB later)
  categories: Category[];
  todos: Todo[];
  completions: Completion[];

  // Actions
  setMonth: (year: number, month: number) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  selectDate: (date: string | null) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleCompletion: (todoId: string, date: string) => void;
  addCategory: (category: Category) => void;
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

      categories: DEFAULT_CATEGORIES.map((c, i) => ({
        ...c,
        id: `default-${i}`,
      })),
      todos: [],
      completions: [],

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
          // Push history entry when entering todo view
          window.history.pushState({ selectedDate: date }, "");
        }
        set({ selectedDate: date });
      },

      addTodo: (todo) => set((s) => ({ todos: [...s.todos, todo] })),

      updateTodo: (id, updates) =>
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTodo: (id) =>
        set((s) => ({
          todos: s.todos.filter((t) => t.id !== id),
          completions: s.completions.filter((c) => c.todoId !== id),
        })),

      toggleCompletion: (todoId, date) =>
        set((s) => {
          const existing = s.completions.find(
            (c) => c.todoId === todoId && c.completedDate === date
          );
          if (existing) {
            return {
              completions: s.completions.filter((c) => c.id !== existing.id),
            };
          }
          return {
            completions: [
              ...s.completions,
              {
                id: crypto.randomUUID(),
                todoId,
                completedDate: date,
              },
            ],
          };
        }),

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
        if (todos.length === 0) return -1; // no todos
        const completed = todos.filter((t) => get().isCompleted(t.id, date));
        return completed.length / todos.length;
      },

      addCategory: (category) =>
        set((s) => ({ categories: [...s.categories, category] })),
    }),
    {
      name: "living-calendar",
      partialize: (state) => ({
        currentYear: state.currentYear,
        currentMonth: state.currentMonth,
        // Also persist local data until Supabase is connected
        categories: state.categories,
        todos: state.todos,
        completions: state.completions,
      }),
      skipHydration: true,
    }
  )
);
