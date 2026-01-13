interface HealthFlowerProps {
  score: number;
  cardioScore: number;
  metabolismScore: number;
  resistanceScore: number;
  consistencyScore: number;
  size?: number;
}

const HealthFlower = ({
  score,
  cardioScore,
  metabolismScore,
  resistanceScore,
  consistencyScore,
  size = 200
}: HealthFlowerProps) => {
  const center = size / 2;
  const maxRadius = size / 2 - 20;
  
  const getColor = (value: number) => {
    if (value >= 80) return "hsl(var(--health-excellent))";
    if (value >= 60) return "hsl(var(--health-good))";
    if (value >= 40) return "hsl(var(--health-normal))";
    if (value >= 20) return "hsl(var(--health-warning))";
    return "hsl(var(--health-alert))";
  };

  const createPetal = (value: number, angle: number, label: string, icon: string) => {
    const normalizedValue = Math.min(100, Math.max(0, value)) / 100;
    const petalLength = maxRadius * normalizedValue * 0.8;
    const petalWidth = 30;
    const radians = (angle - 90) * (Math.PI / 180);
    
    const endX = center + Math.cos(radians) * petalLength;
    const endY = center + Math.sin(radians) * petalLength;
    
    const control1X = center + Math.cos(radians - 0.3) * (petalLength * 0.6);
    const control1Y = center + Math.sin(radians - 0.3) * (petalLength * 0.6);
    const control2X = center + Math.cos(radians + 0.3) * (petalLength * 0.6);
    const control2Y = center + Math.sin(radians + 0.3) * (petalLength * 0.6);
    
    const labelX = center + Math.cos(radians) * (maxRadius + 15);
    const labelY = center + Math.sin(radians) * (maxRadius + 15);

    return (
      <g key={angle}>
        {/* Petal background (max) */}
        <ellipse
          cx={center}
          cy={center}
          rx={petalWidth}
          ry={maxRadius * 0.8}
          fill="hsl(var(--muted))"
          opacity={0.3}
          transform={`rotate(${angle}, ${center}, ${center})`}
        />
        {/* Petal value */}
        <ellipse
          cx={center}
          cy={center}
          rx={petalWidth * normalizedValue}
          ry={petalLength}
          fill={getColor(value)}
          opacity={0.8}
          transform={`rotate(${angle}, ${center}, ${center})`}
          className="transition-all duration-1000 ease-out"
        />
        {/* Label */}
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground text-xs font-medium"
        >
          {icon}
        </text>
      </g>
    );
  };

  const isCompact = size < 160;
  const labelOffset = isCompact ? 8 : 15;
  const labelFontSize = isCompact ? "9px" : "12px";

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={maxRadius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.5}
        />
        
        {/* Petals */}
        {createPetal(cardioScore, 0, "Kardiyo", "❤️")}
        {createPetal(metabolismScore, 90, "Metabolizma", "🔥")}
        {createPetal(resistanceScore, 180, "Direnç", "💪")}
        {createPetal(consistencyScore, 270, "Devamlılık", "📅")}
        
        {/* Center circle */}
        <circle
          cx={center}
          cy={center}
          r={isCompact ? 22 : 35}
          fill="hsl(var(--card))"
          stroke={getColor(score)}
          strokeWidth={isCompact ? 2 : 4}
          className="shadow-lg"
        />
        
        {/* Score text */}
        <text
          x={center}
          y={center - (isCompact ? 2 : 5)}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground font-bold"
          style={{ fontSize: isCompact ? "16px" : "24px" }}
        >
          {score}
        </text>
        <text
          x={center}
          y={center + (isCompact ? 8 : 12)}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground"
          style={{ fontSize: isCompact ? "7px" : "10px" }}
        >
          /100
        </text>
      </svg>
      
      {/* Labels - positioned based on size */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 font-medium text-muted-foreground flex items-center gap-0.5"
        style={{ top: `-${labelOffset}px`, fontSize: labelFontSize }}
      >
        <span style={{ fontSize: isCompact ? "10px" : "14px" }}>❤️</span> {!isCompact && "Kardiyo"}
      </div>
      <div 
        className="absolute top-1/2 -translate-y-1/2 font-medium text-muted-foreground flex items-center gap-0.5"
        style={{ right: `-${isCompact ? 12 : 60}px`, fontSize: labelFontSize }}
      >
        <span style={{ fontSize: isCompact ? "10px" : "14px" }}>🔥</span> {!isCompact && "Meta"}
      </div>
      <div 
        className="absolute left-1/2 -translate-x-1/2 font-medium text-muted-foreground flex items-center gap-0.5"
        style={{ bottom: `-${labelOffset}px`, fontSize: labelFontSize }}
      >
        <span style={{ fontSize: isCompact ? "10px" : "14px" }}>💪</span> {!isCompact && "Direnç"}
      </div>
      <div 
        className="absolute top-1/2 -translate-y-1/2 font-medium text-muted-foreground flex items-center gap-0.5"
        style={{ left: `-${isCompact ? 12 : 60}px`, fontSize: labelFontSize }}
      >
        <span style={{ fontSize: isCompact ? "10px" : "14px" }}>📅</span> {!isCompact && "Dev."}
      </div>
    </div>
  );
};

export default HealthFlower;
