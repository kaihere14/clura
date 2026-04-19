"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getMe } from "@/lib/api";

export default function CallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const err = searchParams.get("error");

    if (err) {
      setError(err);
      return;
    }

    if (!token) {
      setError("missing_token");
      return;
    }

    (async () => {
      try {
        const user = await getMe(token);
        setAuth(token, user);
        document.cookie = `clura_token=${token}; max-age=604800; path=/; SameSite=Lax`;
        router.replace("/dashboard");
      } catch {
        setError("auth_failed");
      }
    })();
  }, [searchParams, setAuth, router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500 dark:text-red-400">
          Authentication failed: <span className="font-mono">{error}</span>
        </p>
        <a href="/login" className="text-sm text-blue-600 underline dark:text-blue-400">
          Back to login
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800 dark:border-neutral-600 dark:border-t-neutral-200" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Signing you in…</p>
      </div>
    </div>
  );
}
