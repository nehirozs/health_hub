import { useState } from "react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "@/hooks/use-theme";
import { User, Smartphone, Shield, ArrowRight, ArrowLeft, CreditCard, Building } from "lucide-react";

interface WelcomeScreenProps {
  onGuestStart: () => void;
  onAuthStart: () => void;
  onBack: () => void;
  language?: "tr" | "en" | "fi";
}

const translations = {
  tr: {
    title: "Hoş Geldiniz",
    subtitle: "Nasıl devam etmek istersiniz?",
    enabiz: "e-Nabız / e-Devlet ile Giriş",
    enabizDesc: "Kimliğinizi doğrulayın, geçmiş verilerinize erişin",
    guest: "Misafir Olarak Devam",
    guestDesc: "Hızlı ölçüm yapın, kayıt gerekmez",
    consent: "Gizlilik ve Onay",
    kvkkTitle: "AYDINLATMA METNİ",
    kvkkText: "6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, kişisel sağlık verileriniz ecliniq sistemi tarafından sağlık hizmeti sunumu amacıyla işlenecektir.",
    kvkkAccept: "Kişisel sağlık verilerimin işlenmesini kabul ediyorum.",
    enabizConsent: "Sonuçlarımın e-Nabız profilime gönderilmesini onaylıyorum.",
    back: "Geri",
    continue: "Devam Et",
    privacy: "Verileriniz uçtan uca şifreli olarak korunmaktadır"
  },
  en: {
    title: "Welcome",
    subtitle: "How would you like to continue?",
    enabiz: "Login with e-Nabız / e-Devlet",
    enabizDesc: "Verify your identity, access your history",
    guest: "Continue as Guest",
    guestDesc: "Quick measurement, no registration required",
    consent: "Privacy and Consent",
    kvkkTitle: "PRIVACY NOTICE",
    kvkkText: "In accordance with the Personal Data Protection Law, your personal health data will be processed by the ecliniq system for the purpose of providing health services.",
    kvkkAccept: "I accept the processing of my personal health data.",
    enabizConsent: "I approve sending my results to my e-Nabız profile.",
    back: "Back",
    continue: "Continue",
    privacy: "Your data is protected with end-to-end encryption"
  },
  fi: {
    title: "Tervetuloa",
    subtitle: "Miten haluaisit jatkaa?",
    enabiz: "Kirjaudu e-Nabız / e-Devlet",
    enabizDesc: "Vahvista henkilöllisyytesi, käytä historiaasi",
    guest: "Jatka Vieraana",
    guestDesc: "Nopea mittaus, ei rekisteröintiä",
    consent: "Yksityisyys ja Suostumus",
    kvkkTitle: "TIETOSUOJAILMOITUS",
    kvkkText: "Henkilötietolain mukaisesti henkilökohtaisia terveystietojasi käsitellään ecliniq-järjestelmässä terveyspalvelujen tarjoamiseksi.",
    kvkkAccept: "Hyväksyn henkilökohtaisten terveystietojeni käsittelyn.",
    enabizConsent: "Hyväksyn tulosten lähettämisen e-Nabız-profiiliini.",
    back: "Takaisin",
    continue: "Jatka",
    privacy: "Tietosi on suojattu päästä päähän -salauksella"
  }
};

