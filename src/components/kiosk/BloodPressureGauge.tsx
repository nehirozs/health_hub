interface BloodPressureGaugeProps {
  systolic: number;
  diastolic: number;
  pulse?: number;
}

const BloodPressureGauge = ({ systolic, diastolic, pulse }: BloodPressureGaugeProps) => {
  const getStatus = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { label: "Normal", color: "health-excellent" };
    if (sys < 130 && dia < 85) return { label: "Yüksek Normal", color: "health-good" };
    if (sys < 140 && dia < 90) return { label: "Sınırda Yüksek", color: "health-warning" };
    return { label: "Yüksek Tansiyon", color: "health-alert" };
  };

  const status = getStatus(systolic, diastolic);
  
  // Calculate gauge position (0-100%)
  const getGaugePosition = (sys: number) => {
    if (sys < 90) return 10;
    if (sys > 180) return 90;
    return ((sys - 90) / 90) * 80 + 10;
  };

  const gaugePosition = getGaugePosition(systolic);

  return (
    <div className="w-full p-6 bg-card rounded-lg border border-border shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Kan Basıncı</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${status.color}/10 ${status.color}`}>
          {status.label}
        </div>
      </div>

      {/* Main values */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className={`text-5xl font-bold ${status.color}`}>{systolic}</span>
        <span className="text-2xl text-muted-foreground">/</span>
        <span className={`text-4xl font-semibold ${status.color}`}>{diastolic}</span>
        <span className="text-lg text-muted-foreground ml-2">mmHg</span>
      </div>

      {/* Gauge bar */}
      <div className="relative h-8 rounded-full overflow-hidden mb-4">
        {/* Background gradient */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-health-excellent/60" />
          <div className="flex-1 bg-health-good/60" />
          <div className="flex-1 bg-health-warning/60" />
          <div className="flex-1 bg-health-alert/60" />
        </div>
        
        {/* Indicator */}
        <div 
          className="absolute top-0 bottom-0 w-1.5 bg-foreground rounded-full shadow-lg transition-all duration-1000 ease-out"
          style={{ left: `${gaugePosition}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground mb-6">
        <span>90</span>
        <span>120</span>
        <span>140</span>
        <span>160</span>
        <span>180+</span>
      </div>

      {/* Pulse */}
      {pulse && (
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-border">
          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div>
            <span className="text-2xl font-bold text-foreground">{pulse}</span>
            <span className="text-sm text-muted-foreground ml-1">BPM</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodPressureGauge;
