import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Delete, Space, CornerDownLeft, ArrowUp } from "lucide-react";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  variant?: "full" | "compact";
}

const VirtualKeyboard = ({ onKeyPress, onBackspace, onEnter, variant = "full" }: VirtualKeyboardProps) => {
  const [isUpperCase, setIsUpperCase] = useState(false);

  const rows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["q", "w", "e", "r", "t", "y", "u", "ı", "o", "p", "ğ", "ü"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ş", "i"],
    ["z", "x", "c", "v", "b", "n", "m", "ö", "ç"]
  ];

  const handleKeyPress = (key: string) => {
    onKeyPress(isUpperCase ? key.toUpperCase() : key);
  };

  // Large sizes for medical kiosk - readable from distance
  const keySize = variant === "compact" ? "h-14 w-14 text-lg" : "h-16 w-16 text-xl";
  const keyTextSize = variant === "compact" ? "text-lg" : "text-xl";
  const gap = variant === "compact" ? "gap-2" : "gap-3";
  const containerPadding = variant === "compact" ? "p-4" : "p-6";

  return (
    <div className={`w-full max-w-5xl mx-auto rounded-2xl border border-cyan-100/30 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] ${containerPadding}`}
    style={{ backgroundColor: 'rgba(240, 249, 255, 0.02)' }}>
      <div className={`flex flex-col ${gap}`}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={`flex justify-center items-center ${gap}`}>
            {/* Shift button for last row */}
            {rowIndex === 3 && (
              <button
                onClick={() => setIsUpperCase(!isUpperCase)}
                className={`${keySize} rounded-xl border border-cyan-100/30 hover:border-cyan-200/40 transition-all duration-200 flex items-center justify-center font-semibold shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_8px_rgba(207,250,254,0.1)]`}
                style={{ backgroundColor: isUpperCase ? 'rgba(240, 249, 255, 0.04)' : 'rgba(240, 249, 255, 0.02)' }}
              >
                <ArrowUp className="w-6 h-6 text-muted-foreground" />
              </button>
            )}
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`${keySize} rounded-xl border border-cyan-100/30 hover:border-cyan-200/40 transition-all duration-200 flex items-center justify-center font-semibold ${keyTextSize} text-foreground active:scale-95 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_8px_rgba(207,250,254,0.1)]`}
                style={{ backgroundColor: 'rgba(240, 249, 255, 0.02)' }}
              >
                {isUpperCase ? key.toUpperCase() : key}
              </button>
            ))}
            {/* Backspace button for last row */}
            {rowIndex === 3 && (
              <button
                onClick={onBackspace}
                className={`${keySize} rounded-xl border border-cyan-100/30 hover:border-cyan-200/40 transition-all duration-200 flex items-center justify-center shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_8px_rgba(207,250,254,0.1)]`}
                style={{ backgroundColor: 'rgba(240, 249, 255, 0.02)' }}
              >
                <Delete className="w-6 h-6 text-foreground" />
              </button>
            )}
          </div>
        ))}
        
        {/* Bottom row - space and send - Large, clear */}
        <div className={`flex justify-center items-center ${gap} mt-2`}>
          <button
            onClick={() => onKeyPress(" ")}
            className={`${variant === "compact" ? "h-14 w-80" : "h-16 w-96"} rounded-xl border border-cyan-100/30 hover:border-cyan-200/40 transition-all duration-200 flex items-center justify-center gap-3 font-semibold ${keyTextSize} text-foreground active:scale-95 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_8px_rgba(207,250,254,0.1)]`}
            style={{ backgroundColor: 'rgba(240, 249, 255, 0.02)' }}
          >
            <Space className="w-5 h-5" />
            <span>Boşluk</span>
          </button>
          <button
            onClick={onEnter}
            className={`${variant === "compact" ? "h-14 px-8" : "h-16 px-10"} rounded-xl border border-cyan-200/40 transition-all duration-200 flex items-center justify-center gap-3 font-semibold ${keyTextSize} text-foreground active:scale-95 shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_4px_16px_rgba(207,250,254,0.2),0_0_30px_rgba(165,243,252,0.15)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.5),0_6px_20px_rgba(207,250,254,0.25),0_0_40px_rgba(165,243,252,0.2)] hover:border-cyan-300/50`}
            style={{ backgroundColor: 'rgba(207, 250, 254, 0.08)' }}
          >
            <span>Gönder</span>
            <CornerDownLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
