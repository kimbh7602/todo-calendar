"use client";

import { motion } from "framer-motion";

type DotoMood = "wave" | "sleep" | "celebrate" | "think";

interface DotoProps {
  mood?: DotoMood;
  size?: number;
  className?: string;
}

export function Doto({ mood = "wave", size = 120, className = "" }: DotoProps) {
  const s = size;
  const bodyColor = "#FF90E8";
  const darkColor = "#CC60B8";
  const faceColor = "#FFFFFF";

  return (
    <motion.svg
      width={s}
      height={s}
      viewBox="0 0 120 120"
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Body — rounded pencil shape */}
      <rect x="35" y="20" width="50" height="70" rx="25" fill={bodyColor} />
      {/* Pencil tip */}
      <polygon points="45,90 60,110 75,90" fill={darkColor} />
      <polygon points="52,100 60,112 68,100" fill="#FFE14D" />

      {/* Face circle */}
      <circle cx="60" cy="52" r="18" fill={faceColor} />

      {/* Eyes */}
      {mood === "sleep" ? (
        <>
          <line x1="50" y1="50" x2="56" y2="50" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="64" y1="50" x2="70" y2="50" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : mood === "celebrate" ? (
        <>
          <path d="M50 48 Q53 44 56 48" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M64 48 Q67 44 70 48" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="53" cy="49" r="3" fill="#000" />
          <circle cx="67" cy="49" r="3" fill="#000" />
          <circle cx="54.5" cy="47.5" r="1" fill="#FFF" />
          <circle cx="68.5" cy="47.5" r="1" fill="#FFF" />
        </>
      )}

      {/* Mouth */}
      {mood === "sleep" ? (
        <ellipse cx="60" cy="58" rx="3" ry="2" fill="#000" opacity="0.5" />
      ) : mood === "celebrate" ? (
        <path d="M54 57 Q60 64 66 57" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M55 57 Q60 62 65 57" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}

      {/* Checkmark crown */}
      <motion.path
        d="M48 24 L56 32 L74 14"
        stroke={mood === "celebrate" ? "#23C45E" : "#000"}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={mood === "celebrate" ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5, repeat: mood === "celebrate" ? Infinity : 0, repeatDelay: 1 }}
      />

      {/* Wave hand */}
      {mood === "wave" && (
        <motion.g
          animate={{ rotate: [0, 14, -14, 14, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          style={{ transformOrigin: "88px 55px" }}
        >
          <ellipse cx="92" cy="52" rx="8" ry="6" fill={bodyColor} />
          <line x1="90" y1="46" x2="88" y2="40" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="93" y1="46" x2="94" y2="40" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="96" y1="47" x2="99" y2="42" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
        </motion.g>
      )}

      {/* Sleep Zzz */}
      {mood === "sleep" && (
        <motion.text
          x="78" y="38"
          fontSize="14" fontWeight="bold" fill="#999"
          animate={{ opacity: [0, 1, 0], y: [38, 30, 22] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          z
        </motion.text>
      )}

      {/* Celebrate sparkles */}
      {mood === "celebrate" && (
        <>
          <motion.circle
            cx="30" cy="30" r="3" fill="#FFE14D"
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.circle
            cx="90" cy="25" r="2.5" fill="#FF90E8"
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          />
          <motion.circle
            cx="25" cy="60" r="2" fill="#4DA6FF"
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
          />
          <motion.circle
            cx="95" cy="70" r="2.5" fill="#23C45E"
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.9 }}
          />
        </>
      )}
    </motion.svg>
  );
}
