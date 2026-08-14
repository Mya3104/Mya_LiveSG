import React from 'react';

export const SingaporeSkylineIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 540 190"
        className="w-full max-w-lg h-auto text-neutral-300 stroke-neutral-400 fill-none select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Background Clouds */}
        <path
          d="M 50 50 Q 60 40 75 42 Q 90 40 100 50 Q 115 50 120 60 L 45 60 Z"
          className="stroke-neutral-200 fill-neutral-50/50"
          strokeWidth="1"
        />
        <path
          d="M 400 35 Q 415 25 430 28 Q 445 25 455 35 Q 470 35 475 45 L 395 45 Z"
          className="stroke-neutral-200 fill-neutral-50/50"
          strokeWidth="1"
        />

        {/* Singapore Flyer */}
        <g transform="translate(60, 65)">
          <circle cx="35" cy="35" r="32" strokeWidth="1.5" className="stroke-neutral-300" strokeDasharray="3 3" />
          <circle cx="35" cy="35" r="28" strokeWidth="1.2" className="stroke-neutral-400" />
          <circle cx="35" cy="35" r="5" className="stroke-neutral-500 fill-neutral-100" strokeWidth="1.5" />
          {/* Wheel Spokes */}
          <line x1="35" y1="7" x2="35" y2="63" strokeWidth="0.8" className="stroke-neutral-300" />
          <line x1="7" y1="35" x2="63" y2="35" strokeWidth="0.8" className="stroke-neutral-300" />
          <line x1="15" y1="15" x2="55" y2="55" strokeWidth="0.8" className="stroke-neutral-300" />
          <line x1="15" y1="55" x2="55" y2="15" strokeWidth="0.8" className="stroke-neutral-300" />
          {/* Wheel Support Legs */}
          <line x1="35" y1="35" x2="15" y2="85" strokeWidth="2" className="stroke-neutral-400" />
          <line x1="35" y1="35" x2="55" y2="85" strokeWidth="2" className="stroke-neutral-400" />
          {/* Flyer Pods */}
          <circle cx="35" cy="7" r="2.5" className="fill-neutral-400 stroke-none" />
          <circle cx="63" cy="35" r="2.5" className="fill-neutral-400 stroke-none" />
          <circle cx="35" cy="63" r="2.5" className="fill-neutral-400 stroke-none" />
          <circle cx="7" cy="35" r="2.5" className="fill-neutral-400 stroke-none" />
        </g>

        {/* Marina Bay Sands Complex */}
        <g transform="translate(200, 30)">
          {/* Tower 1 */}
          <path d="M 40 120 L 40 45 Q 40 40 45 40 L 58 40 Q 62 40 62 45 L 62 120 Z" strokeWidth="1.5" className="stroke-neutral-400 fill-white" />
          {/* Tower 2 */}
          <path d="M 80 120 L 80 45 Q 80 40 85 40 L 98 40 Q 102 40 102 45 L 102 120 Z" strokeWidth="1.5" className="stroke-neutral-400 fill-white" />
          {/* Tower 3 */}
          <path d="M 120 120 L 120 45 Q 120 40 125 40 L 138 40 Q 142 40 142 45 L 142 120 Z" strokeWidth="1.5" className="stroke-neutral-400 fill-white" />

          {/* Tower Window Lines */}
          <line x1="45" y1="55" x2="57" y2="55" strokeWidth="0.8" className="stroke-neutral-300" />
          <line x1="45" y1="70" x2="57" y2="70" strokeWidth="0.8" className="stroke-neutral-300" />
          <line x1="45" y1="85" x2="57" y2="85" strokeWidth="0.8" className="stroke-neutral-300" />
          <line x1="45" y1="100" x2="57" y2="100" strokeWidth="0.8" className="stroke-neutral-300" />

          <line x1="85" y1="55" x2="97" y2="55" strokeWidth="0.8" className="stroke-neutral-300" />
          <line x1="85" y1="70" x2="97" y2="70" strokeWidth="0.8" className="stroke-neutral-300" />
          <line x1="85" y1="85" x2="97" y2="85" strokeWidth="0.8" className="stroke-neutral-300" />
          <line x1="85" y1="100" x2="97" y2="100" strokeWidth="0.8" className="stroke-neutral-300" />

          <line x1="125" y1="55" x2="137" y2="55" strokeWidth="0.8" className="stroke-neutral-300" />
          <line x1="125" y1="70" x2="137" y2="70" strokeWidth="0.8" className="stroke-neutral-300" />
          <line x1="125" y1="85" x2="137" y2="85" strokeWidth="0.8" className="stroke-neutral-300" />
          <line x1="125" y1="100" x2="137" y2="100" strokeWidth="0.8" className="stroke-neutral-300" />

          {/* SkyPark Cantilever Boat */}
          <path
            d="M 25 38 Q 90 28 175 32 L 180 37 Q 95 38 30 46 Z"
            strokeWidth="1.8"
            className="stroke-neutral-500 fill-neutral-100"
          />
          {/* SkyPark Trees & Infinity Pool */}
          <circle cx="150" cy="27" r="3" className="stroke-neutral-400 fill-emerald-50" strokeWidth="1" />
          <circle cx="158" cy="28" r="2.5" className="stroke-neutral-400 fill-emerald-50" strokeWidth="1" />
          <circle cx="166" cy="29" r="2" className="stroke-neutral-400 fill-emerald-50" strokeWidth="1" />
        </g>

        {/* ArtScience Museum Lotus */}
        <g transform="translate(145, 105)">
          <path
            d="M 10 45 Q 15 25 25 20 Q 30 35 32 45 M 25 20 Q 35 15 45 22 Q 42 35 40 45 M 45 22 Q 55 25 60 45"
            strokeWidth="1.4"
            className="stroke-neutral-400 fill-white"
          />
          <path d="M 8 45 L 62 45" strokeWidth="1.5" className="stroke-neutral-400" />
        </g>

        {/* Supertrees Grove (Gardens by the Bay) */}
        <g transform="translate(370, 85)">
          {/* Main Supertree */}
          <path d="M 30 65 Q 26 40 18 20 Q 30 10 42 20 Q 34 40 30 65 Z" strokeWidth="1.5" className="stroke-neutral-400 fill-neutral-50" />
          <ellipse cx="30" cy="18" rx="14" ry="7" strokeWidth="1.2" className="stroke-neutral-400 fill-emerald-50" />
          {/* Smaller Supertree */}
          <path d="M 60 65 Q 58 45 50 30 Q 60 22 70 30 Q 62 45 60 65 Z" strokeWidth="1.2" className="stroke-neutral-400 fill-neutral-50" />
          <ellipse cx="60" cy="28" rx="11" ry="5" strokeWidth="1.2" className="stroke-neutral-400 fill-emerald-50" />
        </g>

        {/* CBD Financial Towers */}
        <g transform="translate(440, 45)">
          {/* Guoco Tower / High-Rise 1 */}
          <rect x="10" y="20" width="22" height="85" strokeWidth="1.5" className="stroke-neutral-400 fill-white" rx="1" />
          <line x1="21" y1="20" x2="21" y2="105" strokeWidth="0.8" className="stroke-neutral-300" />
          <line x1="21" y1="20" x2="21" y2="10" strokeWidth="1.5" className="stroke-neutral-400" />

          {/* CapitaSpring / High-Rise 2 */}
          <rect x="36" y="35" width="20" height="70" strokeWidth="1.4" className="stroke-neutral-400 fill-white" rx="1" />
          <line x1="36" y1="55" x2="56" y2="55" strokeWidth="0.8" className="stroke-neutral-300" />
          <line x1="36" y1="75" x2="56" y2="75" strokeWidth="0.8" className="stroke-neutral-300" />

          {/* UOB Plaza style spire */}
          <rect x="60" y="45" width="18" height="60" strokeWidth="1.4" className="stroke-neutral-400 fill-white" rx="1" />
        </g>

        {/* Base Waterfront & Shoreline */}
        <line x1="20" y1="150" x2="520" y2="150" strokeWidth="1.5" className="stroke-neutral-300" />
        <path d="M 40 156 Q 80 154 120 156 Q 160 158 200 156 Q 240 154 280 156 Q 320 158 360 156 Q 400 154 440 156 Q 480 158 500 156" strokeWidth="1" className="stroke-neutral-200" />
        <path d="M 60 162 Q 120 160 180 162 Q 240 164 300 162 Q 360 160 420 162 Q 480 164 510 162" strokeWidth="0.8" className="stroke-neutral-200" />
      </svg>
    </div>
  );
};
