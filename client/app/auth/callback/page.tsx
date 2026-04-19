import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800 dark:border-neutral-600 dark:border-t-neutral-200" />
        </div>
      }
    >
      <CallbackClient />
    </Suspense>
  );
}