const WelcomeScreen = ({ onGuestStart, onAuthStart, onBack, language = "tr" }: WelcomeScreenProps) => {
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [enabizConsent, setEnabizConsent] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"guest" | "auth" | null>(null);
  const { theme } = useTheme();

  const t = translations[language];

  const handleModeSelect = (mode: "guest" | "auth") => {
    setSelectedMode(mode);
    setShowConsent(true);
  };

  const handleContinue = () => {
    if (selectedMode === "guest") {
      onGuestStart();
    } else {
      onAuthStart();
    }
  };

  return (
    <KioskLayout 
      showAvatar={false}
      avatarMood="speaking" 
      title={t.title}
      subtitle={t.subtitle}
    >
      <div className="max-w-3xl mx-auto flex flex-col h-full">
        {!showConsent ? (
          /* Mode Selection - Large Clinical Panels */
          <div className="flex-1 flex flex-col justify-center gap-6">
            {/* e-Nabız button - Large Clinical Panel with single accent (primary teal) */}
            <button
              onClick={() => handleModeSelect("auth")}
              className="group relative p-8 rounded-xl border border-cyan-100/30 transition-all duration-200 hover:border-cyan-200/40 text-left shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2)]"
              style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}
            >
              <div className="relative flex items-center gap-6">
                <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Smartphone className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-2xl font-sans font-semibold text-foreground mb-2 leading-tight">{t.enabiz}</div>
                  <div className="text-lg text-muted-foreground font-normal leading-relaxed">{t.enabizDesc}</div>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              {/* Auth method badges - neutral, informational */}
              <div className="relative mt-4 flex gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-muted-foreground text-base font-normal border border-cyan-100/20 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_1px_4px_rgba(0,0,0,0.02)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.04)' }}>
                  <CreditCard className="w-4 h-4" /> TC Kimlik
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-muted-foreground text-base font-normal border border-cyan-100/20 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_1px_4px_rgba(0,0,0,0.02)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.04)' }}>
                  <Building className="w-4 h-4" /> e-Devlet
                </span>
              </div>
            </button>

            {/* Guest button - Large Neutral Clinical Panel */}
            <button
              onClick={() => handleModeSelect("guest")}
              className="group relative p-8 rounded-xl border border-cyan-100/30 transition-all duration-200 hover:border-cyan-200/40 text-left shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2)]"
              style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}
            >
              <div className="relative flex items-center gap-6">
                <div className="w-20 h-20 rounded-xl bg-secondary/50 flex items-center justify-center border border-border/40">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-sans font-semibold text-foreground mb-2 leading-tight">{t.guest}</div>
                  <div className="text-lg text-muted-foreground font-normal leading-relaxed">{t.guestDesc}</div>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground/70 transition-colors" />
              </div>
            </button>

            {/* Back button */}
            <Button 
              variant="outline" 
              onClick={onBack} 
              className="mt-8 gap-2 px-8 h-14 text-lg border border-cyan-100/30 hover:border-cyan-200/40 mx-auto shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_12px_rgba(207,250,254,0.1)]"
              style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}
            >
              <ArrowLeft className="w-5 h-5" /> {t.back}
            </Button>
          </div>
        ) : (
          /* Consent Form - Large, readable panels */
          <div className="flex-1 flex flex-col">
            <div className="border border-cyan-100/30 rounded-xl p-8 space-y-6 animate-fade-in flex-1 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}>
              <div className="flex items-center gap-4 pb-6 border-b border-cyan-100/20">
                <Shield className="w-8 h-8 text-primary" />
                <h3 className="font-sans font-semibold text-foreground text-2xl">{t.consent}</h3>
              </div>

              {/* KVKK Text - Larger, readable */}
              <div className="max-h-48 overflow-y-auto rounded-lg p-6 text-base text-muted-foreground border border-cyan-100/20 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] leading-relaxed" style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}>
                <p className="mb-3"><strong className="text-foreground text-lg">{t.kvkkTitle}</strong></p>
                <p className="leading-relaxed">{t.kvkkText}</p>
              </div>

              {/* Checkboxes - Larger, readable */}
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-5 rounded-lg transition-colors border border-cyan-100/20 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_12px_rgba(207,250,254,0.1)] hover:border-cyan-100/30" style={{ backgroundColor: 'rgba(240, 249, 255, 0.04)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(240, 249, 255, 0.06)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(240, 249, 255, 0.04)'}>
                  <Checkbox 
                    id="kvkk" 
                    checked={kvkkAccepted}
                    onCheckedChange={(checked) => setKvkkAccepted(checked as boolean)}
                    className="mt-1 w-6 h-6 border-primary data-[state=checked]:bg-primary"
                  />
                  <label htmlFor="kvkk" className="text-lg text-foreground cursor-pointer leading-relaxed">
                    <span className="text-destructive">*</span> {t.kvkkAccept}
                  </label>
                </div>

                {selectedMode === "auth" && (
                  <div className="flex items-start gap-4 p-5 rounded-lg transition-colors border border-cyan-100/20 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_12px_rgba(207,250,254,0.1)] hover:border-cyan-100/30" style={{ backgroundColor: 'rgba(240, 249, 255, 0.04)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(240, 249, 255, 0.06)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(240, 249, 255, 0.04)'}>
                    <Checkbox 
                      id="enabiz" 
                      checked={enabizConsent}
                      onCheckedChange={(checked) => setEnabizConsent(checked as boolean)}
                      className="mt-1 w-6 h-6 border-primary data-[state=checked]:bg-primary"
                    />
                    <label htmlFor="enabiz" className="text-lg text-muted-foreground cursor-pointer leading-relaxed">
                      {t.enabizConsent}
                    </label>
                  </div>
                )}
              </div>

              {/* Action buttons - Large, clear */}
              <div className="flex gap-4 pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConsent(false)}
                  className="flex-1 h-14 text-lg border border-cyan-100/30 hover:border-cyan-200/40 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_12px_rgba(207,250,254,0.1)]"
                  style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}
                >
                  {t.back}
                </Button>
                <Button 
                  onClick={handleContinue}
                  disabled={!kvkkAccepted}
                  className="flex-1 gap-3 h-14 text-lg"
                  style={{
                    // Flat button, no gradients - consent/login rule
                    background: theme === "dark" ? 'hsl(186 85% 42%)' : 'hsl(186 85% 42%)',
                    boxShadow: '0 1px 3px hsl(0 0% 0% / 0.12), 0 1px 2px hsl(0 0% 0% / 0.08)'
                  }}
                >
                  <span className="text-white">{t.continue}</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy note - Larger */}
        <p className="text-center text-base text-muted-foreground mt-6">
          🔒 {t.privacy}
        </p>
      </div>
    </KioskLayout>
  );
};

export default WelcomeScreen;
