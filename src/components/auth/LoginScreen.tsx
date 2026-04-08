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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: email.split("@")[0] } },
      });
      if (error) setError(error.message);
      else setMessage("가입 완료! 이메일을 확인해주세요.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "이메일 또는 비밀번호가 틀렸습니다."
            : error.message
        );
      }
    }

    setLoading(false);
  };

  if (!showForm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/10"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/5"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", ...springs.navigate }}
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <Doto mood="wave" size={160} />
        </motion.div>

        <motion.div
          className="text-center mt-6 mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", ...springs.navigate, delay: 0.15 }}
        >
          <h1 className="text-[40px] md:text-[56px] font-extrabold leading-tight tracking-tight">
            할 일을 끝내는
            <br />
            <span className="text-accent">가장 쉬운 방법</span>
          </h1>
          <p className="text-text-secondary text-lg mt-4 max-w-sm mx-auto">
            캘린더에서 날짜를 누르고, 할 일을 적고, 끝내세요.
            <br />
            그게 전부예요.
          </p>
        </motion.div>

        <motion.button
          onClick={() => setShowForm(true)}
          className="px-10 py-4 rounded-full bg-accent text-black text-lg font-bold hover:bg-accent-hover transition-colors"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", ...springs.navigate, delay: 0.3 }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
        >
          시작하기
        </motion.button>

        <motion.p
          className="text-text-tertiary text-sm mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          무료. 가입은 10초.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", ...springs.navigate }}
      >
        <Doto mood="think" size={80} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold mt-4 mb-1"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {mode === "login" ? "다시 오셨군요!" : "반가워요!"}
      </motion.h2>
      <p className="text-text-secondary text-sm mb-6">
        {mode === "login" ? "로그인하고 이어서 해요" : "계정을 만들어주세요"}
      </p>

      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-[360px] flex flex-col gap-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          autoComplete="email"
          className="w-full py-3.5 px-4 rounded-[var(--radius-md)] bg-bg-secondary text-text-primary text-[15px] placeholder:text-text-tertiary border-2 border-border-subtle outline-none focus:border-accent transition-colors"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className="w-full py-3.5 px-4 rounded-[var(--radius-md)] bg-bg-secondary text-text-primary text-[15px] placeholder:text-text-tertiary border-2 border-border-subtle outline-none focus:border-accent transition-colors"
        />

        <motion.button
          type="submit"
          disabled={loading || !email.trim() || !password.trim()}
          className="w-full py-3.5 rounded-full bg-accent text-black text-[15px] font-bold disabled:opacity-40 mt-1 hover:bg-accent-hover transition-colors"
          whileTap={{ scale: 0.97 }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mx-auto" style={{ animation: "spin 0.8s linear infinite" }} />
          ) : mode === "login" ? "로그인" : "회원가입"}
        </motion.button>

        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-border-subtle" />
          <span className="text-text-tertiary text-xs">또는</span>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>

        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setMessage(null); }}
          className="text-[13px] text-text-secondary font-semibold hover:text-accent transition-colors text-center py-2"
        >
          {mode === "login" ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
        </button>

        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="text-[13px] text-text-tertiary hover:text-text-secondary transition-colors text-center"
        >
          ← 처음으로
        </button>

        {error && <p className="text-error text-sm text-center font-medium">{error}</p>}
        {message && <p className="text-success text-sm text-center font-medium">{message}</p>}
      </motion.form>
    </div>
  );
}
