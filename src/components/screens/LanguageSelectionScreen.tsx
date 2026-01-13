import { Globe } from "lucide-react";
import FixedHeader from "@/components/kiosk/FixedHeader";

type Language = "tr" | "en" | "fi";

interface LanguageSelectionScreenProps {
  onSelectLanguage: (lang: Language) => void;
  onBack: () => void;
}

const languages = [
  { code: "tr" as Language, name: "Türkçe", flag: "🇹🇷", native: "Türkçe" },
  { code: "en" as Language, name: "English", flag: "🇬🇧", native: "English" },
  { code: "fi" as Language, name: "Suomi", flag: "🇫🇮", native: "Suomi" }
];

const LanguageSelectionScreen = ({ onSelectLanguage, onBack }: LanguageSelectionScreenProps) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-transparent">
      {/* Fixed Header - Same on all screens */}
      <FixedHeader />

      {/* Back button - positioned below fixed header */}
      <button
        onClick={onBack}
        className="fixed top-6 left-6 z-50 text-base text-muted-foreground hover:text-foreground transition-colors font-medium px-4 py-2 rounded-xl border border-cyan-100/30 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_12px_rgba(207,250,254,0.1)] hover:border-cyan-200/40"
        style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}
      >
        ← Geri
      </button>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 pt-32 pb-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-cyan-100/30 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] mb-8" style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}>
            <Globe className="w-6 h-6 text-primary" />
            <span className="text-xl font-medium text-foreground">Dil Seçin / Select Language</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-sans font-semibold text-foreground tracking-normal leading-tight mb-2">
            Lütfen dilinizi seçin
          </h1>
        </div>

        {/* Language buttons - Large, clear panels */}
        <div className="flex flex-col gap-5 w-full max-w-2xl">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelectLanguage(lang.code)}
              className="group relative p-8 rounded-xl border border-cyan-100/30 transition-all duration-200 hover:border-cyan-200/40 text-left shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2)]"
              style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}
            >
              <div className="relative flex items-center gap-6">
                <span className="text-5xl">{lang.flag}</span>
                <div>
                  <div className="text-2xl font-sans font-semibold text-foreground leading-tight mb-1">{lang.native}</div>
                  <div className="text-lg text-muted-foreground font-normal leading-relaxed">{lang.name}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionScreen;
