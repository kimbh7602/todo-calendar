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
    motion: new Proxy(
      {},
      {
        get: (_target, prop: string) => {
          const El = prop as keyof JSX.IntrinsicElements;
          const Component = ({ children, ...props }: Record<string, unknown>) => {
            const filtered = Object.fromEntries(
              Object.entries(props).filter(
                ([k]) => !["initial", "animate", "exit", "transition", "whileTap", "whileHover", "layoutId", "drag", "dragConstraints", "dragElastic", "onDragEnd", "variants", "style"].includes(k)
              )
            );
            return <El {...(filtered as React.HTMLAttributes<HTMLElement>)}>{children as React.ReactNode}</El>;
          };
          return Component;
        },
      }
    ),
    useAnimation: () => ({ start: vi.fn() }),
    useAnimate: () => [{ current: null }, vi.fn()],
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
      const elements = screen.getAllByText(monthLabel);
      expect(elements.length).toBeGreaterThan(0);
    });
  });
});
