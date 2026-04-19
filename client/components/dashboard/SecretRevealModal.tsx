"use client";

import { useState } from "react";
import type { App } from "@/lib/api";

interface SecretRevealModalProps {
  app: App;
  onDismiss: () => void;
}

export default function SecretRevealModal({ app, onDismiss }: SecretRevealModalProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const copy = async (text: string, which: "id" | "secret") => {
    await navigator.clipboard.writeText(text);
    if (which === "id") {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-md flex-col gap-5 rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Application created
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            <span className="font-medium text-amber-600 dark:text-amber-400">
              Save your secret now.
            </span>{" "}
            It will not be shown again.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              App name
            </label>
            <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {app.name}
            </p>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Client ID
            </label>
            <div className="mt-1 flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-neutral-100 px-3 py-2 font-mono text-xs dark:bg-neutral-800">
                {app.appClientId}
              </code>
              <button
                onClick={() => copy(app.appClientId, "id")}
                className="rounded-lg bg-neutral-100 px-2 py-1.5 text-xs transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                {copiedId ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Client Secret
            </label>
            <div className="mt-1 flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-neutral-100 px-3 py-2 font-mono text-xs dark:bg-neutral-800">
                {app.appSecret}
              </code>
              <button
                onClick={() => copy(app.appSecret, "secret")}
                className="rounded-lg bg-neutral-100 px-2 py-1.5 text-xs transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                {copiedSecret ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-900"
        >
          I&apos;ve copied the secret
        </button>
      </div>
    </div>
  );
}
