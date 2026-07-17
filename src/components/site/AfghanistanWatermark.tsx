/**
 * Decorative Afghanistan map watermark rendered as a fixed background layer.
 * Uses a simplified SVG path outline of Afghanistan and a soft radial gradient
 * so it feels like a subtle brand imprint rather than an inline illustration.
 *
 * Light mode: soft navy/teal wash at ~6% opacity.
 * Dark mode: cooler indigo tones with lower opacity so the map never fights
 * body copy on dark navy surfaces.
 */
export function AfghanistanWatermark() {
  const path =
    "M120,180 L160,140 L210,120 L260,110 L310,100 L360,95 L410,100 L460,110 L510,130 L560,155 L595,180 L620,215 L640,255 L635,295 L610,330 L565,345 L520,340 L495,360 L470,395 L440,420 L400,430 L360,425 L320,410 L285,395 L250,405 L215,420 L180,410 L150,385 L125,350 L110,310 L100,270 L105,225 Z";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Radial fade so the map dissolves into page edges in both themes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_55%,var(--color-surface)_100%)]" />

      <svg
        viewBox="0 0 800 600"
        className="absolute left-1/2 top-1/2 h-[130vh] w-[130vh] -translate-x-1/2 -translate-y-1/2 opacity-[0.06] dark:opacity-[0.035]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Light-mode gradient: navy → sky → teal */}
          <linearGradient id="afg-wm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          {/* Dark-mode gradient: cooler, lower-chroma indigos that read against navy-950 */}
          <linearGradient id="afg-wm-grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="50%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
          <pattern id="afg-wm-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" fill="#0f172a" opacity="0.35" />
          </pattern>
          <pattern id="afg-wm-dots-dark" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" fill="#e0f2fe" opacity="0.18" />
          </pattern>
        </defs>

        {/* Light-mode layers */}
        <g transform="translate(60,40)" className="block dark:hidden">
          <path d={path} fill="url(#afg-wm-grad)" />
          <path d={path} fill="url(#afg-wm-dots)" />
          <path
            d={path}
            fill="none"
            stroke="#0f172a"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.6"
          />
          <path
            d="M595,180 L650,170 L705,160 L740,155"
            fill="none"
            stroke="#0f172a"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>

        {/* Dark-mode layers: lighter strokes/fills, reduced contrast */}
        <g transform="translate(60,40)" className="hidden dark:block">
          <path d={path} fill="url(#afg-wm-grad-dark)" opacity="0.55" />
          <path d={path} fill="url(#afg-wm-dots-dark)" />
          <path
            d={path}
            fill="none"
            stroke="#cbd5f5"
            strokeWidth="1.25"
            strokeDasharray="4 3"
            opacity="0.35"
          />
          <path
            d="M595,180 L650,170 L705,160 L740,155"
            fill="none"
            stroke="#cbd5f5"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.3"
          />
        </g>
      </svg>
    </div>
  );
}
