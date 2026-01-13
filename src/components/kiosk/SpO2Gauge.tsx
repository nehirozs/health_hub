import { Activity } from "lucide-react";

interface SpO2GaugeProps {
  value: number;
  pulse?: number;
}

const SpO2Gauge = ({ value, pulse }: SpO2GaugeProps) => {
  const getStatus = (spo2: number) => {
    if (spo2 >= 98) return { label: "Mükemmel", color: "health-excellent" };
    if (spo2 >= 95) return { label: "Normal", color: "health-good" };
    if (spo2 >= 90) return { label: "Düşük", color: "health-warning" };
    return { label: "Kritik", color: "health-alert" };
  };

  const status = getStatus(value);
  
  // Calculate gauge position (0-100%)
  const getGaugePosition = (spo2: number) => {
    if (spo2 < 85) return 5;
    if (spo2 > 100) return 95;
    return ((spo2 - 85) / 15) * 90 + 5;
  };

  const gaugePosition = getGaugePosition(value);

  // Calculate arc path for circular gauge
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const arcPercentage = Math.min(value, 100) / 100;
  const strokeDasharray = `${arcPercentage * circumference * 0.75} ${circumference}`;

  return (
    <div className="w-full p-6 bg-card rounded-lg border border-border shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Oksijen Satürasyonu</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${status.color}/10 ${status.color}`}>
          {status.label}
        </div>
      </div>

      {/* Circular Gauge */}
      <div className="relative flex items-center justify-center mb-6">
        <svg width="200" height="150" viewBox="0 0 200 150" className="transform -rotate-0">
          {/* Background arc */}
          <path
            d="M 20 130 A 80 80 0 0 1 180 130"
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Gradient segments */}
          <defs>
            <linearGradient id="spo2Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--health-alert))" />
              <stop offset="33%" stopColor="hsl(var(--health-warning))" />
              <stop offset="66%" stopColor="hsl(var(--health-good))" />
              <stop offset="100%" stopColor="hsl(var(--health-excellent))" />
            </linearGradient>
          </defs>
          
          {/* Colored segments background */}
          <path
            d="M 20 130 A 80 80 0 0 1 60 55"
            fill="none"
            stroke="hsl(var(--health-alert))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity="0.3"
          />
          <path
            d="M 60 50 A 80 80 0 0 1 100 35"
            fill="none"
            stroke="hsl(var(--health-warning))"
            strokeWidth={strokeWidth}
            opacity="0.3"
          />
          <path
            d="M 100 35 A 80 80 0 0 1 140 50"
            fill="none"
            stroke="hsl(var(--health-good))"
            strokeWidth={strokeWidth}
            opacity="0.3"
          />
          <path
            d="M 140 55 A 80 80 0 0 1 180 130"
            fill="none"
            stroke="hsl(var(--health-excellent))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity="0.3"
          />
          
          {/* Indicator needle */}
          <g transform={`rotate(${-135 + (gaugePosition * 2.7)}, 100, 130)`}>
            <line
              x1="100"
              y1="130"
              x2="100"
              y2="60"
              stroke="hsl(var(--foreground))"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="130" r="8" fill="hsl(var(--foreground))" />
          </g>
        </svg>

        {/* Center value */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
          <div className="flex items-baseline justify-center">
            <span className={`text-5xl font-bold ${status.color}`}>{value}</span>
            <span className="text-2xl text-muted-foreground ml-1">%</span>
          </div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Activity className="w-4 h-4 text-info" />
            <span className="text-sm text-muted-foreground">SpO2</span>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground mb-4 px-2">
        <span>85%</span>
        <span>90%</span>
        <span>95%</span>
        <span>100%</span>
      </div>

      {/* Pulse wave visualization */}
      {pulse && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-full h-8 relative overflow-hidden">
                <svg viewBox="0 0 200 40" className="w-32 h-8">
                  <path
                    d="M0,20 L30,20 L35,5 L40,35 L45,15 L50,25 L55,20 L100,20 L105,5 L110,35 L115,15 L120,25 L125,20 L200,20"
                    fill="none"
                    stroke="hsl(var(--info))"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">{pulse}</span>
                <span className="text-sm text-muted-foreground ml-1">BPM</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpO2Gauge;
