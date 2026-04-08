"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { springs } from "@/lib/springs";

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
      <div className="min-h-screen flex flex-col bg-bg-secondary">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4">
          <span className="text-[17px] font-semibold tracking-tight">Living Calendar</span>
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowForm(true); setMode("login"); }} className="px-4 py-2 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors">로그인</button>
            <button onClick={() => { setShowForm(true); setMode("signup"); }} className="px-4 py-2 text-[13px] font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors">시작하기</button>
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", ...springs.navigate }} className="flex flex-col items-center max-w-lg">
            {/* Icon */}
            <motion.div
              className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6"
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="6" width="24" height="22" rx="3" stroke="var(--color-accent)" strokeWidth="2"/>
                <path d="M4 12h24" stroke="var(--color-accent)" strokeWidth="2"/>
                <path d="M10 4v4M22 4v4" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="20" r="2" fill="var(--color-accent)"/>
                <circle cx="20" cy="20" r="2" fill="var(--color-accent)" opacity="0.4"/>
              </svg>
            </motion.div>

            <h1 className="text-[36px] md:text-[48px] font-semibold leading-[1.1] tracking-tight text-center">
              할 일을 끝내는
              <br />
              가장 쉬운 방법
            </h1>

            <p className="text-text-secondary text-[16px] md:text-[18px] mt-4 text-center leading-relaxed">
              캘린더에서 날짜를 누르고, 할 일을 적고, 끝내세요.
            </p>

            <motion.div className="flex gap-3 mt-8" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <button onClick={() => { setShowForm(true); setMode("signup"); }} className="px-8 py-3 bg-accent text-white text-[15px] font-medium rounded-xl hover:bg-accent-hover transition-colors">
                무료로 시작하기
              </button>
            </motion.div>
          </motion.div>

          {/* Feature cards */}
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-16 max-w-xl w-full" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            {[
              { icon: "📅", title: "캘린더 뷰", desc: "한 눈에 보는 할 일" },
              { icon: "✓", title: "완료 효과", desc: "끝내면 파티클이 터짐" },
              { icon: "↻", title: "루틴 관리", desc: "반복 할 일 자동 생성" },
            ].map((f) => (
              <div key={f.title} className="bg-bg-elevated border border-border rounded-xl p-4 text-center">
                <div className="text-[20px] mb-1.5">{f.icon}</div>
                <div className="text-[13px] font-medium">{f.title}</div>
                <div className="text-text-tertiary text-[12px] mt-0.5">{f.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-secondary">
      <nav className="flex items-center px-6 py-4">
        <button onClick={() => setShowForm(false)} className="text-[17px] font-semibold tracking-tight hover:text-accent transition-colors">Living Calendar</button>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div className="w-full max-w-[380px]" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", ...springs.navigate }}>
          <div className="mb-6">
            <h2 className="text-[24px] font-semibold">{mode === "login" ? "다시 오셨군요" : "반가워요"}</h2>
            <p className="text-text-secondary text-[14px] mt-1">{mode === "login" ? "로그인하고 이어서 해요" : "10초면 시작할 수 있어요"}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="bg-bg-elevated border border-border rounded-xl p-5 flex flex-col gap-3">
              <div>
                <label className="text-[12px] text-text-tertiary mb-1 block">이메일</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" autoComplete="email" className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-tertiary" />
              </div>
              <div>
                <label className="text-[12px] text-text-tertiary mb-1 block">비밀번호</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === "signup" ? "new-password" : "current-password"} className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-tertiary" />
              </div>
              <button type="submit" disabled={loading || !email.trim() || !password.trim()} className="w-full py-2.5 bg-accent text-white text-[14px] font-medium rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-40 mt-1">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto" style={{ animation: "spin 0.8s linear infinite" }} /> : mode === "login" ? "로그인" : "회원가입"}
              </button>
            </div>

            <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setMessage(null); }} className="text-[13px] text-text-secondary hover:text-accent transition-colors text-center py-2">
              {mode === "login" ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
            </button>

            {error && <div className="bg-error-light border border-error/20 rounded-lg p-3 text-error text-[13px] text-center">{error}</div>}
            {message && <div className="bg-success-light border border-success/20 rounded-lg p-3 text-success text-[13px] text-center">{message}</div>}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
