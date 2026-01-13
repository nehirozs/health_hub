import { useTheme } from "@/hooks/use-theme";

const GridBackground = ({ className = "" }: { className?: string }) => {
  const { theme } = useTheme();
  // Static particles only - no animation
  const particleCount = 5;
  
  // Position particles near edges
  const getEdgePosition = (index: number) => {
    const edgePositions = [
      { left: '8%', top: '10%' },
      { left: '92%', top: '15%' },
      { left: '5%', top: '85%' },
      { left: '95%', top: '90%' },
      { left: '10%', top: '50%' },
      { left: '90%', top: '45%' },
    ];
    return edgePositions[index % edgePositions.length];
  };
  
  const isLight = theme === "light";
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: isLight 
            ? 'linear-gradient(180deg, hsl(216 33% 97%) 0%, hsl(214 32% 98%) 50%, hsl(216 33% 97%) 100%)'
            : 'linear-gradient(180deg, hsl(220 25% 4%) 0%, hsl(220 30% 6%) 50%, hsl(220 25% 4%) 100%)'
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: isLight
            ? 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, hsl(0 0% 0% / 0.02) 100%)'
            : 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, hsl(0 0% 0% / 0.1) 100%)'
        }}
      />
      
      {/* Grid pattern - static, low contrast */}
      <div 
        className="absolute inset-0"
        style={{
          opacity: isLight ? 0.05 : 0.08,
          backgroundImage: isLight
            ? `
              linear-gradient(hsl(222 47% 11% / 0.015) 1px, transparent 1px),
              linear-gradient(90deg, hsl(222 47% 11% / 0.015) 1px, transparent 1px)
            `
            : `
              linear-gradient(hsl(180 100% 50% / 0.01) 1px, transparent 1px),
              linear-gradient(90deg, hsl(180 100% 50% / 0.01) 1px, transparent 1px)
            `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Radial gradient overlays - static */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{
          backgroundColor: isLight ? 'hsl(var(--primary) / 0.008)' : 'hsl(var(--primary) / 0.015)'
        }}
      />
      <div 
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
        style={{
          backgroundColor: isLight ? 'hsl(var(--primary) / 0.008)' : 'hsl(var(--primary) / 0.015)'
        }}
      />
      
      {/* Particles: static only, no animation */}
      <div className="absolute inset-0">
        {Array.from({ length: particleCount }).map((_, i) => {
          const pos = getEdgePosition(i);
          return (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: pos.left,
                top: pos.top,
                backgroundColor: isLight ? 'hsl(var(--primary) / 0.06)' : 'hsl(var(--primary) / 0.08)'
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GridBackground;
