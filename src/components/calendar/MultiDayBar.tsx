"use client";

import { motion } from "framer-motion";
import { springs } from "@/lib/springs";
import type { SlottedSegment } from "@/lib/multiday";

interface MultiDayBarProps {
  segment: SlottedSegment;
  cellWidth: number;
  onTap: (date: string) => void;
}

const BAR_HEIGHT = 16;
const BAR_GAP = 2;
const BAR_TOP_OFFSET = 32; // below date number + completion ring

export function MultiDayBar({ segment, cellWidth, onTap }: MultiDayBarProps) {
  if (segment.slot === -1) return null;

  const color = segment.color || "#5CC8FF";
  const left = segment.startCol * cellWidth;
  const width = segment.span * cellWidth - 2; // 2px gap
  const top = BAR_TOP_OFFSET + segment.slot * (BAR_HEIGHT + BAR_GAP);

  return (
    <motion.button
      className="absolute text-[10px] font-medium px-1.5 rounded-[3px] truncate leading-[16px]"
      style={{
        left,
        top,
        width,
        height: BAR_HEIGHT,
        backgroundColor: `${color}30`,
        color,
      }}
      initial={{ opacity: 0, scaleX: 0.8 }}
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
  row,
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
      className="absolute text-[9px] font-semibold text-text-secondary"
      style={{ left: left + 2, top }}
      onClick={() => onTap(date)}
    >
      +{count}
    </button>
  );
}
