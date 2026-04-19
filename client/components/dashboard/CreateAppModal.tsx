"use client";

import { useState } from "react";
import { createApp, type App } from "@/lib/api";

interface CreateAppModalProps {
  token: string;
  onCreated: (app: App) => void;
  onClose: () => void;
}

export default function CreateAppModal({ token, onCreated, onClose }: CreateAppModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const app = await createApp(token, name.trim());
      onCreated(app);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create app");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-sm flex-col gap-5 rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          New application
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="app-name"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Application name
            </label>
            <input
              id="app-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My App"
              autoFocus
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:ring-neutral-100"
            />
            {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
            >
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
