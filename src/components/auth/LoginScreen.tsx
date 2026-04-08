"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { springs } from "@/lib/springs";
import { Doto } from "@/components/Doto";

type Mode = "login" | "signup";

export function LoginScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: email.split("@")[0] } } });
      if (error) setError(error.message);
      else setMessage("가입 완료! 이메일을 확인해주세요.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message === "Invalid login credentials" ? "이메일 또는 비밀번호가 틀렸습니다." : error.message);
    }
    setLoading(false);
  };

  if (!showForm) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Nav — pink */}
        <nav className="gum-header flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <Doto mood="wave" size={28} />
            <span className="text-lg font-black tracking-tight">Living Calendar</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowForm(true); setMode("login"); }} className="gum-btn px-5 py-2 text-sm">로그인</button>
            <button onClick={() => { setShowForm(true); setMode("signup"); }} className="gum-btn-pink px-5 py-2 text-sm">시작하기</button>
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
          {/* Decorative floating shapes */}
          <motion.div className="absolute top-16 left-[10%] w-12 h-12 rounded-full bg-accent/20 border-2 border-accent/30" style={{ animation: "float 4s ease-in-out infinite" }} />
          <motion.div className="absolute top-32 right-[12%] w-8 h-8 rounded-sm bg-cat-yellow/30 border-2 border-cat-yellow/40 rotate-12" style={{ animation: "float 5s ease-in-out infinite 0.5s" }} />
          <motion.div className="absolute bottom-32 left-[15%] w-6 h-6 rounded-full bg-cat-green/25 border-2 border-cat-green/35" style={{ animation: "float 3.5s ease-in-out infinite 1s" }} />
          <motion.div className="absolute bottom-24 right-[18%] w-10 h-10 rounded-full bg-cat-blue/20 border-2 border-cat-blue/30" style={{ animation: "float 4.5s ease-in-out infinite 0.3s" }} />
          <motion.div className="absolute top-48 left-[5%] w-4 h-4 rounded-full bg-cat-purple/30" style={{ animation: "float 3s ease-in-out infinite 0.7s" }} />

          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", ...springs.navigate }} className="flex flex-col items-center relative z-10">
            <motion.div className="gum-card-pink px-6 py-2 mb-6 text-sm font-black" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
              무료로 시작하세요 ✨
            </motion.div>

            <h1 className="text-[48px] md:text-[72px] font-black leading-[1.05] tracking-tight text-center max-w-3xl">
              할 일을 끝내는
              <br />
              <span className="relative inline-block">
                가장 쉬운 방법
                <svg className="absolute -bottom-2 left-0 w-full h-4" viewBox="0 0 300 12" preserveAspectRatio="none">
                  <path d="M0 8 Q75 0 150 8 Q225 16 300 8" stroke="#FF90E8" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-text-secondary text-lg md:text-xl mt-6 text-center max-w-md leading-relaxed">
              캘린더에서 날짜를 누르고, 할 일을 적고, 끝내세요.
            </p>

            <motion.div className="flex gap-3 mt-8" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <button onClick={() => { setShowForm(true); setMode("signup"); }} className="gum-btn-pink px-10 py-4 text-lg">시작하기 →</button>
            </motion.div>
          </motion.div>

          {/* Feature cards — compact grid */}
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-14 max-w-2xl w-full relative z-10" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            {[
              { emoji: "📅", title: "캘린더 뷰", desc: "한 눈에 보는 할 일", accent: "#FF90E8" },
              { emoji: "✅", title: "완료 효과", desc: "끝내면 파티클이 터짐", accent: "#23C45E" },
              { emoji: "🔄", title: "루틴 관리", desc: "반복 할 일 자동 생성", accent: "#4DA6FF" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                className="gum-card p-4 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -4, borderColor: f.accent }}
              >
                <div className="text-2xl mb-1.5">{f.emoji}</div>
                <div className="font-black text-sm">{f.title}</div>
                <div className="text-text-secondary text-xs mt-0.5">{f.desc}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Doto character */}
          <motion.div className="mt-10" style={{ animation: "float 3s ease-in-out infinite" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <Doto mood="wave" size={80} />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="gum-header flex items-center justify-between px-6 py-3">
        <button onClick={() => setShowForm(false)} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <Doto mood="wave" size={28} />
          <span className="text-lg font-black tracking-tight">Living Calendar</span>
        </button>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div className="w-full max-w-[400px]" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", ...springs.navigate }}>
          <div className="flex items-center gap-3 mb-6">
            <Doto mood="think" size={48} />
            <div>
              <h2 className="text-2xl font-black">{mode === "login" ? "다시 오셨군요!" : "반가워요!"}</h2>
              <p className="text-text-secondary text-sm">{mode === "login" ? "로그인하고 이어서 해요" : "10초면 끝나요"}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="gum-card p-6 flex flex-col gap-3">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" autoComplete="email" className="gum-input" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" autoComplete={mode === "signup" ? "new-password" : "current-password"} className="gum-input" />
              <button type="submit" disabled={loading || !email.trim() || !password.trim()} className="gum-btn-pink w-full py-3.5 text-[15px] mt-1 disabled:opacity-40">
                {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mx-auto" style={{ animation: "spin 0.8s linear infinite" }} /> : mode === "login" ? "로그인" : "회원가입"}
              </button>
            </div>

            <div className="flex items-center gap-2 my-1">
              <div className="flex-1 h-[2px] bg-border-subtle" />
              <span className="text-text-tertiary text-xs font-bold">또는</span>
              <div className="flex-1 h-[2px] bg-border-subtle" />
            </div>

            <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setMessage(null); }} className="gum-btn w-full py-3 text-sm">
              {mode === "login" ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
            </button>

            {error && <div className="gum-card p-3 text-error text-sm font-medium text-center" style={{ borderColor: "var(--color-error)" }}>{error}</div>}
            {message && <div className="gum-card p-3 text-success text-sm font-medium text-center" style={{ borderColor: "var(--color-success)" }}>{message}</div>}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
