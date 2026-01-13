import { useEffect, useState } from "react";

interface BreathingCircleProps {
  phase: "inhale" | "hold" | "exhale";
  duration?: number;
  size?: number;
  onCycleComplete?: () => void;
}

const BreathingCircle = ({ 
  phase, 
  duration = 4,
  size = 192,
  onCycleComplete 
}: BreathingCircleProps) => {
  const [scale, setScale] = useState(1);
  const [instruction, setInstruction] = useState("Nefes alın...");

  const sizeClass = size < 150 ? "w-32 h-32" : "w-48 h-48";
  const innerSize = size < 150 ? "w-24 h-24" : "w-40 h-40";
  const coreSize = size < 150 ? "w-20 h-20" : "w-32 h-32";
  const iconSize = size < 150 ? "w-8 h-8" : "w-12 h-12";
  const textSize = size < 150 ? "text-sm" : "text-lg";

  useEffect(() => {
    switch (phase) {
      case "inhale":
        setScale(1.2);
        setInstruction("Derin nefes alın...");
        break;
      case "hold":
        setScale(1.2);
        setInstruction("Tutun...");
        break;
      case "exhale":
        setScale(1);
        setInstruction("Yavaşça verin...");
        break;
    }
  }, [phase]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Breathing circle - static, no continuous animations */}
      <div className={`relative ${sizeClass} flex items-center justify-center`}>
        {/* Outer rings - static */}
        <div 
          className="absolute w-full h-full rounded-full border-2 border-primary/20 transition-transform duration-300"
          style={{ 
            transform: `scale(${scale})`
          }}
        />
        <div 
          className={`absolute ${innerSize} rounded-full border-2 border-primary/30 transition-transform duration-300`}
          style={{ 
            transform: `scale(${scale})`
          }}
        />
        
        {/* Main circle - elevation instead of glow */}
        <div 
          className={`relative ${coreSize} rounded-full gradient-primary transition-transform duration-300 flex items-center justify-center`}
          style={{ 
            transform: `scale(${scale})`,
            boxShadow: '0 2px 8px hsl(0 0% 0% / 0.15), 0 1px 3px hsl(0 0% 0% / 0.1)',
            border: '1px solid hsl(var(--primary) / 0.2)'
          }}
        >
          {/* Center icon */}
          <svg 
            className={`${iconSize} text-primary-foreground`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </div>
      </div>

      {/* Instruction text - fade-in only */}
      <p className={`${textSize} font-medium text-foreground opacity-0 animate-fade-in`} style={{ animationDuration: '175ms' }}>
        {instruction}
      </p>

      {/* Phase indicator - static */}
      <div className="flex gap-2">
        {["inhale", "hold", "exhale"].map((p) => (
          <div
            key={p}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              phase === p 
                ? "bg-primary scale-110" 
                : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BreathingCircle;
