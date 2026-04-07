import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
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

describe("Home", () => {
  beforeEach(() => {
    // Reset Zustand store
    const { useCalendarStore } = require("@/stores/calendarStore");
    useCalendarStore.setState({ selectedDate: null });
  });

  it("캘린더 화면이 렌더링된다", () => {
    render(<Home />);
    // Should show month header with current year/month
    const now = new Date();
    const monthLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월`;
    expect(screen.getByText(monthLabel)).toBeInTheDocument();
  });
});
