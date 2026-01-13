import { FC } from "react";

interface IconProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

// Medical Heart Icon - Static, monochrome, reduced size
export const FuturisticHeartIcon: FC<IconProps> = ({ className = "", size = 32, animate = false }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 64 64" 
    fill="none" 
    className={className}
  >
    <defs>
      <filter id="heartBlur" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    {/* Main heart - monochrome, no glow */}
    <g>
      <path 
        d="M32 50 L18 36 C12 30 12 22 18 18 C24 14 30 18 32 22 C34 18 40 14 46 18 C52 22 52 30 46 36 L32 50Z"
        fill="currentColor"
        opacity="0.9"
      />
      
      {/* Heart highlight */}
      <path 
        d="M24 22 C22 24 22 28 26 32"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </g>
    
    {/* Static ECG line */}
    <path 
      d="M8 34 L16 34 L20 34 L22 28 L24 40 L26 24 L28 38 L30 30 L32 34 L56 34"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.6"
    />
  </svg>
);

// Medical Oxygen Icon - Static, monochrome, reduced size
export const FuturisticOxygenIcon: FC<IconProps> = ({ className = "", size = 32, animate = false }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 64 64" 
    fill="none" 
    className={className}
  >
    <defs>
      <linearGradient id="oxygenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
      </linearGradient>
    </defs>
    
    {/* Static hexagonal frame */}
    <polygon 
      points="32,2 56,17 56,47 32,62 8,47 8,17"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.3"
    />
    
    {/* Central O2 molecule - static */}
    <g>
      {/* Left oxygen atom */}
      <circle cx="22" cy="28" r="6" fill="currentColor" opacity="0.7" />
      
      {/* Right oxygen atom */}
      <circle cx="42" cy="28" r="6" fill="currentColor" opacity="0.7" />
      
      {/* Molecular bond */}
      <rect x="26" y="26" width="12" height="4" rx="2" fill="currentColor" opacity="0.5" />
    </g>
    
    {/* Static pulse wave */}
    <path 
      d="M4 52 L12 52 L16 48 L20 56 L24 44 L28 54 L32 48 L36 52 L60 52"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.5"
    />
    
    {/* O2 label */}
    <g>
      <rect x="24" y="4" width="16" height="8" rx="2" fill="currentColor" opacity="0.15" />
      <text x="32" y="10" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="bold" opacity="0.7">
        O₂
      </text>
    </g>
  </svg>
);

// Medical Scale Icon - Static, monochrome, reduced size
export const FuturisticScaleIcon: FC<IconProps> = ({ className = "", size = 32, animate = false }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 64 64" 
    fill="none" 
    className={className}
  >
    <defs>
      <linearGradient id="scaleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.7" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    
    {/* Static base */}
    <ellipse cx="32" cy="54" rx="26" ry="7" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
    
    {/* Human figure - static */}
    <g>
      {/* Head */}
      <circle cx="32" cy="14" r="6" fill="currentColor" opacity="0.7" />
      
      {/* Body frame */}
      <path 
        d="M32 20 L32 36 M22 28 L42 28 M32 36 L22 50 M32 36 L42 50"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </g>
    
    {/* Height measurement bar - static */}
    <g>
      <rect x="56" y="10" width="4" height="40" rx="2" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
    </g>
    
    {/* BMI display panel */}
    <g>
      <rect x="4" y="20" width="14" height="24" rx="2" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <text x="11" y="30" textAnchor="middle" fill="currentColor" fontSize="5" fontWeight="bold" opacity="0.6">BMI</text>
    </g>
  </svg>
);

// Medical Thermometer Icon - Static, monochrome, reduced size
export const FuturisticThermometerIcon: FC<IconProps> = ({ className = "", size = 32, animate = false }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 64 64" 
    fill="none" 
    className={className}
  >
    <defs>
      <linearGradient id="tempGradient2" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
        <stop offset="50%" stopColor="currentColor" stopOpacity="0.7" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
      </linearGradient>
    </defs>
    
    {/* Thermometer body - static */}
    <g>
      <rect x="24" y="6" width="16" height="38" rx="8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <rect x="26" y="8" width="12" height="34" rx="6" fill="rgba(255,255,255,0.05)" />
    </g>
    
    {/* Temperature bulb - static */}
    <circle cx="32" cy="52" r="10" fill="currentColor" opacity="0.6" />
    
    {/* Static mercury column */}
    <rect x="28" y="18" width="8" height="20" rx="4" fill="currentColor" opacity="0.7" />
    
    {/* Scale markers - static */}
    {[10, 18, 26, 34].map((y, i) => (
      <g key={i}>
        <line x1="40" y1={y} x2={i % 2 === 0 ? "46" : "44"} y2={y} stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </g>
    ))}
    
    {/* Temperature readout */}
    <g>
      <rect x="44" y="22" width="18" height="12" rx="2" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <text x="53" y="30" textAnchor="middle" fill="currentColor" fontSize="7" fontWeight="bold" opacity="0.6">
        °C
      </text>
    </g>
    
    {/* IR sensor - static */}
    <g>
      <circle cx="10" cy="32" r="6" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="10" cy="32" r="3" fill="currentColor" opacity="0.5" />
      
      {/* IR beam - static */}
      <line x1="16" y1="32" x2="24" y2="32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.4" />
    </g>
  </svg>
);

// Medical Doctor Icon - Static, monochrome, reduced size
export const FuturisticDoctorIcon: FC<IconProps> = ({ className = "", size = 32, animate = false }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 64 64" 
    fill="none" 
    className={className}
  >
    <defs>
      <linearGradient id="doctorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.7" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    
    {/* Circular ring - static */}
    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="6 3" />
    
    {/* ecliniq text logo */}
    <text x="32" y="36" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold" opacity="0.7">
      ecliniq
    </text>
    
    {/* Medical cross - static */}
    <rect x="28" y="16" width="8" height="2" rx="1" fill="currentColor" opacity="0.5" />
    <rect x="31" y="13" width="2" height="8" rx="1" fill="currentColor" opacity="0.5" />
  </svg>
);

export default {
  FuturisticHeartIcon,
  FuturisticOxygenIcon,
  FuturisticScaleIcon,
  FuturisticThermometerIcon,
  FuturisticDoctorIcon,
};
