"use client";

import { useEffect, useState } from "react";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import { LoginScreen } from "./LoginScreen";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then((res: { data: { user: User | null } }) => {
      setUser(res.data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          await supabase.from("profiles").upsert(
            {
              id: currentUser.id,
              display_name:
                currentUser.user_metadata?.display_name ||
                currentUser.email?.split("@")[0] ||
                "사용자",
            },
            { onConflict: "id" }
          );
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-5 h-5 border-2 border-cat-cyan border-t-transparent rounded-full"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
