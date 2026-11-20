function Castle({ ref }) {
  return (
    <svg ref={ref} className="castle" viewBox="0 0 540 300" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        <linearGradient id="castle-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1350" />
          <stop offset="1" stopColor="#05061a" />
        </linearGradient>
        <linearGradient id="castle-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff7eb6" stopOpacity="0" />
          <stop offset=".5" stopColor="#ff7eb6" stopOpacity=".55" />
          <stop offset="1" stopColor="#ff7eb6" stopOpacity="0" />
        </linearGradient>
        <filter id="castle-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M0 260 Q120 220 270 245 T540 238 V300 H0Z" fill="#0a0a2e" />
      <g fill="url(#castle-stone)" stroke="url(#castle-rim)" strokeWidth="1.5">
        <path d="M40 300 V205 h12 v-10 h10 v10 h12 v-10 h10 v10 h12 v-10 h10 v10 h12 v-10 h10 v10 h12 V300Z" />
        <path d="M360 300 V205 h12 v-10 h10 v10 h12 v-10 h10 v10 h12 v-10 h10 v10 h12 v-10 h10 v10 h12 V300Z" />
        <rect x="18" y="170" width="34" height="130" />
        <path d="M12 172 L35 108 L58 172Z" />
        <rect x="488" y="170" width="34" height="130" />
        <path d="M482 172 L505 108 L528 172Z" />
        <rect x="128" y="140" width="44" height="160" />
        <path d="M120 142 L150 62 L180 142Z" />
        <rect x="368" y="140" width="44" height="160" />
        <path d="M360 142 L390 62 L420 142Z" />
        <path d="M170 300 V170 h14 v-12 h12 v12 h14 v-12 h12 v12 h14 v-12 h12 v12 h14 v-12 h12 v12 h14 v-12 h12 v12 h14 v-12 h12 v12 h14 V300Z" />
        <rect x="208" y="112" width="34" height="60" />
        <path d="M202 114 L225 52 L248 114Z" />
        <rect x="298" y="112" width="34" height="60" />
        <path d="M292 114 L315 52 L338 114Z" />
        <rect x="246" y="92" width="48" height="80" />
        <path d="M238 94 L270 6 L302 94Z" />
        <rect x="94" y="176" width="18" height="30" />
        <path d="M90 178 L103 146 L116 178Z" />
        <rect x="428" y="176" width="18" height="30" />
        <path d="M424 178 L437 146 L450 178Z" />
      </g>
      <g fill="#ff7eb6">
        <path d="M270 12 V0 l14 4 -14 4Z" />
        <path d="M150 62 v-12 l12 4 -12 4Z" />
        <path d="M390 62 v-12 l12 4 -12 4Z" />
      </g>
      <g stroke="#ffd35a" strokeWidth="1.2">
        <line x1="270" y1="0" x2="270" y2="8" />
        <line x1="150" y1="48" x2="150" y2="62" />
        <line x1="390" y1="48" x2="390" y2="62" />
      </g>
      <g fill="#ffd35a" filter="url(#castle-glow)">
        <path className="castle-window" d="M262 120 a8 8 0 0 1 16 0 v18 h-16Z" />
        <path className="castle-window" d="M219 130 a6 6 0 0 1 12 0 v14 h-12Z" />
        <path className="castle-window" d="M309 130 a6 6 0 0 1 12 0 v14 h-12Z" />
        <path className="castle-window" d="M144 170 a6 6 0 0 1 12 0 v16 h-12Z" />
        <path className="castle-window" d="M384 170 a6 6 0 0 1 12 0 v16 h-12Z" />
        <path className="castle-window" d="M29 200 a6 6 0 0 1 12 0 v14 h-12Z" />
        <path className="castle-window" d="M499 200 a6 6 0 0 1 12 0 v14 h-12Z" />
        <path className="castle-window" d="M200 200 a6 6 0 0 1 12 0 v14 h-12Z" />
        <path className="castle-window" d="M328 200 a6 6 0 0 1 12 0 v14 h-12Z" />
      </g>
      <path d="M248 300 V250 a22 22 0 0 1 44 0 V300Z" fill="#ffb347" opacity=".85" filter="url(#castle-glow)" />
    </svg>
  );
}

export default Castle;
