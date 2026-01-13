interface RadarChartProps {
  data: {
    label: string;
    value: number; // 0-100
    color?: string;
  }[];
  size?: number;
}

const RadarChart = ({ data, size = 200 }: RadarChartProps) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = (size / 2) - 30;
  const levels = 4;
  
  const angleStep = (2 * Math.PI) / data.length;
  
  // Generate polygon points for data
  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };
  
  // Data polygon path
  const dataPoints = data.map((d, i) => getPoint(i, d.value));
  const dataPath = dataPoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';
  
  // Grid polygons
  const gridPolygons = Array.from({ length: levels }, (_, level) => {
    const levelValue = ((level + 1) / levels) * 100;
    const points = data.map((_, i) => getPoint(i, levelValue));
    return points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ') + ' Z';
  });

  // Label positions
  const labelPoints = data.map((d, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const labelRadius = maxRadius + 20;
    return {
      x: centerX + labelRadius * Math.cos(angle),
      y: centerY + labelRadius * Math.sin(angle),
      label: d.label,
      value: d.value
    };
  });

  return (
    <svg width={size} height={size} className="drop-shadow-lg">
      {/* Background glow */}
      <defs>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(142 76% 36%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity="0.2" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background circle glow */}
      <circle cx={centerX} cy={centerY} r={maxRadius} fill="url(#radarGlow)" />
      
      {/* Grid polygons */}
      {gridPolygons.map((path, i) => (
        <path
          key={i}
          d={path}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          opacity={0.3 + (i * 0.15)}
        />
      ))}
      
      {/* Axis lines */}
      {data.map((_, i) => {
        const endPoint = getPoint(i, 100);
        return (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.3"
          />
        );
      })}
      
      {/* Data polygon */}
      <path
        d={dataPath}
        fill="url(#radarFill)"
        stroke="hsl(142 76% 36%)"
        strokeWidth="2"
        filter="url(#glow)"
        className="transition-all duration-700"
      />
      
      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="hsl(142 76% 36%)"
          stroke="hsl(var(--background))"
          strokeWidth="2"
          className="transition-all duration-500"
        />
      ))}
      
      {/* Labels */}
      {labelPoints.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground text-[9px] font-medium"
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
};

export default RadarChart;
