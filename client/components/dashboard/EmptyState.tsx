interface EmptyStateProps {
  onCreateClick: () => void;
}

export default function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-3xl dark:bg-neutral-800">
        📦
      </div>
      <div>
        <p className="font-medium text-neutral-800 dark:text-neutral-200">No applications yet</p>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Create your first app to get started.
        </p>
      </div>
      <button
        onClick={onCreateClick}
        className="mt-2 cursor-pointer rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-900"
      >
        Create application
      </button>
    </div>
  );
}
