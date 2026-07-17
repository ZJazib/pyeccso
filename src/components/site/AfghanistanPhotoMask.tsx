/**
 * Hero visual: a photo clipped to the outline of Afghanistan, surrounded by
 * decorative accent dots — inspired by editorial NGO layouts where the country
 * map itself becomes a window into the community it serves.
 */
type Props = {
  src: string;
  alt?: string;
  className?: string;
};

// Simplified Afghanistan outline (viewBox 0 0 800 520). Not survey-accurate;
// stylised for a bold silhouette that reads at hero scale.
const AFG_PATH =
  "M60,240 L120,200 L170,175 L220,160 L260,145 L300,130 L345,120 L395,115 L445,120 L495,130 L540,150 L570,180 L595,215 L620,245 L655,255 L695,250 L735,260 L755,290 L740,325 L700,345 L660,340 L620,335 L590,355 L560,390 L530,415 L490,430 L445,438 L400,435 L360,420 L320,405 L285,415 L245,430 L205,425 L170,405 L140,375 L115,340 L95,300 L75,270 Z";

export function AfghanistanPhotoMask({ src, alt = "", className = "" }: Props) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 800 520"
        className="w-full h-auto drop-shadow-[0_25px_45px_rgba(15,23,42,0.35)]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="afg-photo-clip" clipPathUnits="userSpaceOnUse">
            <path d={AFG_PATH} />
          </clipPath>
          <linearGradient id="afg-photo-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
        </defs>

        {/* Clipped photo */}
        <g clipPath="url(#afg-photo-clip)">
          <image
            href={src}
            x="40"
            y="90"
            width="740"
            height="380"
            preserveAspectRatio="xMidYMid slice"
          />
          {/* subtle warmth overlay so photo blends with palette */}
          <rect
            x="0"
            y="0"
            width="800"
            height="520"
            fill="url(#afg-photo-stroke)"
            opacity="0.08"
          />
        </g>

        {/* Country outline stroke */}
        <path
          d={AFG_PATH}
          fill="none"
          stroke="url(#afg-photo-stroke)"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Decorative accent dots (editorial NGO style) */}
        <circle cx="90" cy="120" r="10" fill="#38bdf8" />
        <circle cx="55" cy="200" r="6" fill="#f59e0b" />
        <circle cx="130" cy="90" r="4" fill="#0f766e" />
        <circle cx="720" cy="120" r="8" fill="#ef4444" />
        <circle cx="770" cy="200" r="5" fill="#38bdf8" />
        <circle cx="700" cy="400" r="9" fill="#f59e0b" />
        <circle cx="620" cy="470" r="5" fill="#0f766e" />
        <circle cx="140" cy="470" r="7" fill="#38bdf8" />
        <circle cx="60" cy="360" r="4" fill="#ef4444" />
        {/* Small dot cluster in negative space (top-left) */}
        <circle cx="180" cy="60" r="3" fill="#94a3b8" opacity="0.7" />
        <circle cx="220" cy="70" r="3" fill="#94a3b8" opacity="0.7" />
        <circle cx="200" cy="45" r="3" fill="#94a3b8" opacity="0.7" />

        <title>Afghanistan — communities served by PYECSO</title>
      </svg>
    </div>
  );
}

/** Export path in case other layouts want to reuse the silhouette. */
export const AFGHANISTAN_SILHOUETTE_PATH = AFG_PATH;
