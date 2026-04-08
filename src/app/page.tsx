"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
      <main className="min-h-screen flex items-center justify-center px-6 bg-bg-secondary">
        <div className="bg-bg-elevated border border-border rounded-xl p-8 text-center max-w-sm">
          <p className="text-error text-[14px] mb-4">{error}</p>
          <button onClick={() => { setError(null); setInitialized(false); }} className="px-6 py-2 bg-accent text-white text-[13px] font-medium rounded-lg hover:bg-accent-hover transition-colors">다시 시도</button>
        </div>
      </main>
    );
  }

  if (!initialized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-bg-secondary">
        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-secondary">
      {/* Desktop */}
      <div className="hidden lg:flex min-h-screen p-3 gap-3">
        <div className="flex-1 min-w-0">
          <CalendarGrid />
        </div>
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              className="w-[380px] flex-shrink-0 bg-bg-elevated border border-border rounded-xl overflow-hidden"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <TodoList desktopMode />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile/Tablet */}
      <div className="lg:hidden">
        <AnimatePresence mode="wait">
          {selectedDate ? (
            <TodoList key="todo" />
          ) : (
            <div key="calendar" className="p-3 min-h-screen">
              <CalendarGrid />
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
