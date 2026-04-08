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
        options: {
          data: { display_name: email.split("@")[0] },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage("가입 완료! 이메일을 확인해주세요.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-8">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", ...springs.navigate }}
      >
        <h1 className="text-[28px] font-bold tracking-tight text-text-primary mb-2">
          Living Calendar
        </h1>
        <p className="text-[15px] text-text-secondary">
          매일 쓰고 싶어지는 캘린더
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-[360px] flex flex-col gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", ...springs.navigate, delay: 0.1 }}
      >
        <div
          className="glass-card rounded-[var(--radius-lg)] p-6"
        >
          <div className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              autoComplete="email"
              className="w-full py-3 px-4 rounded-[var(--radius-md)] bg-bg-primary text-text-primary text-[15px] placeholder:text-text-tertiary border border-border-subtle outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="w-full py-3 px-4 rounded-[var(--radius-md)] bg-bg-primary text-text-primary text-[15px] placeholder:text-text-tertiary border border-border-subtle outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />

            <motion.button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full py-3.5 rounded-full bg-accent text-white text-[15px] font-semibold disabled:opacity-40 mt-1"
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <Spinner />
              ) : mode === "login" ? (
                "로그인"
              ) : (
                "회원가입"
              )}
            </motion.button>
          </div>

          {error && (
            <p className="text-error text-sm text-center mt-3">{error}</p>
          )}
          {message && (
            <p className="text-success text-sm text-center mt-3">{message}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
            setMessage(null);
          }}
          className="text-[13px] text-text-secondary hover:text-text-primary transition-colors text-center py-2"
        >
          {mode === "login"
            ? "계정이 없으신가요? 회원가입"
            : "이미 계정이 있으신가요? 로그인"}
        </button>
      </motion.form>
    </div>
  );
}

function Spinner() {
  return (
    <div
      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
      style={{ animation: "spin 0.8s linear infinite" }}
    />
  );
}
