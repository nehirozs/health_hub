import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface VitalCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  unit: string;
  status: "excellent" | "good" | "normal" | "warning" | "alert";
  description?: string;
  children?: ReactNode;
  compact?: boolean;
}

const VitalCard = ({
  icon: Icon,
  title,
  value,
  unit,
  status,
  description,
  children,
  compact = false
}: VitalCardProps) => {
  const statusConfig = {
    excellent: {
      bg: "bg-health-excellent/10",
      border: "border-health-excellent/30",
      text: "text-health-excellent",
      label: "Mükemmel"
    },
    good: {
      bg: "bg-health-good/10",
      border: "border-health-good/30",
      text: "text-health-good",
      label: "İyi"
    },
    normal: {
      bg: "bg-health-normal/10",
      border: "border-health-normal/30",
      text: "text-health-normal",
      label: "Normal"
    },
    warning: {
      bg: "bg-health-warning/10",
      border: "border-health-warning/30",
      text: "text-health-warning",
      label: "Dikkat"
    },
    alert: {
      bg: "bg-health-alert/10",
      border: "border-health-alert/30",
      text: "text-health-alert",
      label: "Uyarı"
    }
  };

  const config = statusConfig[status];

  if (compact) {
    return (
      <div className={`relative rounded-lg border ${config.border} ${config.bg} p-2 transition-all duration-300`}>
        {/* Status indicator */}
        <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.text}`}>
          {config.label}
        </div>

        {/* Icon */}
        <div className={`w-8 h-8 rounded ${config.bg} flex items-center justify-center mb-1`}>
          <Icon className={`w-4 h-4 ${config.text}`} />
        </div>

        {/* Title */}
        <h3 className="text-[10px] font-medium text-muted-foreground">{title}</h3>

        {/* Value */}
        <div className="flex items-baseline gap-0.5">
          <span className={`text-lg font-bold ${config.text}`}>{value}</span>
          <span className="text-[10px] text-muted-foreground">{unit}</span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-[9px] text-muted-foreground truncate">{description}</p>
        )}

        {children}
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg border-2 ${config.border} ${config.bg} p-4 transition-all duration-300 hover:shadow-card`}>
      {/* Status indicator */}
      <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </div>

      {/* Icon - reduced size */}
      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center mb-2`}>
        <Icon className={`w-4 h-4 ${config.text}`} />
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>

      {/* Value */}
      <div className="flex items-baseline gap-1 mb-2">
        <span className={`text-2xl font-bold ${config.text}`}>{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {/* Additional content */}
      {children}
    </div>
  );
};

export default VitalCard;
