import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Metric {
  label: string;
  value: string;
  unit: string;
  score: number;
}

interface SystemCardProps {
  id: string;
  title: string;
  icon: LucideIcon;
  metrics: Metric[];
  position: 'left' | 'right';
  getTrendColor: (score: number) => string;
  isActive?: boolean;
  onClick?: () => void;
  onHover?: (isHovering: boolean) => void;
}

const SystemCard = ({ id, title, icon: Icon, metrics, position, getTrendColor, isActive, onClick, onHover }: SystemCardProps) => {
  const getTrend = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff > 5) return { icon: TrendingUp, direction: 'up' };
    if (diff < -5) return { icon: TrendingDown, direction: 'down' };
    return { icon: Minus, direction: 'neutral' };
  };

  // Tilt direction based on position - left cards tilt right (toward center), right cards tilt left
  const hoverTiltClass = position === 'left' 
    ? 'hover:[transform:perspective(800px)_rotateY(12deg)_rotateX(-3deg)_translateZ(10px)]' 
    : 'hover:[transform:perspective(800px)_rotateY(-12deg)_rotateX(-3deg)_translateZ(10px)]';

  const activeTiltTransform = position === 'left' 
    ? 'perspective(800px) rotateY(12deg) rotateX(-3deg) translateZ(10px)' 
    : 'perspective(800px) rotateY(-12deg) rotateX(-3deg) translateZ(10px)';

  return (
    <div 
      className={`
        rounded-xl px-6 py-5 relative overflow-hidden
        border border-cyan-100/30
        shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)]
        transition-all duration-200 ease-out
        cursor-pointer
        ${isActive 
          ? 'border-cyan-200/40 shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2),0_0_60px_rgba(165,243,252,0.1)] scale-[1.02]' 
          : `hover:border-cyan-200/40 hover:shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2),0_0_60px_rgba(165,243,252,0.1)] hover:scale-[1.02] ${hoverTiltClass}`
        }
      `}
      style={{ 
        transformStyle: 'preserve-3d',
        transform: isActive ? activeTiltTransform : undefined,
        backgroundColor: 'rgba(240, 249, 255, 0.06)'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border/20">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="text-lg font-sans font-medium text-foreground">{title}</div>
        </div>
        <div className="space-y-3">
          {metrics.map((metric, idx) => {
            const trend = getTrend(metric.score, 75);
            const trendColor = getTrendColor(metric.score);
            return (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-base font-sans font-normal text-muted-foreground">{metric.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-sans font-normal text-foreground">
                    {metric.value}<span className="text-base font-normal text-muted-foreground ml-1">{metric.unit}</span>
                  </span>
                  <div className={`flex items-center gap-1 ${trendColor}`}>
                    <trend.icon className="w-4 h-4" />
                    <span className="text-base font-sans font-normal">{metric.score}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SystemCard;