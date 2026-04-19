"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { fetchApps, type App } from "@/lib/api";
import AppCard from "@/components/dashboard/AppCard";
import CreateAppModal from "@/components/dashboard/CreateAppModal";
import SecretRevealModal from "@/components/dashboard/SecretRevealModal";
import EmptyState from "@/components/dashboard/EmptyState";

export default function DashboardClient() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newApp, setNewApp] = useState<App | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchApps(token)
      .then(setApps)
      .catch((err: Error) => {
        if (
          err.message.toLowerCase().includes("401") ||
          err.message.toLowerCase().includes("unauthorized")
        ) {
          clearAuth();
          router.replace("/login");
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [token, router, clearAuth]);

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  const handleCreated = (app: App) => {
    setApps((prev) => [app, ...prev]);
    setShowCreate(false);
    setNewApp(app);
  };

  const handleDeleted = (id: number) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdated = (updated: App) => {
    setApps((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Clura
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">Applications</span>
          </div>
          <div className="flex items-center gap-3">
            {user?.avatar && (
              <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full" />
            )}
            <span className="hidden text-sm text-neutral-700 sm:block dark:text-neutral-300">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Your applications
          </h1>
          {apps.length > 0 && (
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-900"
            >
              New app
            </button>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800 dark:border-neutral-600 dark:border-t-neutral-200" />
          </div>
        )}

        {error && !loading && (
          <p className="py-16 text-center text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        {!loading && !error && apps.length === 0 && (
          <EmptyState onCreateClick={() => setShowCreate(true)} />
        )}

        {!loading && !error && apps.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {apps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                token={token!}
                onDeleted={handleDeleted}
                onUpdated={handleUpdated}
              />
            ))}
          </div>
        )}
      </main>

      {showCreate && (
        <CreateAppModal
          token={token!}
          onCreated={handleCreated}
          onClose={() => setShowCreate(false)}
        />
      )}

      {newApp && <SecretRevealModal app={newApp} onDismiss={() => setNewApp(null)} />}
    </div>
  );
}
