"use client";

import { useState, useEffect } from "react";
import { IconKey, IconDatabase, IconServer2 } from "@tabler/icons-react";

const JwtPanel = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative flex cursor-default flex-col justify-center gap-5 overflow-hidden rounded-tl-3xl bg-neutral-100/20 p-6 dark:bg-neutral-800/20"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-50/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-violet-950/30" />

      <div className="relative z-10 text-left">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-violet-500">
          No SDK Required
        </div>
        <div className="mb-2 text-base font-semibold text-neutral-700 dark:text-white">
          Standard JWTs
        </div>
        <div className="text-xs font-normal leading-relaxed text-neutral-500 dark:text-neutral-400">
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
          className={`rounded-xl border border-neutral-200 bg-white px-3 py-3 font-mono text-[9.5px] transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-800 ${
            hovered ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <div className="mb-1.5 flex items-center gap-1 text-[8.5px] text-neutral-400 dark:text-neutral-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            verified payload
          </div>
          <div className="space-y-0.5 text-neutral-600 dark:text-neutral-300">
            <div>
              <span className="text-violet-500">sub</span>
              <span className="text-neutral-400 dark:text-neutral-500">: </span>
              <span className="text-neutral-800 dark:text-neutral-200">"uuid-of-user"</span>
            </div>
            <div>
              <span className="text-violet-500">iss</span>
              <span className="text-neutral-400 dark:text-neutral-500">: </span>
              <span className="text-neutral-800 dark:text-neutral-200">"https://your-host"</span>
            </div>
            <div>
              <span className="text-violet-500">exp</span>
              <span className="text-neutral-400 dark:text-neutral-500">: </span>
              <span className="text-neutral-800 dark:text-neutral-200">1234567890</span>
            </div>
          </div>
        </div>

        <div className="pt-1 text-center text-[9px] font-normal text-neutral-400 dark:text-neutral-500">
          {hovered ? "✓ Verified with JWKS public key" : "Hover to decode →"}
        </div>
      </div>
    </div>
  );
};

const PROVIDERS = ["Google", "GitHub", "Email"];

const FlowPanel = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [providerIdx, setProviderIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((s) => {
        const next = (s + 1) % 4;
        if (next === 0) setProviderIdx((p) => (p + 1) % PROVIDERS.length);
        return next;
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const provider = PROVIDERS[providerIdx];

  const steps = [
    { from: "Your App", arrow: "redirect →", to: "Clura" },
    { from: "Clura", arrow: "auth →", to: provider },
    { from: provider, arrow: "callback →", to: "Clura" },
    { from: "Clura", arrow: "JWT →", to: "Your App" },
  ];

  return (
    <div className="group relative flex cursor-default flex-col justify-center gap-5 overflow-hidden bg-neutral-100/20 p-6 dark:bg-neutral-800/20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-50/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-purple-950/30" />

      <div className="relative z-10 text-left">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-violet-500">
          No Vendor Lock-in
        </div>
        <div className="mb-2 text-base font-semibold text-neutral-700 dark:text-white">
          You Own Everything
        </div>
        <div className="text-xs font-normal leading-relaxed text-neutral-500 dark:text-neutral-400">
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
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {step.from}
              </div>
              <div className="flex-1 text-center">
                <div
                  className={`text-[9px] transition-colors duration-300 ${
                    activeStep === i ? "text-violet-500" : "text-neutral-300 dark:text-neutral-600"
                  }`}
                >
                  {step.arrow}
                </div>
                <div
                  className={`mt-0.5 h-px transition-all duration-500 ${
                    activeStep === i ? "bg-violet-400" : "bg-neutral-200 dark:bg-neutral-700"
                  }`}
                />
              </div>
              <div
                className={`min-w-[60px] rounded-lg px-2 py-1 text-center font-mono font-medium transition-all duration-300 ${
                  activeStep === i
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {step.to}
              </div>
            </div>
          ))}
        </div>

        {/* Ownership badge */}
        <div className="flex items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-800/50">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950/50">
              <IconKey size={14} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div className="text-[8.5px] font-normal text-neutral-500 dark:text-neutral-400">
              Your Keys
            </div>
          </div>
          <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-700" />
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950/50">
              <IconDatabase size={14} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div className="text-[8.5px] font-normal text-neutral-500 dark:text-neutral-400">
              Your Data
            </div>
          </div>
          <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-700" />
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950/50">
              <IconServer2 size={14} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div className="text-[8.5px] font-normal text-neutral-500 dark:text-neutral-400">
              Your Server
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const terminalLines = [
  { text: "$ bun run dev:server", color: "text-neutral-300" },
  { text: "▶  Starting Clura...", color: "text-neutral-500" },
  { text: "✓  Database connected", color: "text-emerald-400" },
  { text: "✓  RSA key pair loaded", color: "text-emerald-400" },
  { text: "✓  JWKS endpoint ready", color: "text-emerald-400" },
  { text: "✓  Google OAuth ready", color: "text-emerald-400" },
  { text: "✓  GitHub OAuth ready", color: "text-emerald-400" },
  { text: "✓  Email auth ready", color: "text-emerald-400" },
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
      className="group relative flex cursor-pointer flex-col justify-center gap-5 overflow-hidden rounded-tr-3xl bg-neutral-100/20 p-6 dark:bg-neutral-800/20"
      onClick={run}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-50/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-violet-950/30" />

      <div className="relative z-10 text-left">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-violet-500">
          Self-Hostable
        </div>
        <div className="mb-2 text-base font-semibold text-neutral-700 dark:text-white">
          Deploy Anywhere
        </div>
        <div className="text-xs font-normal leading-relaxed text-neutral-500 dark:text-neutral-400">
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

const ArchDiagram = () => (
  <div className="relative col-span-full w-full overflow-hidden border-t-2 border-neutral-200 dark:border-neutral-800">
    <div className="absolute inset-0 bg-[repeating-linear-gradient(315deg,var(--tw-color,#d4d4d4)_0%,var(--tw-color,#d4d4d4)_1px,transparent_1px,transparent_50%)] bg-[size:10px_10px] opacity-30 dark:opacity-10" />
    <svg
      viewBox="0 0 1100 270"
      className="relative w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <style>{`
        .fl { stroke-dasharray:8 5; animation:fl 1.4s linear infinite; }
        .fl-r { stroke-dasharray:8 5; animation:fl-r 1.4s linear infinite; }
        .fl-d { stroke-dasharray:6 4; animation:fl 1.8s linear infinite; }
        @keyframes fl   { to { stroke-dashoffset:-26; } }
        @keyframes fl-r { to { stroke-dashoffset: 26; } }
        .pulse { animation:pulse 2.4s ease-out infinite; }
        @keyframes pulse { 0%{r:36;opacity:.35} 100%{r:54;opacity:0} }
        .fade-in { animation:fade 0.6s ease-out both; }
        @keyframes fade { from{opacity:0} to{opacity:1} }
      `}</style>

      {/* ── connection lines ── */}

      {/* App → Clura (upper, request) */}
      <path d="M 196 96 L 510 84" stroke="#a78bfa" strokeWidth="1.5" fill="none" className="fl" />
      {/* Clura → App (lower, JWT response) */}
      <path
        d="M 510 108 L 196 120"
        stroke="#6d28d9"
        strokeWidth="1.5"
        fill="none"
        className="fl-r"
      />

      {/* Clura → Google */}
      <path d="M 585 84 L 900 57" stroke="#a78bfa" strokeWidth="1.5" fill="none" className="fl" />

      {/* Clura → GitHub */}
      <path d="M 590 102 L 948 102" stroke="#a78bfa" strokeWidth="1.5" fill="none" className="fl" />

      {/* Clura → Email */}
      <path d="M 585 118 L 900 158" stroke="#a78bfa" strokeWidth="1.5" fill="none" className="fl" />

      {/* Clura → JWKS (bottom-left) */}
      <path
        d="M 530 132 L 326 228"
        stroke="#8b5cf6"
        strokeWidth="1.5"
        fill="none"
        className="fl-d"
      />
      {/* Clura → JWT (bottom-right) */}
      <path
        d="M 568 132 L 734 228"
        stroke="#8b5cf6"
        strokeWidth="1.5"
        fill="none"
        className="fl-d"
      />

      {/* ── line labels ── */}
      <text x="348" y="80" textAnchor="middle" fontSize="9" fill="#a78bfa" className="font-mono">
        clientId →
      </text>
      <text x="348" y="128" textAnchor="middle" fontSize="9" fill="#7c3aed" className="font-mono">
        ← JWT tokens
      </text>

      {/* ── Clura node (hero) ── */}
      <circle cx="550" cy="96" r="54" fill="#7c3aed" opacity=".04" className="pulse" />
      <circle cx="550" cy="96" r="36" fill="url(#clura-grad)" />
      <circle cx="550" cy="96" r="36" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
      <defs>
        <radialGradient id="clura-grad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </radialGradient>
      </defs>
      <text x="550" y="91" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">
        Clura
      </text>
      <text x="550" y="105" textAnchor="middle" fontSize="8.5" fill="#ddd8fe">
        IDP
      </text>

      {/* ── Your App node ── */}
      <circle
        cx="160"
        cy="108"
        r="28"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="1.5"
        className="dark:fill-neutral-800 dark:stroke-neutral-700"
      />
      <text
        x="160"
        y="104"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="600"
        fill="#404040"
        className="dark:fill-neutral-200"
      >
        Your
      </text>
      <text
        x="160"
        y="117"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="600"
        fill="#404040"
        className="dark:fill-neutral-200"
      >
        App
      </text>

      {/* ── Provider nodes: Google, GitHub, Email ── */}
      <circle
        cx="920"
        cy="52"
        r="22"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="1.5"
        className="dark:fill-neutral-800 dark:stroke-neutral-700"
      />
      <text
        x="920"
        y="48"
        textAnchor="middle"
        fontSize="9"
        fontWeight="600"
        fill="#404040"
        className="dark:fill-neutral-200"
      >
        Google
      </text>
      <text x="920" y="60" textAnchor="middle" fontSize="7.5" fill="#7c7c7c">
        OAuth 2.0
      </text>

      <circle
        cx="970"
        cy="108"
        r="22"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="1.5"
        className="dark:fill-neutral-800 dark:stroke-neutral-700"
      />
      <text
        x="970"
        y="104"
        textAnchor="middle"
        fontSize="9"
        fontWeight="600"
        fill="#404040"
        className="dark:fill-neutral-200"
      >
        GitHub
      </text>
      <text x="970" y="116" textAnchor="middle" fontSize="7.5" fill="#7c7c7c">
        OAuth 2.0
      </text>

      <circle
        cx="920"
        cy="164"
        r="22"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="1.5"
        className="dark:fill-neutral-800 dark:stroke-neutral-700"
      />
      <text
        x="920"
        y="160"
        textAnchor="middle"
        fontSize="9"
        fontWeight="600"
        fill="#404040"
        className="dark:fill-neutral-200"
      >
        Email
      </text>
      <text x="920" y="172" textAnchor="middle" fontSize="7.5" fill="#7c7c7c">
        + password
      </text>

      {/* ── JWKS node ── */}
      <circle
        cx="310"
        cy="244"
        r="22"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="1.5"
        className="dark:fill-neutral-800 dark:stroke-neutral-700"
      />
      <text x="310" y="240" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#6d28d9">
        JWKS
      </text>
      <text x="310" y="252" textAnchor="middle" fontSize="7.5" fill="#7c7c7c">
        public key
      </text>

      {/* ── JWT issued node ── */}
      <circle
        cx="748"
        cy="244"
        r="22"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="1.5"
        className="dark:fill-neutral-800 dark:stroke-neutral-700"
      />
      <text x="748" y="240" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#6d28d9">
        JWT
      </text>
      <text x="748" y="252" textAnchor="middle" fontSize="7.5" fill="#7c7c7c">
        RS256 signed
      </text>
    </svg>
  </div>
);

const Features = () => {
  return (
    <div
      id="features"
      className="mt-10 flex flex-col text-center text-4xl font-bold text-neutral-700 dark:text-neutral-100"
    >
      Features
      <div className="mx-4 mb-6 mt-10 grid h-fit grid-cols-1 divide-y-2 divide-neutral-200 overflow-hidden rounded-3xl border-2 border-neutral-200 md:mx-0 md:grid-cols-3 md:divide-x-2 md:divide-y-0 dark:divide-neutral-800 dark:border-neutral-800">
        <JwtPanel />
        <FlowPanel />
        <TerminalPanel />
        <ArchDiagram />
      </div>
    </div>
  );
};

export default Features;
