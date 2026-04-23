"use client";

import { useState, useEffect } from "react";
import { IconKey, IconDatabase, IconServer2 } from "@tabler/icons-react";

const JwtPanel = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative flex cursor-default flex-col justify-center gap-5 overflow-hidden rounded-bl-3xl rounded-tl-3xl bg-neutral-100/20 p-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-50/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 text-left">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-violet-500">
          No SDK Required
        </div>
        <div className="mb-2 text-base font-semibold text-neutral-700">Standard JWTs</div>
        <div className="text-xs font-normal leading-relaxed text-neutral-500">
          RS256-signed tokens verifiable with any JWT library — no proprietary SDK needed.
        </div>
      </div>

      <div className="relative z-10 w-full space-y-2">
        {/* Raw token */}
        <div className="rounded-xl bg-neutral-950 px-3 py-3 font-mono text-[9.5px]">
          <div className="mb-1.5 text-[8.5px] text-neutral-500">access_token</div>
          <div className="break-all leading-loose">
            <span className="text-rose-400">eyJhbGciOiJSUzI1NiJ9</span>
            <span className="text-neutral-600">.</span>
            <span className="text-violet-400">eyJzdWIiOiJ1c2VyLWlkIn0</span>
            <span className="text-neutral-600">.</span>
            <span className="text-emerald-400">SflKxwRJSMeKKF2QT4fwpM</span>
          </div>
        </div>

        {/* Decoded payload — slides in on hover */}
        <div
          className={`rounded-xl border border-neutral-200 bg-white px-3 py-3 font-mono text-[9.5px] transition-all duration-300 ${
            hovered ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <div className="mb-1.5 flex items-center gap-1 text-[8.5px] text-neutral-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            verified payload
          </div>
          <div className="space-y-0.5 text-neutral-600">
            <div>
              <span className="text-violet-500">sub</span>
              <span className="text-neutral-400">: </span>
              <span className="text-neutral-800">"uuid-of-user"</span>
            </div>
            <div>
              <span className="text-violet-500">iss</span>
              <span className="text-neutral-400">: </span>
              <span className="text-neutral-800">"https://your-host"</span>
            </div>
            <div>
              <span className="text-violet-500">exp</span>
              <span className="text-neutral-400">: </span>
              <span className="text-neutral-800">1234567890</span>
            </div>
          </div>
        </div>

        <div className="pt-1 text-center text-[9px] font-normal text-neutral-400">
          {hovered ? "✓ Verified with JWKS public key" : "Hover to decode →"}
        </div>
      </div>
    </div>
  );
};

const FlowPanel = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveStep((s) => (s + 1) % 4), 1800);
    return () => clearInterval(id);
  }, []);

  const steps = [
    { from: "Your App", arrow: "redirect →", to: "Clura" },
    { from: "Clura", arrow: "OAuth →", to: "Google" },
    { from: "Google", arrow: "code →", to: "Clura" },
    { from: "Clura", arrow: "JWT →", to: "Your App" },
  ];

  return (
    <div className="group relative flex cursor-default flex-col justify-center gap-5 overflow-hidden bg-neutral-100/20 p-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-50/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 text-left">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-violet-500">
          No Vendor Lock-in
        </div>
        <div className="mb-2 text-base font-semibold text-neutral-700">You Own Everything</div>
        <div className="text-xs font-normal leading-relaxed text-neutral-500">
          Your infrastructure, your RSA keys, your data. No subscriptions, no black boxes.
        </div>
      </div>

      <div className="relative z-10 w-full">
        {/* Flow steps */}
        <div className="mb-4 space-y-2">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-[10px] transition-all duration-300 ${
                activeStep === i ? "opacity-100" : "opacity-40"
              }`}
            >
              <div
                className={`min-w-[60px] rounded-lg px-2 py-1 text-center font-mono font-medium transition-all duration-300 ${
                  activeStep === i
                    ? "bg-violet-100 text-violet-700"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {step.from}
              </div>
              <div className="flex-1 text-center">
                <div
                  className={`text-[9px] transition-colors duration-300 ${
                    activeStep === i ? "text-violet-500" : "text-neutral-300"
                  }`}
                >
                  {step.arrow}
                </div>
                <div
                  className={`mt-0.5 h-px transition-all duration-500 ${
                    activeStep === i ? "bg-violet-400" : "bg-neutral-200"
                  }`}
                />
              </div>
              <div
                className={`min-w-[60px] rounded-lg px-2 py-1 text-center font-mono font-medium transition-all duration-300 ${
                  activeStep === i
                    ? "bg-violet-100 text-violet-700"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {step.to}
              </div>
            </div>
          ))}
        </div>

        {/* Ownership badge */}
        <div className="flex items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
              <IconKey size={14} className="text-violet-600" />
            </div>
            <div className="text-[8.5px] font-normal text-neutral-500">Your Keys</div>
          </div>
          <div className="h-8 w-px bg-neutral-200" />
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
              <IconDatabase size={14} className="text-violet-600" />
            </div>
            <div className="text-[8.5px] font-normal text-neutral-500">Your Data</div>
          </div>
          <div className="h-8 w-px bg-neutral-200" />
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
              <IconServer2 size={14} className="text-violet-600" />
            </div>
            <div className="text-[8.5px] font-normal text-neutral-500">Your Server</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const terminalLines = [
  { text: "$ bun run dev:server", color: "text-neutral-300" },
  { text: "▶  Starting Clura...", color: "text-neutral-500" },
  { text: "✓  Environment loaded", color: "text-emerald-400" },
  { text: "✓  Database connected", color: "text-emerald-400" },
  { text: "✓  RSA key pair loaded", color: "text-emerald-400" },
  { text: "✓  JWKS endpoint ready", color: "text-emerald-400" },
  { text: "✓  Google OAuth configured", color: "text-emerald-400" },
  { text: "✓  Routes registered", color: "text-emerald-400" },
  { text: "⚡  Listening on :8000", color: "text-violet-400" },
];

