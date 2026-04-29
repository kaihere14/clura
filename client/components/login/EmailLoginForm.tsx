"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getMe, loginWithEmail, registerWithEmail } from "@/lib/api";

type Mode = "login" | "register";

interface Props {
  appClientId?: string;
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const inputClass =
  "w-84 md:w-lg focus:ring-3 h-12 rounded-[9px] bg-neutral-100 pl-2 text-neutral-800 placeholder:text-neutral-800 focus:outline-none focus:ring-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:ring-neutral-700";

const wrapClass = "mt-3 rounded-xl border-2 border-neutral-400 p-[2px] dark:border-neutral-800";

const EmailLoginForm = ({ appClientId }: Props) => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGlobal = !!appClientId;

  const handleSubmit = async () => {
    setError(null);

    if (!email || !password || (mode === "register" && !name)) {
      setError("All fields are required");
      return;
    }
    if (!email.includes("@")) {
      setError("Invalid email");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      if (isGlobal) {
        const endpoint = mode === "login" ? "/v1/global-auth/login" : "/v1/global-auth/register";
        const body: Record<string, string> = { email, password, appClientId };
        if (mode === "register") body.name = name;

        const res = await fetch(`${BASE}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          credentials: "include",
        });
        const data = (await res.json()) as { redirectUrl?: string; message?: string };
        if (!res.ok) {
          setError(data.message ?? "Authentication failed");
          return;
        }
        window.location.href = data.redirectUrl!;
      } else {
        const data =
          mode === "login"
            ? await loginWithEmail(email, password)
            : await registerWithEmail(email, password, name);

        const user = await getMe(data.token);
        setAuth(data.token, user);
        document.cookie = `clura_token=${data.token}; max-age=604800; path=/; SameSite=Lax`;
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError(null);
  };

  return (
    <>
      <span className="border-1 mt-3 w-full border-dashed border-neutral-400 dark:border-neutral-800"></span>
      <div className="flex w-full flex-col items-center justify-center">
        {mode === "register" && (
          <div className={wrapClass}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Your name"
              suppressHydrationWarning
            />
          </div>
        )}
        <div className={wrapClass}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="Enter your email"
            suppressHydrationWarning
          />
        </div>
        <div className={wrapClass}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="Password"
            suppressHydrationWarning
          />
        </div>

        {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-85 md:w-130 mt-2 h-10 cursor-pointer rounded-lg bg-[#111] text-sm font-medium leading-3 text-neutral-200 transition-colors duration-150 ease-in-out hover:bg-[#111]/90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-300"
        >
          {loading ? "…" : mode === "login" ? "Continue with Email" : "Create Account"}
        </button>

        <button
          onClick={toggleMode}
          className="mt-2 text-sm text-neutral-500 underline-offset-2 hover:text-neutral-700 hover:underline dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          {mode === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </>
  );
};

export default EmailLoginForm;
