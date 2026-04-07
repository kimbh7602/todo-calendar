"use client";

interface CompletionRingProps {
  rate: number; // 0-1
  color: string;
  size?: number;
}

export function CompletionRing({ rate, color, size = 32 }: CompletionRingProps) {
  if (rate <= 0) return null;

  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - rate);

  return (
    <svg
      width={size}
      height={size}
      className="absolute"
      style={{ opacity: 0.5 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.4s ease" }}
      />
    </svg>
  );
}
