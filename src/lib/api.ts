import type { Category, Todo, Completion } from "@/types";
import { DEFAULT_CATEGORIES } from "@/types";

// --- Data Provider Interface ---

export interface DataProvider {
  fetchCategories(): Promise<Category[]>;
  createCategory(data: Omit<Category, "id">): Promise<Category>;
  fetchTodos(): Promise<Todo[]>;
  createTodo(data: Omit<Todo, "id">): Promise<Todo>;
  updateTodo(id: string, updates: Partial<Todo>): Promise<Todo>;
  deleteTodo(id: string): Promise<void>;
  fetchCompletions(): Promise<Completion[]>;
  toggleCompletion(todoId: string, date: string): Promise<void>;
}

// --- Local Provider (localStorage, pre-Supabase) ---

export function createLocalProvider(): DataProvider {
  let categories: Category[] = DEFAULT_CATEGORIES.map((c, i) => ({
    ...c,
    id: crypto.randomUUID(),
  }));
  let todos: Todo[] = [];
  let completions: Completion[] = [];

  return {
    async fetchCategories() {
      return [...categories];
    },

    async createCategory(data) {
      const category: Category = { ...data, id: crypto.randomUUID() };
      categories.push(category);
      return category;
    },

    async fetchTodos() {
      return [...todos];
    },

    async createTodo(data) {
      const todo: Todo = { ...data, id: crypto.randomUUID() };
      todos.push(todo);
      return todo;
    },

    async updateTodo(id, updates) {
      const index = todos.findIndex((t) => t.id === id);
      if (index === -1) throw new Error(`Todo not found: ${id}`);
      todos[index] = { ...todos[index], ...updates };
      return todos[index];
    },

    async deleteTodo(id) {
      const index = todos.findIndex((t) => t.id === id);
      if (index === -1) throw new Error(`Todo not found: ${id}`);
      todos = todos.filter((t) => t.id !== id);
      completions = completions.filter((c) => c.todoId !== id);
    },

    async fetchCompletions() {
      return [...completions];
    },

    async toggleCompletion(todoId, date) {
      const existing = completions.find(
        (c) => c.todoId === todoId && c.completedDate === date
      );
      if (existing) {
        completions = completions.filter((c) => c.id !== existing.id);
      } else {
        completions.push({
          id: crypto.randomUUID(),
          todoId,
          completedDate: date,
        });
      }
    },
  };
}

// --- API Singleton ---
// Proxy-based: delegates all calls to provider, no boilerplate wrappers needed.

class ApiClient {
  private provider: DataProvider = createLocalProvider();

  setProvider(provider: DataProvider) {
    this.provider = provider;
  }

  fetchCategories = (): Promise<Category[]> => this.provider.fetchCategories();
  createCategory = (data: Omit<Category, "id">): Promise<Category> => this.provider.createCategory(data);
  fetchTodos = (): Promise<Todo[]> => this.provider.fetchTodos();
  createTodo = (data: Omit<Todo, "id">): Promise<Todo> => this.provider.createTodo(data);
  updateTodo = (id: string, updates: Partial<Todo>): Promise<Todo> => this.provider.updateTodo(id, updates);
  deleteTodo = (id: string): Promise<void> => this.provider.deleteTodo(id);
  fetchCompletions = (): Promise<Completion[]> => this.provider.fetchCompletions();
  toggleCompletion = (todoId: string, date: string): Promise<void> => this.provider.toggleCompletion(todoId, date);
}

export const api = new ApiClient();
