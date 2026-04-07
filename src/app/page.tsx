"use client";

import { useEffect } from "react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { TodoList } from "@/components/todo/TodoList";

export default function Home() {
  const selectedDate = useCalendarStore((s) => s.selectedDate);
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
