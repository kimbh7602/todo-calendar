"use client";

import { motion } from "framer-motion";
import { springs } from "@/lib/springs";
import type { SlottedSegment } from "@/lib/multiday";

interface MultiDayBarProps {
  segment: SlottedSegment;
  cellWidth: number;
  onTap: (date: string) => void;
}

const BAR_HEIGHT = 18;
const BAR_GAP = 2;
const BAR_TOP_OFFSET = 30;

export function MultiDayBar({ segment, cellWidth, onTap }: MultiDayBarProps) {
  if (segment.slot === -1) return null;

  const color = segment.color || "var(--color-accent)";
  const left = segment.startCol * cellWidth + 1;
  const width = segment.span * cellWidth - 2;
  const top = BAR_TOP_OFFSET + segment.slot * (BAR_HEIGHT + BAR_GAP);

  return (
    <motion.button
      className="absolute text-[10px] font-medium px-1.5 rounded-[4px] truncate leading-[18px]"
      style={{
        left,
        top,
        width: Math.max(0, width),
        height: BAR_HEIGHT,
        backgroundColor: `${color}20`,
        color,
        borderLeft: `2px solid ${color}`,
      }}
      initial={{ opacity: 0, scaleX: 0.9 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ type: "spring", ...springs.elastic }}
      onClick={() => onTap(segment.todo.startDate)}
    >
      {segment.todo.title}
    </motion.button>
  );
}

export function OverflowIndicator({
  count,
  col,
  cellWidth,
  onTap,
  date,
}: {
  count: number;
  row: number;
  col: number;
  cellWidth: number;
  onTap: (date: string) => void;
  date: string;
}) {
  const left = col * cellWidth;
  const top = BAR_TOP_OFFSET + 3 * (BAR_HEIGHT + BAR_GAP);

  return (
    <button
      className="absolute text-[9px] font-medium text-text-tertiary hover:text-accent transition-colors"
      style={{ left: left + 4, top }}
      onClick={() => onTap(date)}
    >
      +{count}개
    </button>
  );
}
