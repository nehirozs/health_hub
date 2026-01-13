import { Thermometer } from "lucide-react";

interface TemperatureGaugeProps {
  value: number;
}

const TemperatureGauge = ({ value }: TemperatureGaugeProps) => {
  const getStatus = (temp: number) => {
    if (temp < 36.0) return { label: "Düşük", color: "health-warning", icon: "❄️" };
    if (temp <= 37.2) return { label: "Normal", color: "health-excellent", icon: "✓" };
    if (temp <= 38.0) return { label: "Yüksek", color: "health-warning", icon: "⚠️" };
    return { label: "Ateş", color: "health-alert", icon: "🔥" };
  };

  const status = getStatus(value);
  
  // Calculate thermometer fill percentage (35-40°C range)
  const getFillPercentage = (temp: number) => {
    if (temp < 35) return 5;
    if (temp > 40) return 100;
    return ((temp - 35) / 5) * 100;
  };

  const fillPercentage = getFillPercentage(value);

  // Get gradient colors based on temperature
  const getGradientColors = (temp: number) => {
    if (temp < 36.0) return { start: "hsl(var(--info))", end: "hsl(var(--health-warning))" };
    if (temp <= 37.2) return { start: "hsl(var(--health-good))", end: "hsl(var(--health-excellent))" };
    if (temp <= 38.0) return { start: "hsl(var(--health-warning))", end: "hsl(var(--warning))" };
    return { start: "hsl(var(--warning))", end: "hsl(var(--health-alert))" };
  };

  const gradientColors = getGradientColors(value);

  return (
    <div className="w-full p-6 bg-card rounded-lg border border-border shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Vücut Sıcaklığı</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${status.color}/10 ${status.color}`}>
          {status.label}
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center gap-8 mb-6">
        {/* Thermometer visual */}
        <div className="relative">
          <svg width="80" height="180" viewBox="0 0 80 180">
            <defs>
              <linearGradient id="tempGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor={gradientColors.start} />
                <stop offset="100%" stopColor={gradientColors.end} />
              </linearGradient>
              <clipPath id="thermometerClip">
                <rect x="25" y="10" width="30" height="120" rx="15" />
                <circle cx="40" cy="145" r="25" />
              </clipPath>
            </defs>
            
            {/* Outer glass */}
            <rect x="22" y="7" width="36" height="126" rx="18" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
            <circle cx="40" cy="145" r="28" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
            
            {/* Inner background */}
            <rect x="25" y="10" width="30" height="120" rx="15" fill="hsl(var(--secondary))" />
            <circle cx="40" cy="145" r="25" fill="hsl(var(--secondary))" />
            
            {/* Mercury fill */}
            <g clipPath="url(#thermometerClip)">
              <rect 
                x="25" 
                y={130 - (fillPercentage * 1.2)} 
                width="30" 
                height={fillPercentage * 1.2 + 50} 
                fill="url(#tempGradient)"
                className="transition-all duration-1000 ease-out"
              />
            </g>
            
            {/* Bulb center glow */}
            <circle cx="40" cy="145" r="15" fill="url(#tempGradient)" opacity="0.8" />
            
            {/* Scale marks */}
            {[35, 36, 37, 38, 39, 40].map((temp, i) => (
              <g key={temp}>
                <line 
                  x1="58" 
                  y1={130 - (i * 24)} 
                  x2="65" 
                  y2={130 - (i * 24)} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth="1.5"
                />
                <text 
                  x="70" 
                  y={133 - (i * 24)} 
                  fontSize="10" 
                  fill="hsl(var(--muted-foreground))"
                >
                  {temp}°
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Temperature value */}
        <div className="text-center">
          <div className="flex items-baseline justify-center">
            <span className={`text-6xl font-bold ${status.color}`}>{value}</span>
            <span className="text-3xl text-muted-foreground">°C</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Thermometer className={`w-5 h-5 ${status.color}`} />
            <span className="text-lg text-muted-foreground">{status.label}</span>
          </div>
        </div>
      </div>

      {/* Temperature range bar */}
      <div className="relative h-8 rounded-full overflow-hidden mb-4">
        <div className="absolute inset-0 flex">
          <div className="w-[20%] bg-info/60" /> {/* < 36 */}
          <div className="w-[28%] bg-health-excellent/60" /> {/* 36-37.2 */}
          <div className="w-[16%] bg-health-warning/60" /> {/* 37.2-38 */}
          <div className="w-[36%] bg-health-alert/60" /> {/* > 38 */}
        </div>
        
        {/* Current position indicator */}
        <div 
          className="absolute top-0 bottom-0 w-1.5 bg-foreground rounded-full shadow-lg transition-all duration-1000 ease-out"
          style={{ left: `${((value - 35) / 5) * 100}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground mb-6">
        <span>35°C</span>
        <span>36°C</span>
        <span>37°C</span>
        <span>38°C</span>
        <span>40°C</span>
      </div>

      {/* Status explanation */}
      <div className={`p-4 rounded-xl bg-${status.color}/10 border border-${status.color}/20`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-${status.color}/20 flex items-center justify-center text-xl`}>
            {status.icon}
          </div>
          <div>
            <p className={`font-semibold ${status.color}`}>{status.label} Sıcaklık</p>
            <p className="text-sm text-muted-foreground">
              {value < 36.0 && "Vücut sıcaklığınız normalin altında. Üşüme hissediyorsanız doktora danışın."}
              {value >= 36.0 && value <= 37.2 && "Vücut sıcaklığınız normal aralıkta."}
              {value > 37.2 && value <= 38.0 && "Hafif ateşiniz var. Bol sıvı tüketin ve dinlenin."}
              {value > 38.0 && "Ateşiniz yüksek. Bir sağlık uzmanına danışmanız önerilir."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureGauge;
