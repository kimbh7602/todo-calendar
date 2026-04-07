export interface Category {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
}

export interface Todo {
  id: string;
  categoryId: string | null;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // null = single day
  isRoutine: boolean;
  routineDays: number[] | null; // 0=Sun..6=Sat (JS convention)
  routineEndDate: string | null;
  sortOrder: number;
}

export interface Completion {
  id: string;
  todoId: string;
  completedDate: string; // YYYY-MM-DD
}

export const CATEGORY_COLORS = {
  coral: "#FF6B6B",
  amber: "#FFBE5C",
  lime: "#A8E06C",
  cyan: "#5CC8FF",
  violet: "#B18CFF",
  pink: "#FF7EB3",
  mint: "#6CDFCF",
} as const;

export const DEFAULT_CATEGORIES: Omit<Category, "id">[] = [
  { name: "개인", color: CATEGORY_COLORS.coral, sortOrder: 0 },
  { name: "업무", color: CATEGORY_COLORS.amber, sortOrder: 1 },
  { name: "운동", color: CATEGORY_COLORS.lime, sortOrder: 2 },
];