const TerminalPanel = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [running, setRunning] = useState(false);

  const run = () => {
    if (running) return;
    setRunning(true);
    setVisibleCount(0);
    terminalLines.forEach((_, i) => {
      setTimeout(
        () => {
          setVisibleCount(i + 1);
          if (i === terminalLines.length - 1) setRunning(false);
        },
        i * 350 + 80,
      );
    });
  };

  return (
    <div
      className="group relative flex cursor-pointer flex-col justify-center gap-5 overflow-hidden rounded-br-3xl rounded-tr-3xl bg-neutral-100/20 p-6"
      onClick={run}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-50/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 text-left">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-violet-500">
          Self-Hostable
        </div>
        <div className="mb-2 text-base font-semibold text-neutral-700">Deploy Anywhere</div>
        <div className="text-xs font-normal leading-relaxed text-neutral-500">
          Bun + PostgreSQL. One command to start on any server you control.{" "}
          <span className="font-medium text-violet-500">Click to run →</span>
        </div>
      </div>

      <div className="relative z-10 min-h-[180px] w-full rounded-xl bg-neutral-950 px-3 py-3 font-mono text-[9.5px]">
        {/* macOS traffic lights */}
        <div className="mb-2.5 flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-400/70" />
          <div className="h-2 w-2 rounded-full bg-yellow-400/70" />
          <div className="h-2 w-2 rounded-full bg-emerald-400/70" />
        </div>

        <div className="min-h-[72px] space-y-0.5">
          {visibleCount === 0 && <div className="text-neutral-600">Click to start server...</div>}
          {terminalLines.slice(0, visibleCount).map((line, i) => (
            <div key={i} className={line.color}>
              {line.text}
            </div>
          ))}
          {running && (
            <div className="inline-block h-[11px] w-[5px] animate-pulse bg-neutral-400 align-middle" />
          )}
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <div className="mt-6 flex flex-col text-center text-4xl font-bold text-neutral-700">
      Features
      <div className="mx-10 mb-6 mt-4 grid h-fit divide-x-2 divide-neutral-200 rounded-3xl border-2 border-neutral-200 sm:grid-cols-3 md:mx-0">
        <JwtPanel />
        <FlowPanel />
        <TerminalPanel />
      </div>
    </div>
  );
};

export default Features;
