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

  // Hydrate Zustand persist store
  useEffect(() => {
    useCalendarStore.persist.rehydrate();
  }, []);

  // Handle browser back button
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

const supabaseProvider = typeof window !== "undefined" ? createSupabaseProvider() : null;

function AppContent() {
  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || !supabaseProvider) return;

    api.setProvider(supabaseProvider);

    Promise.all([
      api.fetchCategories(),
      api.fetchTodos(),
      api.fetchCompletions(),
    ]).then(([categories, todos, completions]) => {
      useCalendarStore.setState({ categories, todos, completions });
      setInitialized(true);
    }).catch((error) => {
      console.error("Failed to load data:", error);
    });
  }, [initialized]);

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
