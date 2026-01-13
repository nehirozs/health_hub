const DNAHelix = ({ className = "", side = "left" }: { className?: string; side?: "left" | "right" }) => {
  // Significantly reduced visibility - make decorative elements extremely subtle
  const dots = Array.from({ length: 6 }, (_, i) => i); // Reduced from 12 to 6
  
  return (
    <div className={`absolute ${side === "left" ? "left-8" : "right-8"} top-1/2 -translate-y-1/2 ${className}`}>
      <svg 
        width="40" 
        height="400" 
        viewBox="0 0 40 400" 
        className="opacity-[0.04]"
        style={{ pointerEvents: 'none' }}
      >
        {dots.map((i) => {
          const y = i * 64 + 32;
          const offset = Math.sin(i * 0.8) * 8; // Reduced offset
          const size = 2; // Reduced and fixed size - no animation
          
          return (
            <g key={i}>
              {/* Left strand dot - static, very low opacity */}
              <circle
                cx={14 - offset}
                cy={y}
                r={size}
                fill="hsl(180 100% 50%)"
                opacity="0.12"
              />
              {/* Right strand dot - static, very low opacity */}
              <circle
                cx={26 + offset}
                cy={y}
                r={size}
                fill="hsl(180 100% 50%)"
                opacity="0.12"
              />
              {/* Connecting line - barely visible */}
              <line
                x1={14 - offset}
                y1={y}
                x2={26 + offset}
                y2={y}
                stroke="hsl(180 100% 50%)"
                strokeWidth="0.5"
                strokeOpacity="0.08"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default DNAHelix;
