import React from 'react';
import { Plus, Minus, RotateCcw, Layers, Train, GraduationCap, Utensils, ShoppingBag, Trees, Hospital, Navigation2 } from 'lucide-react';
import { Neighborhood } from '../types';
import { WORKPLACE_HUBS } from '../data/singaporeData';

interface InteractiveMapProps {
  neighborhood: Neighborhood;
  allNeighborhoods: Neighborhood[];
  onSelectNeighborhood: (n: Neighborhood) => void;
  primaryWorkplaceId: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  neighborhood,
  allNeighborhoods,
  onSelectNeighborhood,
  primaryWorkplaceId,
}) => {
  const [zoomLevel, setZoomLevel] = React.useState<number>(1.4);
  const [activeLayer, setActiveLayer] = React.useState<'all' | 'mrt' | 'schools' | 'hawkers' | 'malls' | 'parks'>('all');
  const [showSchoolRadius, setShowSchoolRadius] = React.useState<boolean>(true);
  const [showCommuteVector, setShowCommuteVector] = React.useState<boolean>(true);
  const [hoveredPin, setHoveredPin] = React.useState<string | null>(null);

  const workplace = WORKPLACE_HUBS.find((h) => h.id === primaryWorkplaceId) || WORKPLACE_HUBS[0];

  // Dynamic viewBox centered on the selected neighborhood
  const targetX = neighborhood.coordinates.svgX;
  const targetY = neighborhood.coordinates.svgY;
  const width = 900 / zoomLevel;
  const height = 550 / zoomLevel;
  const minX = Math.max(50, Math.min(850 - width, targetX - width / 2));
  const minY = Math.max(50, Math.min(500 - height, targetY - height / 2));
  const viewBoxStr = `${minX} ${minY} ${width} ${height}`;

  return (
    <div className="relative w-full h-[320px] sm:h-[400px] bg-slate-100 rounded border border-slate-200 overflow-hidden shadow-inner select-none">
      {/* Top Map Layer Bar - Geometric Balance */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md rounded border border-slate-200 shadow-sm max-w-[calc(100%-80px)]">
        <button
          onClick={() => setActiveLayer('all')}
          className={`px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
            activeLayer === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
          }`}
        >
          All Layers
        </button>

        <button
          onClick={() => setActiveLayer(activeLayer === 'mrt' ? 'all' : 'mrt')}
          className={`px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
            activeLayer === 'mrt' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Train className="w-3.5 h-3.5" />
          <span>MRT</span>
        </button>

        <button
          onClick={() => setActiveLayer(activeLayer === 'schools' ? 'all' : 'schools')}
          className={`px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
            activeLayer === 'schools' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Schools</span>
        </button>

        <button
          onClick={() => setActiveLayer(activeLayer === 'hawkers' ? 'all' : 'hawkers')}
          className={`px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
            activeLayer === 'hawkers' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Food</span>
        </button>

        <button
          onClick={() => setShowSchoolRadius(!showSchoolRadius)}
          className={`px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider border transition-all hidden sm:flex items-center gap-1 ${
            showSchoolRadius ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}
        >
          <span>1km/2km Zone</span>
        </button>
      </div>

      {/* Map Control Buttons (Zoom & Reset) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded border border-slate-200 shadow-sm">
        <button
          id="map-zoom-in"
          onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.3))}
          className="w-7 h-7 rounded-sm hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
          title="Zoom In"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          id="map-zoom-out"
          onClick={() => setZoomLevel((z) => Math.max(1.0, z - 0.3))}
          className="w-7 h-7 rounded-sm hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          id="map-reset-zoom"
          onClick={() => setZoomLevel(1.4)}
          className="w-7 h-7 rounded-sm hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* SVG Singapore & Estate Map */}
      <svg
        viewBox={viewBoxStr}
        className="w-full h-full cursor-grab active:cursor-grabbing transition-all duration-500 ease-out"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Grid Pattern for Roads */}
          <pattern id="roadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.75" />
          </pattern>

          {/* Pulse animation marker */}
          <radialGradient id="greenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base Map Water / Grid */}
        <rect x="0" y="0" width="1000" height="600" fill="#f8fafc" />
        <rect x="0" y="0" width="1000" height="600" fill="url(#roadGrid)" />

        {/* Singapore Mainland Coastline Silhouette */}
        <path
          d="M 140 330 Q 180 290 280 280 Q 380 230 460 210 Q 560 170 650 160 Q 730 180 810 220 Q 860 270 850 320 Q 810 380 730 410 Q 640 430 540 435 Q 440 430 350 410 Q 230 390 140 330 Z"
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Major Waterways / Straits */}
        {/* Johor Strait (North) */}
        <path d="M 280 170 Q 420 160 560 140 Q 680 130 760 160" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
        {/* Singapore River / Marina Bay basin */}
        <path d="M 490 390 Q 520 410 545 425 Q 560 440 540 450" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        {/* Jurong Lake / Reservoir */}
        <ellipse cx="270" cy="340" rx="16" ry="24" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
        {/* Bedok / Tampines Quarry Reservoir */}
        <ellipse cx="710" cy="330" rx="18" ry="12" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />

        {/* Singapore Major MRT Lines */}
        {/* East-West Line (Green) */}
        <path
          d="M 170 335 L 280 335 L 370 360 L 430 390 L 510 415 L 610 370 L 740 300 L 780 340"
          fill="none"
          stroke="#009640"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
        {/* North-South Line (Red) */}
        <path
          d="M 280 335 L 310 240 L 420 130 L 480 200 L 510 280 L 510 415"
          fill="none"
          stroke="#D42E12"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* North-East Line (Purple) */}
        <path
          d="M 510 415 L 530 370 L 620 270 L 630 220 L 640 170"
          fill="none"
          stroke="#74167B"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Downtown Line (Blue) */}
        <path
          d="M 520 410 L 490 320 L 470 240 L 580 320 L 740 300 L 780 340"
          fill="none"
          stroke="#0054A6"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Thomson-East Coast Line (Brown) */}
        <path
          d="M 420 130 L 470 250 L 520 410 L 650 380 L 730 340"
          fill="none"
          stroke="#9D5B25"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* All Other Neighborhood Boundary Outlines */}
        {allNeighborhoods.map((n) => {
          const isSelected = n.id === neighborhood.id;
          return (
            <g key={n.id} onClick={() => onSelectNeighborhood(n)} className="cursor-pointer group">
              {/* Boundary polygon */}
              <path
                d={n.boundaryPath}
                className={`transition-all duration-300 ${
                  isSelected
                    ? 'fill-emerald-100/60 stroke-emerald-600 stroke-[2.5]'
                    : 'fill-neutral-100/40 stroke-neutral-300 stroke-[1.2] hover:fill-emerald-50/50 hover:stroke-emerald-400'
                }`}
              />

              {/* Label */}
              <text
                x={n.coordinates.svgX}
                y={n.coordinates.svgY - 22}
                textAnchor="middle"
                className={`text-[11px] font-extrabold tracking-tight transition-all ${
                  isSelected ? 'fill-neutral-900 font-black' : 'fill-neutral-600'
                }`}
              >
                {n.name}
              </text>
            </g>
          );
        })}

        {/* Active Selected Neighborhood Highlighted Area */}
        <g>
          {/* Green zone aura */}
          <path
            d={neighborhood.boundaryPath}
            fill="#dcfce7"
            fillOpacity="0.75"
            stroke="#16a34a"
            strokeWidth="3"
            strokeDasharray="6 3"
          />

          {/* School 1km and 2km Radius Circles if enabled */}
          {showSchoolRadius && (
            <>
              {/* 1km Priority Zone */}
              <circle
                cx={neighborhood.coordinates.svgX}
                cy={neighborhood.coordinates.svgY}
                r="46"
                fill="#8b5cf6"
                fillOpacity="0.08"
                stroke="#8b5cf6"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              {/* 2km Zone */}
              <circle
                cx={neighborhood.coordinates.svgX}
                cy={neighborhood.coordinates.svgY}
                r="78"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="0.8"
                strokeDasharray="4 4"
                strokeOpacity="0.6"
              />
            </>
          )}

          {/* Commute Vector Line from Neighborhood to Workplace */}
          {showCommuteVector && (
            <g>
              <line
                x1={neighborhood.coordinates.svgX}
                y1={neighborhood.coordinates.svgY}
                x2={workplace.coordinates.svgX}
                y2={workplace.coordinates.svgY}
                stroke="#dc2626"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
              {/* Midpoint commute badge */}
              <g
                transform={`translate(${
                  (neighborhood.coordinates.svgX + workplace.coordinates.svgX) / 2
                }, ${(neighborhood.coordinates.svgY + workplace.coordinates.svgY) / 2 - 10})`}
              >
                <rect x="-35" y="-12" width="70" height="20" rx="10" fill="#1e293b" />
                <text x="0" y="2" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  {neighborhood.commutes[workplace.id]?.mrtDurationMins || 25} min transit
                </text>
              </g>
            </g>
          )}

          {/* Workplace Hub Marker Pin */}
          <g transform={`translate(${workplace.coordinates.svgX}, ${workplace.coordinates.svgY})`}>
            <circle cx="0" cy="0" r="14" fill="#dc2626" fillOpacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="9" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
            <text x="0" y="20" textAnchor="middle" fill="#991b1b" fontSize="10" fontWeight="bold">
              {workplace.shortName}
            </text>
          </g>

          {/* Neighborhood Specific Amenity Pins */}
          {(activeLayer === 'all' || activeLayer === 'mrt') &&
            neighborhood.mrtStations.map((mrt, idx) => {
              const offsetX = (idx - 1) * 22;
              const offsetY = 12 + idx * 8;
              const px = neighborhood.coordinates.svgX + offsetX;
              const py = neighborhood.coordinates.svgY + offsetY;
              return (
                <g
                  key={mrt.code}
                  transform={`translate(${px}, ${py})`}
                  onMouseEnter={() => setHoveredPin(mrt.name)}
                  onMouseLeave={() => setHoveredPin(null)}
                  className="cursor-pointer"
                >
                  <circle cx="0" cy="0" r="10" fill="#2563eb" stroke="#ffffff" strokeWidth="2" shadow="sm" />
                  <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                    M
                  </text>
                  {hoveredPin === mrt.name && (
                    <g transform="translate(0, -18)">
                      <rect x="-45" y="-14" width="90" height="18" rx="4" fill="#0f172a" />
                      <text x="0" y="-2" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                        {mrt.name} ({mrt.code})
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

          {(activeLayer === 'all' || activeLayer === 'schools') &&
            neighborhood.schools.slice(0, 3).map((school, idx) => {
              const angles = [-45, 45, 135];
              const rad = (angles[idx] * Math.PI) / 180;
              const px = neighborhood.coordinates.svgX + Math.cos(rad) * 26;
              const py = neighborhood.coordinates.svgY + Math.sin(rad) * 26;
              return (
                <g
                  key={school.name}
                  transform={`translate(${px}, ${py})`}
                  onMouseEnter={() => setHoveredPin(school.name)}
                  onMouseLeave={() => setHoveredPin(null)}
                  className="cursor-pointer"
                >
                  <circle cx="0" cy="0" r="9" fill="#9333ea" stroke="#ffffff" strokeWidth="2" />
                  <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                    S
                  </text>
                  {hoveredPin === school.name && (
                    <g transform="translate(0, -18)">
                      <rect x="-60" y="-14" width="120" height="18" rx="4" fill="#0f172a" />
                      <text x="0" y="-2" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                        {school.name} ({school.zone})
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

          {(activeLayer === 'all' || activeLayer === 'hawkers') &&
            neighborhood.amenities
              .filter((a) => a.type === 'hawker')
              .slice(0, 2)
              .map((hawker, idx) => {
                const px = neighborhood.coordinates.svgX - 25 - idx * 12;
                const py = neighborhood.coordinates.svgY - 10 + idx * 24;
                return (
                  <g
                    key={hawker.name}
                    transform={`translate(${px}, ${py})`}
                    onMouseEnter={() => setHoveredPin(hawker.name)}
                    onMouseLeave={() => setHoveredPin(null)}
                    className="cursor-pointer"
                  >
                    <circle cx="0" cy="0" r="9" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                    <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                      H
                    </text>
                  </g>
                );
              })}

          {(activeLayer === 'all' || activeLayer === 'malls') &&
            neighborhood.amenities
              .filter((a) => a.type === 'mall')
              .slice(0, 2)
              .map((mall, idx) => {
                const px = neighborhood.coordinates.svgX + 28 + idx * 12;
                const py = neighborhood.coordinates.svgY - 15 + idx * 20;
                return (
                  <g
                    key={mall.name}
                    transform={`translate(${px}, ${py})`}
                    onMouseEnter={() => setHoveredPin(mall.name)}
                    onMouseLeave={() => setHoveredPin(null)}
                    className="cursor-pointer"
                  >
                    <circle cx="0" cy="0" r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                    <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                      R
                    </text>
                  </g>
                );
              })}

          {/* Center Title Badge inside Selected Area */}
          <g transform={`translate(${neighborhood.coordinates.svgX}, ${neighborhood.coordinates.svgY - 4})`}>
            <rect x="-42" y="-12" width="84" height="22" rx="6" fill="#16a34a" />
            <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900" letterSpacing="0.5">
              {neighborhood.name.toUpperCase()}
            </text>
          </g>
        </g>
      </svg>

      {/* Bottom Map Legend */}
      <div className="absolute bottom-2 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-200 shadow-sm text-[11px] font-medium text-neutral-700 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span>MRT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
            <span>School</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
            <span>Hawker</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" />
            <span>Mall</span>
          </div>
          <div className="flex items-center gap-1.5 hidden sm:flex">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
            <span>Workplace</span>
          </div>
        </div>

        <div className="text-[10px] text-neutral-400 bg-white/80 backdrop-blur-md px-2 py-1 rounded-lg border border-neutral-200/60 hidden sm:block">
          Click any estate to inspect
        </div>
      </div>
    </div>
  );
};
