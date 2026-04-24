"use client";
import React from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
  ssr: false,
});

const globeConfig = {
  pointSize: 3,
  globeColor: "#2e1065",
  showAtmosphere: true,
  atmosphereColor: "#a78bfa",
  atmosphereAltitude: 0.12,
  emissive: "#1e1b4b",
  emissiveIntensity: 0.2,
  shininess: 0.7,
  polygonColor: "rgba(167,139,250,0.45)",
  ambientLight: "#8b5cf6",
  directionalLeftLight: "#c4b5fd",
  directionalTopLight: "#ffffff",
  pointLight: "#a78bfa",
  arcTime: 1400,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 40.7128, lng: -74.006 },
  autoRotate: true,
  autoRotateSpeed: 0.4,
};

const colors = ["#a78bfa", "#8b5cf6", "#7c3aed"];

const arcs = [
  {
    order: 1,
    startLat: 37.7749,
    startLng: -122.4194,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: colors[0],
  },
  {
    order: 1,
    startLat: 40.7128,
    startLng: -74.006,
    endLat: 48.8566,
    endLng: 2.3522,
    arcAlt: 0.2,
    color: colors[1],
  },
  {
    order: 2,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.4,
    color: colors[2],
  },
  {
    order: 2,
    startLat: 48.8566,
    startLng: 2.3522,
    endLat: 52.52,
    endLng: 13.405,
    arcAlt: 0.1,
    color: colors[0],
  },
  {
    order: 3,
    startLat: 35.6762,
    startLng: 139.6503,
    endLat: 1.3521,
    endLng: 103.8198,
    arcAlt: 0.2,
    color: colors[1],
  },
  {
    order: 3,
    startLat: 52.52,
    startLng: 13.405,
    endLat: 55.7558,
    endLng: 37.6173,
    arcAlt: 0.15,
    color: colors[2],
  },
  {
    order: 4,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: -33.8688,
    endLng: 151.2093,
    arcAlt: 0.3,
    color: colors[0],
  },
  {
    order: 4,
    startLat: 40.7128,
    startLng: -74.006,
    endLat: -23.5505,
    endLng: -46.6333,
    arcAlt: 0.4,
    color: colors[1],
  },
  {
    order: 5,
    startLat: -33.8688,
    startLng: 151.2093,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.2,
    color: colors[0],
  },
  {
    order: 5,
    startLat: 37.7749,
    startLng: -122.4194,
    endLat: 49.2827,
    endLng: -123.1207,
    arcAlt: 0.1,
    color: colors[2],
  },
  {
    order: 6,
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.4,
    color: colors[1],
  },
  {
    order: 6,
    startLat: -34.6037,
    startLng: -58.3816,
    endLat: 4.7109,
    endLng: -74.0721,
    arcAlt: 0.2,
    color: colors[2],
  },
  {
    order: 7,
    startLat: 55.7558,
    startLng: 37.6173,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.35,
    color: colors[0],
  },
  {
    order: 7,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 37.7749,
    endLng: -122.4194,
    arcAlt: 0.5,
    color: colors[1],
  },
  {
    order: 8,
    startLat: 48.8566,
    startLng: 2.3522,
    endLat: 28.6139,
    endLng: 77.209,
    arcAlt: 0.35,
    color: colors[2],
  },
  {
    order: 8,
    startLat: -23.5505,
    startLng: -46.6333,
    endLat: 40.7128,
    endLng: -74.006,
    arcAlt: 0.3,
    color: colors[0],
  },
  {
    order: 9,
    startLat: 31.2304,
    startLng: 121.4737,
    endLat: 1.3521,
    endLng: 103.8198,
    arcAlt: 0.15,
    color: colors[1],
  },
  {
    order: 9,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 52.52,
    endLng: 13.405,
    arcAlt: 0.3,
    color: colors[2],
  },
  {
    order: 10,
    startLat: 41.9028,
    startLng: 12.4964,
    endLat: 37.7749,
    endLng: -122.4194,
    arcAlt: 0.3,
    color: colors[0],
  },
  {
    order: 10,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 31.2304,
    endLng: 121.4737,
    arcAlt: 0.2,
    color: colors[1],
  },
];

export default function GlobeDemo() {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="relative flex h-auto flex-col items-center justify-center md:h-[460px] md:flex-row">
        {/* Text — left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex w-full flex-col gap-4 px-6 py-8 md:w-1/2 md:px-10 md:py-10"
        >
          <h2 className="text-3xl font-bold leading-tight text-neutral-800 dark:text-white">
            Self-host Clura{" "}
            <span className="bg-gradient-to-r from-violet-500 to-purple-700 bg-clip-text text-transparent">
              anywhere in the world.
            </span>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Clura is MIT-licensed and fully open source. Deploy on any server, any cloud, any region
            — your infrastructure, your keys, your rules.
          </p>

          <div className="mt-1 flex flex-col gap-2">
            {[
              "MIT License — free forever",
              "No telemetry, no phoning home",
              "Community-driven development",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <a
              href="https://github.com/kaihere14/clura"
              target="_blank"
              rel="noopener noreferrer"
              className="text-shadow-lg text-shadow-black/2 text-md easeIn flex items-center gap-2 rounded-md bg-gradient-to-t from-purple-700 to-violet-500 px-4 py-2 text-white transition-colors duration-300 hover:from-purple-700 hover:to-violet-300"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </a>
            <a
              href="/docs"
              className="text-shadow-lg text-shadow-black/2 text-md rounded-md px-2 py-2 text-neutral-700 transition-colors duration-200 hover:bg-neutral-200/40 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
            >
              Read documentation
            </a>
          </div>
        </motion.div>

        {/* Globe — right, with violet radial glow behind it */}
        <div className="relative h-[280px] w-full md:h-full md:w-1/2">
          {/* violet glow so globe doesn't look cut off on white bg */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_60%_50%,rgba(139,92,246,0.12),transparent)]" />
          {/* fade left into text area */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-white to-transparent dark:from-neutral-950" />
          {/* fade bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-b from-transparent to-white dark:to-neutral-950" />
          <World data={arcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}
