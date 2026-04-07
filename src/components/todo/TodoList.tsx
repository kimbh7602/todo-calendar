"use client";

import { motion } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import { TodoItem } from "./TodoItem";
import { TodoAdd } from "./TodoAdd";
import { parseDate, getWeekdayLabel } from "@/lib/date";
import { springs } from "@/lib/springs";

export function TodoList() {
  const { selectedDate, selectDate, getTodosForDate, categories } =
    useCalendarStore();

  if (!selectedDate) return null;

  const date = parseDate(selectedDate);
  const todos = getTodosForDate(selectedDate);
  const dayLabel = `${date.getMonth() + 1}월 ${date.getDate()}일`;
  const weekday = getWeekdayLabel(date.getDay()) + "요일";

  const incompleteTodos = todos.filter(
    (t) => !useCalendarStore.getState().isCompleted(t.id, selectedDate)
  );
  const completedTodos = todos.filter((t) =>
    useCalendarStore.getState().isCompleted(t.id, selectedDate)
  );

  return (
    <motion.div
      className="px-5 pt-12 pb-8 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <motion.button
          onClick={() => selectDate(null)}
          className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary"
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
        <motion.div layoutId={`day-${selectedDate}`}>
          <h1 className="text-[22px] font-bold tracking-tight">
            {dayLabel}
            <span className="text-sm font-normal text-text-secondary ml-1.5">
              {weekday}
            </span>
          </h1>
        </motion.div>
      </div>

      {/* Todo Items */}
      {todos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-32">
          <p
            className="text-[15px] text-text-tertiary"
            style={{ animation: "breathe 3s ease-in-out infinite" }}
          >
            nothing here yet
          </p>
        </div>
      ) : (
        <div>
          {/* Incomplete */}
          {incompleteTodos.map((todo, i) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.05,
                type: "spring",
                ...springs.reorder,
              }}
            >
              <TodoItem
                todo={todo}
                date={selectedDate}
                category={categories.find((c) => c.id === todo.categoryId)}
              />
            </motion.div>
          ))}

          {/* Completed */}
          {completedTodos.length > 0 && (
            <>
              <div className="h-px bg-border-subtle my-3" />
              {completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  date={selectedDate}
                  category={categories.find((c) => c.id === todo.categoryId)}
                  completed
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Add Todo */}
      <TodoAdd date={selectedDate} />
    </motion.div>
  );
}
