"use client";

import { useRef } from "react";
import { motion, useAnimate } from "framer-motion";
import type { Todo, Category } from "@/types";
import { useCalendarStore } from "@/stores/calendarStore";
import { spawnParticles, spawnConfetti } from "@/lib/particles";
import { playCompletionSound } from "@/lib/sound";
import { springs } from "@/lib/springs";

interface TodoItemProps { todo: Todo; date: string; category?: Category; completed?: boolean; }

export function TodoItem({ todo, date, category, completed = false }: TodoItemProps) {
  const toggleCompletion = useCalendarStore((s) => s.toggleCompletion);
  const getTodosForDate = useCalendarStore((s) => s.getTodosForDate);
  const isCompleted = useCalendarStore((s) => s.isCompleted);
  const checkboxRef = useRef<HTMLButtonElement>(null);
  const [scope, animate] = useAnimate();

  const color = category?.color || "var(--color-accent)";

  const handleToggle = async () => {
    const wasCompleted = isCompleted(todo.id, date);
    await toggleCompletion(todo.id, date);
    if (!wasCompleted && checkboxRef.current) {
      playCompletionSound();
      await animate(checkboxRef.current, { scale: [1, 1.2, 1] }, { duration: 0.2, type: "spring", ...springs.check });
      const rect = checkboxRef.current.getBoundingClientRect();
      spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, color);
      const allTodos = getTodosForDate(date);
      const allDone = allTodos.every((t) => t.id === todo.id ? true : isCompleted(t.id, date));
      if (allDone && allTodos.length > 1) setTimeout(spawnConfetti, 300);
    }
  };

  return (
    <div ref={scope} className={`flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors ${completed ? "opacity-50" : "hover:bg-bg-secondary"}`}>
      <motion.button
        ref={checkboxRef}
        onClick={handleToggle}
        className="w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors"
        style={{
          borderColor: completed ? color : "var(--color-border)",
          backgroundColor: completed ? color : "transparent",
        }}
        whileTap={{ scale: 0.85 }}
      >
        {completed && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </motion.button>

      <span className={`flex-1 text-[14px] ${completed ? "text-text-tertiary line-through" : "text-text-primary"}`}>
        {todo.title}
      </span>

      {category && (
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${category.color}15`, color: category.color }}
        >
          {category.name}
        </span>
      )}
    </div>
  );
}
