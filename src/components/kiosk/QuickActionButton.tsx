import { LucideIcon } from "lucide-react";

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

const QuickActionButton = ({
  icon: Icon,
  label,
  description,
  onClick,
  variant = "default"
}: QuickActionButtonProps) => {
  const variantStyles = {
    default: "bg-card border-border hover:border-primary/50 hover:bg-secondary",
    primary: "bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary",
    success: "bg-success/10 border-success/30 hover:bg-success/20 text-success",
    warning: "bg-warning/10 border-warning/30 hover:bg-warning/20 text-warning",
    danger: "bg-destructive/10 border-destructive/30 hover:bg-destructive/20 text-destructive"
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left group hover:shadow-card active:scale-[0.98] ${variantStyles[variant]}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
          variant === "default" 
            ? "bg-secondary group-hover:bg-primary/10" 
            : ""
        }`}>
          <Icon className={`w-6 h-6 ${variant === "default" ? "text-foreground" : ""}`} />
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${variant === "default" ? "text-foreground" : ""}`}>
            {label}
          </h4>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <svg 
          className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

export default QuickActionButton;
