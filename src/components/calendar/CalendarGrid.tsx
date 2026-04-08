"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import { getMonthDays, formatDate, isToday, getWeekdayLabel } from "@/lib/date";
import { springs } from "@/lib/springs";
import { createClient } from "@/lib/supabase";
import { CompletionRing } from "./CompletionRing";
import { MultiDayBar, OverflowIndicator } from "./MultiDayBar";
import { splitByWeek, assignSlots, getOverflowCounts } from "@/lib/multiday";
import { ThemeToggle } from "@/components/ThemeToggle";

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

export function CalendarGrid() {
  const currentYear = useCalendarStore((s) => s.currentYear);
  const currentMonth = useCalendarStore((s) => s.currentMonth);
  const selectDate = useCalendarStore((s) => s.selectDate);
  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const todos = useCalendarStore((s) => s.todos);
  const completions = useCalendarStore((s) => s.completions);
  const categories = useCalendarStore((s) => s.categories);
  const prevMonth = useCalendarStore((s) => s.prevMonth);
  const nextMonth = useCalendarStore((s) => s.nextMonth);
  const getTodosForDate = useCalendarStore((s) => s.getTodosForDate);

  const days = useMemo(() => getMonthDays(currentYear, currentMonth), [currentYear, currentMonth]);
  const monthLabel = `${currentYear}년 ${currentMonth + 1}월`;

  const [swipeDirection, setSwipeDirection] = useState(0);
  const controls = useAnimation();

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) { setSwipeDirection(-1); prevMonth(); }
    else if (info.offset.x < -threshold) { setSwipeDirection(1); nextMonth(); }
    controls.start({ x: 0, opacity: 1 });
  }, [prevMonth, nextMonth, controls]);

  useEffect(() => { setSwipeDirection(0); }, [currentYear, currentMonth]);

  const cellData = useMemo(() => {
    const completionSet = new Set(completions.map((c) => `${c.todoId}:${c.completedDate}`));
    const catColorMap = new Map(categories.map((c) => [c.id, c.color]));
    return days.map((date) => {
      const dateStr = formatDate(date);
      const dateTodos = getTodosForDate(dateStr);
      const completedCount = dateTodos.filter((t) => completionSet.has(`${t.id}:${dateStr}`)).length;
      const rate = dateTodos.length === 0 ? -1 : completedCount / dateTodos.length;
      const dotColors = [...new Set(dateTodos.map((t) => t.categoryId ? catColorMap.get(t.categoryId) : undefined).filter(Boolean))].slice(0, 3) as string[];
      const previews = dateTodos.slice(0, 2).map((t) => ({
        title: t.title,
        done: completionSet.has(`${t.id}:${dateStr}`),
        color: t.categoryId ? catColorMap.get(t.categoryId) : undefined,
      }));
      const moreCount = Math.max(0, dateTodos.length - 2);
      return { dateStr, date, rate, dotColors, previews, totalCount: dateTodos.length, completedCount, moreCount };
    });
  }, [days, todos, completions, categories, getTodosForDate]);

  const multiDaySegments = useMemo(() => {
    const multiDayTodos = todos.filter((t) => t.endDate && !t.isRoutine);
    const allSegments = multiDayTodos.flatMap((todo) => {
      const cat = categories.find((c) => c.id === todo.categoryId);
      return splitByWeek(todo, currentYear, currentMonth).map((seg) => ({ ...seg, color: cat?.color }));
    });
    return assignSlots(allSegments);
  }, [todos, categories, currentYear, currentMonth]);

  const overflowCounts = useMemo(() => getOverflowCounts(multiDaySegments), [multiDaySegments]);

  const gridRef = useRef<HTMLDivElement>(null);
  const [cellWidth, setCellWidth] = useState(0);

  useEffect(() => {
    const measure = () => { if (gridRef.current) setCellWidth(gridRef.current.offsetWidth / 7); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const numWeeks = Math.ceil(days.length / 7);

  const handleLogout = async () => { const supabase = createClient(); await supabase.auth.signOut(); window.location.reload(); };

  return (
    <div className="h-full flex flex-col bg-bg-elevated rounded-lg lg:rounded-xl overflow-hidden border border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-5 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <h1 className="text-[17px] lg:text-[19px] font-semibold tracking-tight">{monthLabel}</h1>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div className="flex gap-1.5 items-center">
          <ThemeToggle />
          <button onClick={handleLogout} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-bg-secondary transition-colors" aria-label="로그아웃">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 14H3.333A1.333 1.333 0 012 12.667V3.333A1.333 1.333 0 013.333 2H6M10.667 11.333L14 8l-3.333-3.333M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map((dow) => (
          <div
            key={dow}
            className={`text-center text-[11px] font-medium py-2 ${
              dow === 0 ? "text-sun" : dow === 6 ? "text-sat" : "text-text-tertiary"
            }`}
          >
            {getWeekdayLabel(dow)}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div ref={gridRef} className="flex-1 flex flex-col min-h-0">
        <motion.div
          className="flex-1 flex flex-col min-h-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          animate={controls}
          key={`${currentYear}-${currentMonth}`}
          initial={{ x: swipeDirection * 80, opacity: 0.6 }}
          transition={{ type: "spring", ...springs.navigate }}
        >
          {Array.from({ length: numWeeks }, (_, weekIdx) => {
            const weekSegments = multiDaySegments.filter((s) => s.row === weekIdx);
            const weekDays = cellData.slice(weekIdx * 7, weekIdx * 7 + 7);

            return (
              <div key={weekIdx} className="relative flex-1 min-h-0 overflow-hidden">
                <div className="grid grid-cols-7 h-full">
                  {weekDays.map((cell, colIdx) => {
                    const isCurrentMonth = cell.date.getMonth() === currentMonth;
                    const today = isToday(cell.date);
                    const isSelected = cell.dateStr === selectedDate;

                    return (
                      <button
                        key={`${cell.dateStr}-${weekIdx * 7 + colIdx}`}
                        onClick={() => selectDate(cell.dateStr)}
                        className={`
                          relative flex flex-col items-start pt-1.5 lg:pt-2 px-1 lg:px-1.5 min-h-[52px] h-full
                          border-r border-b border-border-light transition-colors text-left
                          ${isCurrentMonth ? "" : "opacity-30"}
                          ${isSelected ? "bg-accent-light" : "hover:bg-bg-secondary"}
                        `}
                      >
                        {/* Date */}
                        <div className="flex items-center gap-0.5 w-full mb-0.5">
                          {today ? (
                            <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-[12px] font-semibold" style={{ animation: "today-pulse 2s ease-in-out 3" }}>
                              {cell.date.getDate()}
                            </span>
                          ) : (
                            <span className={`text-[12px] font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                              isSelected ? "bg-accent text-white" : colIdx === 0 ? "text-sun" : colIdx === 6 ? "text-sat" : "text-text-primary"
                            }`}>
                              {cell.date.getDate()}
                            </span>
                          )}
                          {cell.rate > 0 && <CompletionRing rate={cell.rate} color={cell.dotColors[0] || "var(--color-accent)"} size={22} />}
                        </div>

                        {/* Todo previews — desktop */}
                        <div className="hidden lg:flex flex-col gap-px w-full overflow-hidden flex-1">
                          {cell.previews.map((p, i) => (
                            <div
                              key={i}
                              className={`text-[10px] leading-[14px] font-medium truncate rounded px-1 py-px ${
                                p.done ? "line-through text-text-tertiary" : "text-text-primary"
                              }`}
                              style={p.color ? { backgroundColor: `${p.color}15`, borderLeft: `2px solid ${p.color}` } : { backgroundColor: "var(--color-bg-secondary)" }}
                            >
                              {p.title}
                            </div>
                          ))}
                          {cell.moreCount > 0 && (
                            <span className="text-[9px] font-medium text-text-tertiary px-1">+{cell.moreCount}개</span>
                          )}
                        </div>

                        {/* Dots — mobile */}
                        {cell.dotColors.length > 0 && (
                          <div className="flex gap-[3px] lg:hidden mt-0.5">
                            {cell.dotColors.map((color) => (
                              <span key={color} className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: color }} />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {cellWidth > 0 && weekSegments.filter((s) => s.slot !== -1).map((seg) => (
                  <MultiDayBar key={`bar-${seg.todo.id}-${seg.row}`} segment={seg} cellWidth={cellWidth} onTap={selectDate} />
                ))}
                {cellWidth > 0 && Array.from(overflowCounts.entries())
                  .filter(([key]) => key.startsWith(`${weekIdx}-`))
                  .map(([key, count]) => {
                    const col = parseInt(key.split("-")[1]);
                    const cellDate = weekDays[col]?.dateStr;
                    if (!cellDate) return null;
                    return <OverflowIndicator key={key} count={count} row={weekIdx} col={col} cellWidth={cellWidth} onTap={selectDate} date={cellDate} />;
                  })}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
