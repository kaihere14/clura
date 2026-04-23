const Hero = () => {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <YLine className="absolute top-0 h-10 w-full" />
      {/* <YLine className="absolute bottom-0 h-14 w-full" /> */}
      <XLine className="mask-b-from-90% absolute left-0 h-screen w-14" />
      <XLine className="mask-b-from-90% absolute right-0 h-screen w-14" />

      <div className="size-full px-14 pt-10">
        <div className="relative flex size-full flex-col justify-between px-4 py-14">
          <img
            src="/mountains-snow.webp"
            alt="snow"
            className="-z-99 mask-t-from-90% mask-b-from-10% mask-radial-from-50% absolute inset-0 h-full w-full object-cover"
          />
          <nav className="flex items-center justify-between">
            <span className="flex items-center justify-center bg-gradient-to-r from-violet-500 to-purple-700 bg-clip-text text-3xl font-bold text-neutral-800 text-transparent">
              <img src="/clura.png" alt="" className="size-8" />
              Clura
            </span>
            <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-800">
              <a
                href="/docs"
                className="transition-colors hover:text-neutral-800 dark:hover:text-white"
              >
                Docs
              </a>
              <a
                href="#"
                className="transition-colors hover:text-neutral-800 dark:hover:text-white"
              >
                Quickstart
              </a>
              <a
                href="#"
                className="transition-colors hover:text-neutral-800 dark:hover:text-white"
              >
                Self-host
              </a>
            </div>
            <a
              href="/login"
              className="text-shadow-xs rounded-md bg-gradient-to-t from-purple-700 to-violet-500 px-4 py-1.5 text-sm text-white drop-shadow-xl transition-colors hover:bg-gradient-to-t hover:from-purple-700 hover:to-violet-300"
            >
              Get started
            </a>
          </nav>

          <div className="flex flex-col justify-start gap-2">
            <h1 className="-z-999 max-w-xl text-6xl font-semibold tracking-tight text-black dark:text-neutral-100">
              Your own Clerk. Your own Auth0.
            </h1>
            <p className="max-w-xl text-xl tracking-tight text-neutral-600 dark:text-neutral-300">
              Self-hosted OAuth 2.0 identity provider. Register apps, authenticate users with
              Google, and receive RS256-signed JWTs no SDK, no vendor lock-in, your infra.
            </p>

            <div className="buttons mt-4 flex gap-2">
              <a
                href="/login"
                className="text-shadow-lg text-shadow-black/2 text-md easeIn rounded-md bg-gradient-to-t from-purple-700 to-violet-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-gradient-to-t hover:from-purple-700 hover:to-violet-300"
              >
                Self-host now
              </a>
              <a
                href="/docs"
                className="text-shadow-lg text-shadow-black/2 text-md rounded-md px-2 py-2 text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
              >
                Read documentation
              </a>
            </div>
          </div>

          <StraighLines className="mask-b-from-10% absolute inset-x-0 top-0 h-12 w-full" />
          {/* <StraighLines className="mask-t-from-10% absolute inset-x-0 bottom-0 h-12 w-full" /> */}
        </div>
      </div>
    </div>
  );
};

const YLine = ({ className }: { className: string }) => {
  return (
    <div
      className={`border-y-1 border-neutral-300 bg-[repeating-linear-gradient(315deg,var(--pattern)_0%,var(--pattern)_1px,transparent_1px,transparent_50%)] bg-[size:10px_10px] dark:border-neutral-700 ${className}`}
    ></div>
  );
};

const XLine = ({ className }: { className: string }) => {
  return (
    <div
      className={`border-x-1 border-neutral-300 bg-[repeating-linear-gradient(315deg,var(--pattern)_0%,var(--pattern)_1px,transparent_1px,transparent_50%)] bg-[size:10px_10px] dark:border-neutral-700 ${className}`}
    ></div>
  );
};

const StraighLines = ({ className }: { className: string }) => {
  return (
    <div
      className={`border-x-1 border-neutral-300 bg-[repeating-linear-gradient(to_bottom,var(--pattern)_0%,var(--pattern)_1px,transparent_1px,transparent_1rem)] bg-[size:10px_10px] dark:border-neutral-700 ${className}`}
    ></div>
  );
};
export default Hero;
