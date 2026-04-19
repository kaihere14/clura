type AccessRestrictionProps = {
  message?: string;
};

const AccessRestriction = ({
  message = "Access restricted: missing or invalid app ID.",
}: AccessRestrictionProps) => {
  return (
    <div className="max-w-300 mx-auto flex min-h-[calc(100vh-50px)] items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-200/80 bg-white/95 p-1 shadow-[0_14px_50px_-18px_rgba(0,0,0,0.35)] backdrop-blur dark:border-neutral-700/80 dark:bg-neutral-900/95">
        <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-neutral-200/50 blur-3xl dark:bg-neutral-700/30" />
        <div className="absolute -bottom-20 -right-10 h-52 w-52 rounded-full bg-neutral-100/90 blur-3xl dark:bg-neutral-800/60" />

        <div className="bg-linear-to-b relative rounded-[22px] border border-neutral-200/70 from-white to-neutral-50 p-8 text-center sm:p-10 dark:border-neutral-800/80 dark:from-neutral-900 dark:to-neutral-950">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <img src="/clura.png" alt="Clura logo" className="h-10 w-10" />
          </div>

          <p className="mb-3 inline-flex items-center rounded-full border border-neutral-300 bg-neutral-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            Clura Access Guard
          </p>

          <h1 className="text-2xl font-semibold text-neutral-900 sm:text-3xl dark:text-neutral-100">
            Restricted Access
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">
            {message}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto dark:bg-white dark:text-neutral-900"
            >
              Go To Login
            </a>
            <a
              href="/"
              className="inline-flex w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 sm:w-auto dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Back To Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessRestriction;
