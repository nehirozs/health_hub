import { Heart, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const FixedHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center border border-cyan-100/30 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)]"
        style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}>
          <Heart className="w-6 h-6 text-primary" fill="currentColor" />
        </div>
        <span className="text-2xl font-sans font-semibold text-foreground">ecliniq</span>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 border border-cyan-100/30 hover:border-cyan-200/40 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2)]"
        style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-foreground" />
        ) : (
          <Moon className="w-5 h-5 text-foreground" />
        )}
      </button>
    </div>
  );
};

export default FixedHeader;
