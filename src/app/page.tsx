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

  useEffect(() => {
    useCalendarStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      selectDate(null);
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

        console.log("Loaded:", { categories: categories.length, todos: todos.length, completions: completions.length });

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
      <main className="max-w-[420px] mx-auto w-full min-h-screen flex items-center justify-center px-8">
        <div className="text-center">
          <p className="text-cat-coral text-sm mb-4">{error}</p>
          <button
            onClick={() => { setError(null); setInitialized(false); }}
            className="text-cat-cyan text-sm"
          >
            다시 시도
          </button>
        </div>
      </main>
    );
  }

  if (!initialized) {
    return (
      <main className="max-w-[420px] mx-auto w-full min-h-screen flex items-center justify-center">
        <div
          className="w-5 h-5 border-2 border-cat-cyan border-t-transparent rounded-full"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
      </main>
    );
  }

  return (
    <main className="max-w-[420px] mx-auto w-full min-h-screen relative">
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {selectedDate ? (
            <TodoList key="todo" />
          ) : (
            <CalendarGrid key="calendar" />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </main>
  );
}
