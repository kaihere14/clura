import { IconArrowRight, IconMessageCircle } from "@tabler/icons-react";

const CTA = () => {
  return (
    <div className="relative mx-10 mx-auto mb-16 max-w-[1200px]">
      <div className="border-1 z-99 absolute -left-8 -top-1 hidden w-[87vw] border-dashed md:block"></div>
      <div className="border-1 z-99 absolute -bottom-1 -left-8 hidden w-[87vw] border-dashed md:block"></div>
      <div className="border-1 z-99 absolute -right-1 -top-8 hidden h-[54vh] border-dashed md:block"></div>
      <div className="border-1 z-99 absolute -top-8 left-0 hidden h-[54vh] border-dashed md:block"></div>

      <div className="grid overflow-hidden rounded-3xl md:grid-cols-[1fr_1px_400px]">
        {/* ── Left: headline + buttons ── */}
        <div className="flex flex-col justify-center gap-8 px-6 py-10 md:px-14 md:py-16">
          <div className="flex flex-col gap-4">
            <p className="text-2xl leading-tight text-neutral-400 sm:text-3xl md:text-4xl lg:text-5xl dark:text-neutral-500">
              Add auth with the{" "}
              <span className="font-bold text-neutral-800 dark:text-white">speed of light</span>
            </p>
            <p className="text-2xl leading-tight text-neutral-400 sm:text-3xl md:text-4xl lg:text-5xl dark:text-neutral-500">
              Get <span className="text-violet-500">self-hosted</span> OAuth 2.0 for the most
              advanced <span className="text-purple-600">apps.</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/login"
              className="text-shadow-lg text-shadow-black/2 text-md easeIn flex items-center gap-2 rounded-md bg-gradient-to-t from-purple-700 to-violet-500 px-4 py-2 text-white transition-colors duration-300 hover:from-purple-700 hover:to-violet-300"
            >
              Self-host now
              <IconArrowRight size={15} />
            </a>
            <a
              href="/docs"
              className="text-shadow-lg text-shadow-black/2 text-md flex items-center gap-2 rounded-md px-2 py-2 text-neutral-700 transition-colors duration-200 hover:bg-neutral-200/40 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
            >
              Read documentation
              <IconMessageCircle size={15} />
            </a>
          </div>
        </div>

        {/* ── Vertical divider ── */}
        <div className="hidden self-stretch border-dashed bg-neutral-200 md:block dark:bg-neutral-800" />

        {/* ── Right: testimonial ── */}
        <div className="flex flex-col justify-center gap-4 px-6 py-10 md:px-12 md:py-16">
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
            "This is the best auth setup I&apos;ve shipped. Dropped our SaaS auth vendor in an
            afternoon. Ten on ten recommended — I just can&apos;t wait to see where Clura goes."
          </p>
          <div>
            <p className="font-bold text-neutral-800 dark:text-white">Marcus Rein</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Indie hacker &amp; SaaS builder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
