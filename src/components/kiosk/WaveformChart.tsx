interface WaveformChartProps {
  data?: number[];
  height?: number;
  type?: 'ecg' | 'pulse' | 'sine';
  color?: string;
}

const WaveformChart = ({ 
  data, 
  height = 60, 
  type = 'pulse',
  color = 'hsl(180 100% 50%)'
}: WaveformChartProps) => {
  const width = 180;
  const padding = 10;
  
  // Generate waveform data if not provided
  const generateWaveform = () => {
    if (data) return data;
    
    const points = 60;
    const waveform: number[] = [];
    
    for (let i = 0; i < points; i++) {
      const x = i / points;
      let y = 0.5;
      
      if (type === 'ecg') {
        // ECG pattern: baseline with spikes
        const phase = x * Math.PI * 8;
        if (Math.sin(phase) > 0.7) {
          y = 0.2; // Spike up
        } else if (Math.sin(phase) < -0.7) {
          y = 0.8; // Spike down
        } else {
          y = 0.5 + Math.sin(phase) * 0.1; // Baseline variation
        }
      } else if (type === 'pulse') {
        // Pulse pattern: rhythmic waves
        const phase = x * Math.PI * 6;
        y = 0.5 + Math.sin(phase) * 0.3 * (Math.sin(phase * 0.3) * 0.5 + 0.5);
      } else {
        // Sine wave
        const phase = x * Math.PI * 4;
        y = 0.5 + Math.sin(phase) * 0.25;
      }
      
      waveform.push(y);
    }
    
    return waveform;
  };
  
  const waveformData = generateWaveform();
  const chartHeight = height - padding * 2;
  
  // Create path
  const pathData = waveformData.map((value, index) => {
    const x = padding + (index / (waveformData.length - 1)) * (width - padding * 2);
    const y = padding + value * chartHeight;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`waveform-gradient-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </linearGradient>
        <filter id={`waveform-glow-${type}`}>
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d={pathData}
        stroke={`url(#waveform-gradient-${type})`}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#waveform-glow-${type})`}
      />
    </svg>
  );
};

export default WaveformChart;
