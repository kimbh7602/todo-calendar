"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import { LoginScreen } from "./LoginScreen";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then((result: any) => {
      setUser(result.data.session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange(
      async (_event: any, session: any) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser && (_event === "SIGNED_IN" || _event === "USER_UPDATED")) {
          await supabase.from("profiles").upsert(
            {
              id: currentUser.id,
              display_name:
                currentUser.user_metadata?.display_name ||
                currentUser.email?.split("@")[0] ||
                "사용자",
            },
            { onConflict: "id" }
          ).catch(() => {});
        }
      }
    );

    return () => data.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-6 h-6 border-[3px] border-accent border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  return <>{children}</>;
}
