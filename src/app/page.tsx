"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { TodoList } from "@/components/todo/TodoList";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { api } from "@/lib/api";
import { createSupabaseProvider } from "@/lib/supabase-provider";

export default function Home() {
  const selectDate = useCalendarStore((s) => s.selectDate);
  const selectedDate = useCalendarStore((s) => s.selectedDate);

  useEffect(() => {
    useCalendarStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (selectedDate && !window.matchMedia?.("(min-width: 1024px)")?.matches) {
      window.history.pushState({ view: "todo", date: selectedDate }, "");
    }
  }, [selectedDate]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // If we had a todo view open, just close it without navigating away
      const currentDate = useCalendarStore.getState().selectedDate;
      if (currentDate) {
        e.preventDefault();
        selectDate(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectDate]);

  return (
    <AuthGuard>
      <AppContent />
    </AuthGuard>
  );
}

function AppContent() {
  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialized) return;

    const provider = createSupabaseProvider();
    api.setProvider(provider);

    async function loadData() {
      try {
        const [categories, todos, completions] = await Promise.all([
          api.fetchCategories(),
          api.fetchTodos(),
          api.fetchCompletions(),
        ]);

        useCalendarStore.setState({ categories, todos, completions });
        setInitialized(true);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(err instanceof Error ? err.message : "데이터를 불러오지 못했습니다.");
      }
    }

    loadData();
  }, [initialized]);

  if (error) {
    return (
      <main className="max-w-[900px] mx-auto w-full min-h-screen flex items-center justify-center px-4 md:px-8">
        <div className="bg-bg-secondary rounded-[var(--radius-md)] p-6 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="text-error text-sm mb-4">{error}</p>
          <button
            onClick={() => { setError(null); setInitialized(false); }}
            className="text-accent text-sm font-medium"
          >
            다시 시도
          </button>
        </div>
      </main>
    );
  }

  if (!initialized) {
    return (
      <main className="max-w-[900px] mx-auto w-full min-h-screen flex items-center justify-center">
        <div
          className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
      </main>
    );
  }

  return (
    <main className="max-w-[900px] mx-auto w-full min-h-screen relative px-4 md:px-8">
      <LayoutGroup>
        {/* Desktop: side-by-side */}
        <div className="hidden lg:flex gap-6 pt-6 pb-8 min-h-screen">
          <div className="w-[400px] flex-shrink-0">
            <CalendarGrid />
          </div>
          <div className="flex-1 min-w-0">
            {selectedDate ? (
              <TodoList desktopMode />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p
                  className="text-[15px] text-text-tertiary"
                  style={{ animation: "breathe 3s ease-in-out infinite" }}
                >
                  날짜를 선택하세요
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile/Tablet: full screen toggle */}
        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            {selectedDate ? (
              <TodoList key="todo" />
            ) : (
              <CalendarGrid key="calendar" />
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </main>
  );
}
