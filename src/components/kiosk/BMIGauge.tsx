import { Eye, EyeOff, Scale, Ruler } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BMIGaugeProps {
  bmi: number;
  weight: number;
  height: number;
}

const BMIGauge = ({ bmi, weight, height }: BMIGaugeProps) => {
  const [showWeight, setShowWeight] = useState(false);

  const getStatus = (bmiValue: number) => {
    if (bmiValue < 18.5) return { label: "Zayıf", color: "health-warning", category: "underweight" };
    if (bmiValue < 25) return { label: "Normal", color: "health-excellent", category: "normal" };
    if (bmiValue < 30) return { label: "Fazla Kilolu", color: "health-warning", category: "overweight" };
    return { label: "Obez", color: "health-alert", category: "obese" };
  };

  const status = getStatus(bmi);
  
  // Calculate gauge position (0-100%)
  const getGaugePosition = (bmiValue: number) => {
    if (bmiValue < 15) return 5;
    if (bmiValue > 40) return 95;
    return ((bmiValue - 15) / 25) * 90 + 5;
  };

  const gaugePosition = getGaugePosition(bmi);

  // BMI categories for visual
  const categories = [
    { min: 15, max: 18.5, label: "Zayıf", color: "health-warning" },
    { min: 18.5, max: 25, label: "Normal", color: "health-excellent" },
    { min: 25, max: 30, label: "Kilolu", color: "health-warning" },
    { min: 30, max: 40, label: "Obez", color: "health-alert" },
  ];

  return (
    <div className="w-full p-6 bg-card rounded-lg border border-border shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Vücut Kitle İndeksi</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${status.color}/10 ${status.color}`}>
          {status.label}
        </div>
      </div>

      {/* Main BMI value */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className={`text-6xl font-bold ${status.color}`}>{bmi}</span>
        <div className="flex flex-col items-start">
          <span className="text-lg text-muted-foreground">BMI</span>
          <span className="text-sm text-muted-foreground">kg/m²</span>
        </div>
      </div>

      {/* Gauge bar with categories */}
      <div className="relative mb-6">
        <div className="relative h-10 rounded-full overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 flex">
            <div className="w-[14%] bg-health-warning/60" /> {/* 15-18.5 */}
            <div className="w-[26%] bg-health-excellent/60" /> {/* 18.5-25 */}
            <div className="w-[20%] bg-health-warning/60" /> {/* 25-30 */}
            <div className="w-[40%] bg-health-alert/60" /> {/* 30-40 */}
          </div>
          
          {/* Category labels inside gauge */}
          <div className="absolute inset-0 flex items-center text-xs font-medium">
            <div className="w-[14%] text-center text-health-warning/80 truncate px-1">Zayıf</div>
            <div className="w-[26%] text-center text-health-excellent/80">Normal</div>
            <div className="w-[20%] text-center text-health-warning/80 truncate px-1">Kilolu</div>
            <div className="w-[40%] text-center text-health-alert/80">Obez</div>
          </div>
          
          {/* Indicator */}
          <div 
            className="absolute top-0 bottom-0 w-2 bg-foreground rounded-full shadow-lg transition-all duration-1000 ease-out z-10"
            style={{ left: `${gaugePosition}%`, transform: "translateX(-50%)" }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-sm font-bold px-2 py-1 rounded whitespace-nowrap">
              {bmi}
            </div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>15</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40</span>
        </div>
      </div>

      {/* Weight and Height cards */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
        {/* Weight */}
        <div className="p-4 bg-secondary/30 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Scale className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-sm text-muted-foreground">Kilo</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => setShowWeight(!showWeight)}
            >
              {showWeight ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">
              {showWeight ? weight : "•••"}
            </span>
            <span className="text-sm text-muted-foreground">kg</span>
          </div>
        </div>

        {/* Height */}
        <div className="p-4 bg-secondary/30 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Ruler className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">Boy</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{height}</span>
            <span className="text-sm text-muted-foreground">cm</span>
          </div>
        </div>
      </div>

      {/* Ideal weight info */}
      <div className="mt-4 p-3 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-info/20 flex items-center justify-center">
            <span className="text-xs font-bold text-info">i</span>
          </div>
          <span className="text-sm text-muted-foreground">
            İdeal kilo aralığınız: <span className="font-semibold text-foreground">
              {Math.round(18.5 * Math.pow(height / 100, 2))} - {Math.round(24.9 * Math.pow(height / 100, 2))} kg
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default BMIGauge;
