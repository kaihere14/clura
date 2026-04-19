"use client";

import { useState } from "react";
import { updateApp, deleteApp, type App } from "@/lib/api";

interface AppCardProps {
  app: App;
  token: string;
  onDeleted: (id: string) => void;
  onUpdated: (app: App) => void;
}

export default function AppCard({ app, token, onDeleted, onUpdated }: AppCardProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(app.name);
  const [editRedirectUri, setEditRedirectUri] = useState(app.redirectUri);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedRedirect, setCopiedRedirect] = useState(false);

  const handleSave = async () => {
    if (!editName.trim()) {
      setEditing(false);
      setEditName(app.name);
      setEditRedirectUri(app.redirectUri);
      return;
    }
    const nameChanged = editName.trim() !== app.name;
    const uriChanged = editRedirectUri.trim() !== app.redirectUri;
    if (!nameChanged && !uriChanged) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const updated = await updateApp(
        token,
        app.id,
        editName.trim(),
        uriChanged ? editRedirectUri.trim() : undefined,
      );
      onUpdated(updated);
      setEditing(false);
    } catch {
      setEditName(app.name);
      setEditRedirectUri(app.redirectUri);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditName(app.name);
    setEditRedirectUri(app.redirectUri);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteApp(token, app.id);
      onDeleted(app.id);
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const copyClientId = async () => {
    await navigator.clipboard.writeText(app.appClientId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyRedirectUri = async () => {
    await navigator.clipboard.writeText(app.redirectUri);
    setCopiedRedirect(true);
    setTimeout(() => setCopiedRedirect(false), 2000);
  };

  const createdAt = new Date(app.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-3">
        {editing ? (
          <input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && handleCancel()}
            className="flex-1 border-b border-neutral-400 bg-transparent pb-0.5 text-base font-semibold text-neutral-900 outline-none dark:border-neutral-500 dark:text-neutral-100"
          />
        ) : (
          <h3 className="truncate text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {app.name}
          </h3>
        )}

        <div className="flex shrink-0 items-center gap-1">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Client ID
        </span>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-lg bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            {app.appClientId}
          </code>
          <button
            onClick={copyClientId}
            className="rounded-lg bg-neutral-100 px-2 py-1.5 text-xs transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Redirect URI
        </span>
        {editing ? (
          <input
            type="url"
            value={editRedirectUri}
            onChange={(e) => setEditRedirectUri(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && handleCancel()}
            className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700 outline-none focus:ring-1 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          />
        ) : (
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {app.redirectUri}
            </code>
            <button
              onClick={copyRedirectUri}
              className="rounded-lg bg-neutral-100 px-2 py-1.5 text-xs transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              {copiedRedirect ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 pt-1 dark:border-neutral-800">
        <span className="text-xs text-neutral-400 dark:text-neutral-500">Created {createdAt}</span>

        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Delete?</span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-medium text-white disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Yes"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="rounded-lg border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-xs text-red-500 hover:underline dark:text-red-400"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
