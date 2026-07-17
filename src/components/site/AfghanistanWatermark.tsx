/**
 * Decorative Afghanistan map watermark rendered as a fixed background layer.
 * Uses a simplified SVG path outline of Afghanistan and a soft radial gradient
 * so it feels like a subtle brand imprint rather than an inline illustration.
 */
export function AfghanistanWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Soft radial wash so the map fades into the surface */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_55%,hsl(var(--surface,0_0%_100%))_100%)]" />

      <svg
        viewBox="0 0 800 600"
        className="absolute left-1/2 top-1/2 h-[130vh] w-[130vh] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="afg-wm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          <pattern id="afg-wm-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" fill="#0f172a" opacity="0.35" />
          </pattern>
        </defs>

        {/* Simplified Afghanistan silhouette (approximate outline) */}
        <g transform="translate(60,40)">
          <path
            d="M120,180 L160,140 L210,120 L260,110 L310,100 L360,95 L410,100
               L460,110 L510,130 L560,155 L595,180 L620,215 L640,255 L635,295
               L610,330 L565,345 L520,340 L495,360 L470,395 L440,420 L400,430
               L360,425 L320,410 L285,395 L250,405 L215,420 L180,410 L150,385
               L125,350 L110,310 L100,270 L105,225 Z"
            fill="url(#afg-wm-grad)"
          />
          <path
            d="M120,180 L160,140 L210,120 L260,110 L310,100 L360,95 L410,100
               L460,110 L510,130 L560,155 L595,180 L620,215 L640,255 L635,295
               L610,330 L565,345 L520,340 L495,360 L470,395 L440,420 L400,430
               L360,425 L320,410 L285,395 L250,405 L215,420 L180,410 L150,385
               L125,350 L110,310 L100,270 L105,225 Z"
            fill="url(#afg-wm-dots)"
          />
          <path
            d="M120,180 L160,140 L210,120 L260,110 L310,100 L360,95 L410,100
               L460,110 L510,130 L560,155 L595,180 L620,215 L640,255 L635,295
               L610,330 L565,345 L520,340 L495,360 L470,395 L440,420 L400,430
               L360,425 L320,410 L285,395 L250,405 L215,420 L180,410 L150,385
               L125,350 L110,310 L100,270 L105,225 Z"
            fill="none"
            stroke="#0f172a"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.6"
          />
          {/* Wakhan corridor accent */}
          <path
            d="M595,180 L650,170 L705,160 L740,155"
            fill="none"
            stroke="#0f172a"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      </svg>
    </div>
  );
}
