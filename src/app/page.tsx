"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { TodoList } from "@/components/todo/TodoList";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { api } from "@/lib/api";
import { createSupabaseProvider } from "@/lib/supabase-provider";

export default function Home() {
  const selectDate = useCalendarStore((s) => s.selectDate);
  const selectedDate = useCalendarStore((s) => s.selectedDate);

  useEffect(() => { useCalendarStore.persist.rehydrate(); }, []);

  useEffect(() => {
    const isMobile = !window.matchMedia?.("(min-width: 1024px)")?.matches;
    if (!isMobile || !selectedDate) return;
    window.history.pushState({ view: "todo" }, "");
  }, [selectedDate]);

  useEffect(() => {
    const handlePopState = () => {
      if (useCalendarStore.getState().selectedDate) selectDate(null);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectDate]);

  return <AuthGuard><AppContent /></AuthGuard>;
}

function AppContent() {
  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const selectDate = useCalendarStore((s) => s.selectDate);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialized) return;
    const provider = createSupabaseProvider();
    api.setProvider(provider);
    async function loadData() {
      try {
        const [categories, todos, completions] = await Promise.all([api.fetchCategories(), api.fetchTodos(), api.fetchCompletions()]);
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
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="gum-card p-8 text-center max-w-sm">
          <p className="text-error text-sm font-bold mb-4">{error}</p>
          <button onClick={() => { setError(null); setInitialized(false); }} className="gum-btn-pink px-6 py-2 text-sm">다시 시도</button>
        </div>
      </main>
    );
  }

  if (!initialized) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-[3px] border-accent border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }} />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <LayoutGroup>
        {/* Desktop: fullscreen calendar + closable side panel */}
        <div className="hidden lg:flex min-h-screen">
          <div className="flex-1 min-w-0">
            <CalendarGrid />
          </div>
          <AnimatePresence>
            {selectedDate && (
              <motion.div
                className="w-[420px] flex-shrink-0 border-l-2 border-border-subtle overflow-y-auto relative"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 420, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Close button */}
                <button
                  onClick={() => selectDate(null)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 gum-btn text-sm flex items-center justify-center"
                >
                  ✕
                </button>
                <TodoList desktopMode />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile/Tablet */}
        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            {selectedDate ? <TodoList key="todo" /> : <CalendarGrid key="calendar" />}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </main>
  );
}
