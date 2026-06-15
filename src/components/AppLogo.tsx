import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  highlightText?: boolean;
}

export default function AppLogo({ 
  className = "", 
  size = 120, 
  showText = true,
  highlightText = false
}: AppLogoProps) {
  // We use viewbox 0 0 120 170
  // Center is X=60. 
  // Height for scale of justice is from Y=18 to Y=135.
  // Below Y=135 is the gorgeous typography for "عدالتي".
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} id="app-logo-vector-container" style={{ width: size, height: 'auto' }}>
      <svg 
        viewBox="0 0 120 165" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-auto select-none overflow-visible"
      >
        {/* Shadow glow filter for upscale look */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- SCALE OF JUSTICE VECTOR --- */}
        <g strokeLinecap="round" strokeLinejoin="round" className="text-white">
          
          {/* 1. Pointed Top Finial */}
          <path d="M 60 14 L 63.5 22 L 60 30 L 56.5 22 Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="60" cy="30" r="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
          
          {/* 2. Top Ornaments and central cylinder rings */}
          <rect x="58.5" y="32" width="3" height="4" rx="0.5" fill="currentColor" />
          <circle cx="60" cy="40" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="60" cy="40" r="1" fill="currentColor" />
          
          {/* 3. Main Center pillar (Beam socket) */}
          <rect x="58" y="43" width="4" height="75" rx="1" fill="currentColor" />
          
          {/* Ornamental details on standard pillar shaft */}
          <path d="M 56 68 L 64 68" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 55 95 L 65 95" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Elegant pillar pedestal steps */}
          <path d="M 55 112 L 65 112 L 63 118 L 57 118 Z" fill="currentColor" />
          <rect x="52" y="118" width="16" height="3" rx="0.8" fill="currentColor" />
          <rect x="46" y="121" width="28" height="4" rx="1" fill="currentColor" />
          
          {/* 4. Elegant Curved Gallows/Hanger Beam (Symmetrical) */}
          {/* Upper thick arching beam */}
          <path 
            d="M 22 56 Q 60 33 98 56" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
          />
          {/* Reinforcing lower arch beam */}
          <path 
            d="M 31 59 Q 60 45 89 59" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.2" 
          />
          {/* Hooks connection rings at both tips */}
          <circle cx="22" cy="56" r="2" fill="currentColor" />
          <circle cx="98" cy="56" r="2" fill="currentColor" />
          
          {/* 5. Hanging Chains (Left System) */}
          {/* Left inner chain */}
          <line x1="22" y1="56" x2="11" y2="103" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
          {/* Left center chain */}
          <line x1="22" y1="56" x2="22" y2="103" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
          {/* Left outer chain */}
          <line x1="22" y1="56" x2="33" y2="103" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
          
          {/* 6. Hanging Chains (Right System) */}
          {/* Right inner chain */}
          <line x1="98" y1="56" x2="87" y2="103" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
          {/* Right center chain */}
          <line x1="98" y1="56" x2="98" y2="103" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
          {/* Right outer chain */}
          <line x1="98" y1="56" x2="109" y2="103" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
          
          {/* 7. Bowls of Justice (Left & Right Pans) */}
          {/* Left Bowl */}
          <path 
            d="M 11 103 A 11 10 0 0 0 33 103 Z" 
            fill="currentColor" 
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.95"
          />
          <line x1="9.5" y1="103" x2="34.5" y2="103" stroke="currentColor" strokeWidth="2" />
          
          {/* Right Bowl */}
          <path 
            d="M 87 103 A 11 10 0 0 0 109 103 Z" 
            fill="currentColor" 
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.95"
          />
          <line x1="85.5" y1="103" x2="110.5" y2="103" stroke="currentColor" strokeWidth="2" />

        </g>

        {/* --- ARABIC WORD 'عدالتي' --- */}
        {showText && (
          <text 
            x="60" 
            y="158" 
            textAnchor="middle" 
            className={`font-sans select-none tracking-normal ${highlightText ? 'fill-amber-400 font-extrabold' : 'fill-white font-bold'}`}
            style={{ 
              fontFamily: "'Cairo', 'Inter', sans-serif", 
              fontSize: '22px',
              letterSpacing: '-0.3px',
              filter: highlightText ? 'url(#glow)' : 'none'
            }}
          >
            عدالتي
          </text>
        )}
      </svg>
    </div>
  );
}
