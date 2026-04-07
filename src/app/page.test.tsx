import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "./page";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    LayoutGroup: ({ children }: { children: React.ReactNode }) => children,
    motion: {
      div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
        <div {...props}>{children}</div>
      ),
      button: ({
        children,
        ...props
      }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button {...props}>{children}</button>
      ),
    },
  };
});

// Mock AuthGuard to bypass Supabase in unit tests
vi.mock("@/components/auth/AuthGuard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock Supabase provider
vi.mock("@/lib/supabase-provider", () => ({
  createSupabaseProvider: () => ({
    fetchCategories: async () => [
      { id: "cat-1", name: "개인", color: "#FF6B6B", sortOrder: 0 },
    ],
    fetchTodos: async () => [],
    fetchCompletions: async () => [],
  }),
}));

describe("Home", () => {
  beforeEach(async () => {
    const { useCalendarStore } = await import("@/stores/calendarStore");
    useCalendarStore.setState({
      selectedDate: null,
      categories: [
        { id: "cat-1", name: "개인", color: "#FF6B6B", sortOrder: 0 },
      ],
      todos: [],
      completions: [],
    });
  });

  it("캘린더 화면이 렌더링된다", async () => {
    render(<Home />);
    const now = new Date();
    const monthLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월`;
    await waitFor(() => {
      expect(screen.getByText(monthLabel)).toBeInTheDocument();
    });
  });
});
