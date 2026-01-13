import { useTheme } from "@/hooks/use-theme";

/**
 * Medical Background Component
 * 
 * Static medical environment background:
 * - Static plexus/network patterns
 * - Static particles
 * - Low contrast
 * - Never animated
 * - Never intersects with cards
 */
const MedicalSciFiBackground = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Generate static plexus/network pattern - no animations
  const generatePlexusNetwork = (id: string, x: number, y: number, nodeCount: number, size: number) => {
    const seed = id.charCodeAt(id.length - 1) || 0;
    const nodes = Array.from({ length: nodeCount }, (_, i) => {
      const angle = (Math.PI * 2 / nodeCount) * i;
      const radius = size * (0.6 + ((seed + i) % 4) * 0.1);
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      };
    });

    return (
      <svg
        key={id}
        className="absolute pointer-events-none"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: `${size * 2}px`,
          height: `${size * 2}px`,
          transform: 'translate(-50%, -50%)',
          opacity: isLight ? 0.08 : 0.15,
          zIndex: 0
        }}
        viewBox={`-${size} -${size} ${size * 2} ${size * 2}`}
      >
        <defs>
          <linearGradient id={`plexus-gradient-${id}`}>
            <stop offset="0%" stopColor={isLight ? 'hsl(var(--primary))' : 'hsl(180 100% 50%)'} stopOpacity={isLight ? 0.2 : 0.3} />
            <stop offset="100%" stopColor={isLight ? 'hsl(var(--primary))' : 'hsl(200 100% 60%)'} stopOpacity={isLight ? 0.15 : 0.25} />
          </linearGradient>
        </defs>
        {/* Connection lines between nodes */}
        {nodes.map((node, i) => {
          const nextNodes = nodes.slice(i + 1);
          return nextNodes.map((nextNode, j) => {
            const dist = Math.sqrt(Math.pow(node.x - nextNode.x, 2) + Math.pow(node.y - nextNode.y, 2));
            if (dist < size * 1.2) {
              return (
                <line
                  key={`${i}-${j}`}
                  x1={node.x}
                  y1={node.y}
                  x2={nextNode.x}
                  y2={nextNode.y}
                  stroke={`url(#plexus-gradient-${id})`}
                  strokeWidth={isLight ? "0.5" : "0.8"}
                  strokeLinecap="round"
                  opacity={isLight ? 0.15 : 0.25}
                />
              );
            }
            return null;
          });
        })}
        {/* Nodes - static dots */}
        {nodes.map((node, i) => (
          <circle
            key={i}
            cx={node.x}
            cy={node.y}
            r={isLight ? "1.5" : "2"}
            fill={isLight ? 'hsl(var(--primary))' : 'hsl(180 100% 50%)'}
            opacity={isLight ? 0.3 : 0.4}
          />
        ))}
      </svg>
    );
  };

  // Generate static particles - no animation
  const particleCount = 15;
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const positions = [
      { left: '15%', top: '12%', size: 3 },
      { left: '85%', top: '18%', size: 4 },
      { left: '10%', top: '45%', size: 2 },
      { left: '90%', top: '52%', size: 3 },
      { left: '12%', top: '78%', size: 4 },
      { left: '88%', top: '82%', size: 3 },
      { left: '25%', top: '25%', size: 2 },
      { left: '75%', top: '30%', size: 3 },
      { left: '20%', top: '65%', size: 4 },
      { left: '80%', top: '70%', size: 2 },
      { left: '30%', top: '15%', size: 3 },
      { left: '70%', top: '22%', size: 4 },
      { left: '18%', top: '35%', size: 2 },
      { left: '82%', top: '38%', size: 3 },
      { left: '22%', top: '85%', size: 4 },
    ];
    const pos = positions[i % positions.length];
    
    return (
      <div
        key={i}
        className="absolute rounded-full pointer-events-none"
        style={{
          left: pos.left,
          top: pos.top,
          width: `${pos.size}px`,
          height: `${pos.size}px`,
          backgroundColor: isLight 
            ? 'hsl(var(--primary) / 0.12)' 
            : 'hsl(180 100% 50% / 0.25)',
          zIndex: 0
        }}
      />
    );
  });

  // Generate static bokeh blur particles
  const bokehCount = 6;
  const bokehParticles = Array.from({ length: bokehCount }).map((_, i) => {
    const positions = [
      { left: '20%', top: '20%', size: 100 },
      { left: '80%', top: '25%', size: 80 },
      { left: '15%', top: '70%', size: 110 },
      { left: '85%', top: '75%', size: 90 },
      { left: '30%', top: '45%', size: 70 },
      { left: '70%', top: '50%', size: 100 },
    ];
    const pos = positions[i % positions.length];
    
    return (
      <div
        key={`bokeh-${i}`}
        className="absolute rounded-full pointer-events-none"
        style={{
          left: pos.left,
          top: pos.top,
          width: `${pos.size}px`,
          height: `${pos.size}px`,
          backgroundColor: isLight
            ? 'hsl(var(--primary) / 0.02)'
            : 'hsl(180 100% 50% / 0.08)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
    );
  });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: isLight
            ? 'linear-gradient(180deg, hsl(216 33% 97%) 0%, hsl(214 32% 98%) 50%, hsl(216 33% 97%) 100%)'
            : 'linear-gradient(135deg, hsl(240 30% 3%) 0%, hsl(240 25% 4%) 30%, hsl(240 30% 3%) 70%, hsl(240 30% 2%) 100%)'
        }}
      />

      {/* Radial gradient light source - static */}
      <div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
        style={{
          backgroundColor: isLight
            ? 'hsl(var(--primary) / 0.015)'
            : 'hsl(180 100% 50% / 0.05)',
          zIndex: 0
        }}
      />

      {/* Secondary light source - static */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"
        style={{
          backgroundColor: isLight
            ? 'hsl(var(--primary) / 0.01)'
            : 'hsl(180 100% 50% / 0.03)',
          zIndex: 0
        }}
      />

      {/* Grid pattern - static, low contrast */}
      <div
        className="absolute inset-0"
        style={{
          opacity: isLight ? 0.08 : 0.12,
          backgroundImage: isLight
            ? `
              linear-gradient(hsl(222 47% 11% / 0.04) 1px, transparent 1px),
              linear-gradient(90deg, hsl(222 47% 11% / 0.04) 1px, transparent 1px)
            `
            : `
              linear-gradient(hsl(180 100% 50% / 0.08) 1px, transparent 1px),
              linear-gradient(90deg, hsl(180 100% 50% / 0.08) 1px, transparent 1px)
            `,
          backgroundSize: '50px 50px',
          zIndex: 0
        }}
      />

      {/* Plexus networks - static */}
      {generatePlexusNetwork('plexus-1', 25, 20, 12, 80)}
      {generatePlexusNetwork('plexus-2', 75, 25, 10, 70)}
      {generatePlexusNetwork('plexus-3', 20, 70, 14, 90)}
      {generatePlexusNetwork('plexus-4', 80, 75, 11, 75)}
      {generatePlexusNetwork('plexus-6', 65, 55, 10, 70)}

      {/* Static particles */}
      {particles}

      {/* Static bokeh blur particles */}
      {bokehParticles}

      {/* Vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: isLight
            ? 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, hsl(0 0% 0% / 0.02) 100%)'
            : 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, hsl(0 0% 0% / 0.3) 100%)',
          zIndex: 0
        }}
      />
    </div>
  );
};

export default MedicalSciFiBackground;
