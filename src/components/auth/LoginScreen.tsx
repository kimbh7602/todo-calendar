"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { springs } from "@/lib/springs";

export function LoginScreen() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (provider: "google" | "kakao") => {
    setLoading(provider);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError("로그인에 실패했습니다. 다시 시도해주세요.");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", ...springs.navigate }}
      >
        <h1 className="text-[28px] font-bold tracking-tight mb-2">
          Living Calendar
        </h1>
        <p className="text-[15px] text-text-secondary">
          매일 쓰고 싶어지는 캘린더
        </p>
      </motion.div>

      <motion.div
        className="w-full max-w-[320px] flex flex-col gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", ...springs.navigate, delay: 0.1 }}
      >
        {/* Google Login */}
        <motion.button
          onClick={() => handleLogin("google")}
          disabled={loading !== null}
          className="w-full py-3.5 rounded-full bg-white text-black text-[15px] font-semibold flex items-center justify-center gap-2.5 disabled:opacity-50"
          whileTap={{ scale: 0.97 }}
        >
          {loading === "google" ? (
            <Spinner />
          ) : (
            <>
              <GoogleIcon />
              Google로 계속하기
            </>
          )}
        </motion.button>

        {/* Kakao Login */}
        <motion.button
          onClick={() => handleLogin("kakao")}
          disabled={loading !== null}
          className="w-full py-3.5 rounded-full text-[15px] font-semibold flex items-center justify-center gap-2.5 disabled:opacity-50"
          style={{ backgroundColor: "#FEE500", color: "#191919" }}
          whileTap={{ scale: 0.97 }}
        >
          {loading === "kakao" ? (
            <Spinner dark />
          ) : (
            <>
              <KakaoIcon />
              카카오로 계속하기
            </>
          )}
        </motion.button>

        {error && (
          <p className="text-cat-coral text-sm text-center mt-2">{error}</p>
        )}
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 01-1.8 2.71v2.26h2.92a8.78 8.78 0 002.68-6.62z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.97 10.71A5.41 5.41 0 013.68 9c0-.59.1-1.17.29-1.71V4.96H.96A9 9 0 000 9c0 1.45.35 2.82.96 4.04l3.01-2.33z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A9 9 0 009 0 9 9 0 00.96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        d="M9 1C4.58 1 1 3.87 1 7.4c0 2.27 1.5 4.26 3.76 5.39l-.96 3.56c-.08.3.26.54.52.37l4.24-2.82c.14.01.29.01.44.01 4.42 0 8-2.87 8-6.4C17 3.87 13.42 1 9 1z"
        fill="#191919"
      />
    </svg>
  );
}

function Spinner({ dark }: { dark?: boolean }) {
  return (
    <div
      className={`w-5 h-5 border-2 rounded-full ${
        dark
          ? "border-[#191919] border-t-transparent"
          : "border-gray-400 border-t-transparent"
      }`}
      style={{ animation: "spin 0.8s linear infinite" }}
    />
  );
}
