import { useState } from "react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import AIAvatar from "@/components/kiosk/AIAvatar";
import VirtualKeyboard from "@/components/kiosk/VirtualKeyboard";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stethoscope, ClipboardCheck, AlertTriangle, Mic, Send, ArrowRight, Keyboard, ArrowLeft } from "lucide-react";

type Language = "tr" | "en" | "fi";

interface TriageScreenProps {
  onCheckup: () => void;
  onSymptomAnalysis: () => void;
  onEmergency: () => void;
  onBack: () => void;
  language?: Language;
}

type ChatMessage = { sender: "ai" | "user"; message: string };
type InputMode = "microphone" | "keyboard";

const translations = {
  tr: {
    title: "Triyaj",
    subtitle: "Nasıl devam etmek istersiniz?",
    checkup: "Sadece Kontrol",
    checkupDesc: "Genel sağlık ölçümlerimi yap",
    symptomAnalysis: "Semptom Değerlendirmesi",
    symptomAnalysisDesc: "Şikayetlerinizi değerlendirmek istiyorum",
    symptomInput: "Semptom Girişi",
    symptomInputSubtitle: "Şikayetinizi nasıl girmek istersiniz?",
    symptomEvaluation: "Semptom Değerlendirmesi",
    voiceInput: "Sesli Anlatın",
    voiceInputDesc: "Konuşarak şikayetinizi anlatın",
    keyboardInput: "Yazarak Anlatın",
    keyboardInputDesc: "Klavye ile şikayetinizi yazın",
    back: "Geri",
    emergency: "Acil durumlarda 112'yi arayın",
    initialQuestion: "Şikayetinizi biraz anlatır mısınız?",
    questions: [
      "Bu şikayetiniz ne kadar süredir devam ediyor?",
      "Ağrınızı 1-10 arasında puanlasanız kaç verirsiniz?",
      "Başka eşlik eden şikayetiniz var mı?",
      "Daha önce ilaç aldınız mı?"
    ],
    durationOptions: ["Yeni başladı", "Birkaç saat", "1-2 gün", "1 haftadan fazla"],
    painOptions: ["Hafif (1-3)", "Orta (4-6)", "Şiddetli (7-10)"],
    otherSymptomsOptions: ["Hayır", "Bulantı", "Baş dönmesi", "Ateş"],
    medicationOptions: ["Hayır", "Evet, aldım"],
    emergencyMessage: "⚠️ Bu durum acil olabilir! Sizi hemen bir doktora bağlıyorum.",
    completionMessage: "Teşekkür ederim. Şimdi ölçümler yapıp durumunuzu daha iyi değerlendirelim.",
    listening: "Dinleniyor...",
    listeningDesc: "Şikayetinizi söyleyin",
    tapToSpeak: "Konuşmak için dokunun",
    inputPlaceholder: "Şikayetinizi yazın...",
    emergencyKeywords: ["göğüs ağrısı", "nefes darlığı", "bayılma", "felç", "kalp"],
    simulatedResponse: "Baş ağrım var ve halsizlik hissediyorum"
  },
  en: {
    title: "Triage",
    subtitle: "How would you like to continue?",
    checkup: "Health Check Only",
    checkupDesc: "Perform general health measurements",
    symptomAnalysis: "Symptom Assessment",
    symptomAnalysisDesc: "I would like to assess your symptoms",
    symptomInput: "Symptom Input",
    symptomInputSubtitle: "How would you like to enter your symptoms?",
    symptomEvaluation: "Symptom Assessment",
    voiceInput: "Voice Input",
    voiceInputDesc: "Describe your symptoms by speaking",
    keyboardInput: "Type Input",
    keyboardInputDesc: "Type your symptoms using the keyboard",
    back: "Back",
    emergency: "Call 112 in emergencies",
    initialQuestion: "Could you please describe your symptoms?",
    questions: [
      "How long have you been experiencing this complaint?",
      "On a scale of 1-10, how would you rate your pain?",
      "Do you have any other accompanying symptoms?",
      "Have you taken any medication before?"
    ],
    durationOptions: ["Just started", "A few hours", "1-2 days", "More than 1 week"],
    painOptions: ["Mild (1-3)", "Moderate (4-6)", "Severe (7-10)"],
    otherSymptomsOptions: ["No", "Nausea", "Dizziness", "Fever"],
    medicationOptions: ["No", "Yes, I have"],
    emergencyMessage: "⚠️ This condition may be an emergency! I'm connecting you to a doctor immediately.",
    completionMessage: "Thank you. Now let's take measurements to better assess your condition.",
    listening: "Listening...",
    listeningDesc: "Please describe your symptoms",
    tapToSpeak: "Tap to speak",
    inputPlaceholder: "Type your symptoms...",
    emergencyKeywords: ["chest pain", "shortness of breath", "fainting", "paralysis", "heart"],
    simulatedResponse: "I have a headache and feel weak"
  },
  fi: {
    title: "Triage",
    subtitle: "Miten haluaisit jatkaa?",
    checkup: "Vain Tarkastus",
    checkupDesc: "Tee yleiset terveysmittaukset",
    symptomAnalysis: "Oireiden Arviointi",
    symptomAnalysisDesc: "Haluaisin arvioida oireitasi",
    symptomInput: "Oireiden Syöttö",
    symptomInputSubtitle: "Miten haluaisit syöttää oireesi?",
    symptomEvaluation: "Oireiden Arviointi",
    voiceInput: "Äänisyöttö",
    voiceInputDesc: "Kuvaile oireesi puhumalla",
    keyboardInput: "Kirjoitussyöttö",
    keyboardInputDesc: "Kirjoita oireesi näppäimistöllä",
    back: "Takaisin",
    emergency: "Soita 112 hätätilanteissa",
    initialQuestion: "Voisitko kuvata oireitasi hieman?",
    questions: [
      "Kuinka kauan olet kokenut tätä oiretta?",
      "Asteikolla 1-10, miten arvioisit kipusi?",
      "Onko sinulla muita oireita?",
      "Oletko ottanut lääkkeitä aiemmin?"
    ],
    durationOptions: ["Vastikään alkoi", "Muutama tunti", "1-2 päivää", "Yli viikko"],
    painOptions: ["Lievä (1-3)", "Kohtalainen (4-6)", "Vaikea (7-10)"],
    otherSymptomsOptions: ["Ei", "Pahoinvointi", "Huimaus", "Kuume"],
    medicationOptions: ["Ei", "Kyllä, olen"],
    emergencyMessage: "⚠️ Tämä saattaa olla hätätilanne! Yhdistän sinut välittömästi lääkäriin.",
    completionMessage: "Kiitos. Tehdään nyt mittaukset arvioidaksemme tilasi paremmin.",
    listening: "Kuuntelee...",
    listeningDesc: "Kuvaile oireesi",
    tapToSpeak: "Napauta puhuaksesi",
    inputPlaceholder: "Kirjoita oireesi...",
    emergencyKeywords: ["rintakipu", "hengitysvaikeus", "pyörtyminen", "halvaus", "sydän"],
    simulatedResponse: "Minulla on päänsärky ja tunnen heikkoutta"
  }
};

const TriageScreen = ({ onCheckup, onSymptomAnalysis, onEmergency, onBack, language = "tr" }: TriageScreenProps) => {
  const t = translations[language];
  const [mode, setMode] = useState<"selection" | "inputChoice" | "chat">("selection");
  const [inputMode, setInputMode] = useState<InputMode | null>(null);
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [avatarMood, setAvatarMood] = useState<"neutral" | "happy" | "concerned" | "speaking">("speaking");
  const [questionIndex, setQuestionIndex] = useState(-1); // -1 = initial symptom question
  const [showOptions, setShowOptions] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const { theme } = useTheme();

  const getCurrentOptions = () => {
    switch (questionIndex) {
      case 0: return t.durationOptions;
      case 1: return t.painOptions;
      case 2: return t.otherSymptomsOptions;
      case 3: return t.medicationOptions;
      default: return [];
    }
  };

  const startChat = (selectedInputMode: InputMode) => {
    setInputMode(selectedInputMode);
    setMode("chat");
    setConversation([
      { sender: "ai", message: t.initialQuestion }
    ]);
    if (selectedInputMode === "microphone") {
      setIsListening(true);
    }
  };

  const handleUserMessage = (message: string) => {
    const newConv = [...conversation, { sender: "user" as const, message }];
    setConversation(newConv);
    setInputValue("");
    setAvatarMood("speaking");
    setShowOptions(false);

    // Check for emergency keywords
    const hasEmergency = t.emergencyKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (hasEmergency) {
      setTimeout(() => {
        setAvatarMood("concerned");
        setConversation(prev => [...prev, { 
          sender: "ai", 
          message: t.emergencyMessage 
        }]);
        setTimeout(() => onEmergency(), 2000);
      }, 1000);
      return;
    }

    // Move to next question
    const nextIndex = questionIndex + 1;
    
    if (nextIndex < t.questions.length) {
      setTimeout(() => {
        setAvatarMood("concerned");
        setQuestionIndex(nextIndex);
        setConversation(prev => [...prev, { 
          sender: "ai", 
          message: t.questions[nextIndex]
        }]);
        setShowOptions(true);
        if (inputMode === "microphone") {
          setIsListening(true);
        }
      }, 800);
    } else {
      // All questions answered
      setTimeout(() => {
        setAvatarMood("happy");
        setConversation(prev => [...prev, { 
          sender: "ai", 
          message: t.completionMessage 
        }]);
        setTimeout(() => onCheckup(), 2000);
      }, 800);
    }
  };

  const handleOptionSelect = (option: string) => {
    handleUserMessage(option);
  };

  const handleMicrophoneInput = () => {
    // Simulate voice recognition
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      if (questionIndex === -1) {
        handleUserMessage(t.simulatedResponse);
      } else {
        const options = getCurrentOptions();
        handleUserMessage(options[0]); // Simulate selecting first option
      }
    }, 2500);
  };

  // Selection Mode - Large Clinical Triage Panels (Medical questions, not game choices)
  if (mode === "selection") {
    return (
      <KioskLayout showAvatar={false} title={t.title} subtitle={t.subtitle} avatarMood="neutral">
        <div key="selection" className="h-full flex flex-col max-w-3xl mx-auto animate-fade-in">
          <div className="flex-1 flex flex-col justify-center gap-6">
            {/* Sadece Kontrol - Large Clinical Panel with single accent (primary teal) */}
            <button
              onClick={onCheckup}
              className="group relative p-8 rounded-xl border border-cyan-100/30 transition-all duration-200 hover:border-cyan-200/40 text-left shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2)]"
              style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}
            >
              <div className="relative flex items-center gap-6">
                <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <ClipboardCheck className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-sans font-semibold text-foreground mb-2 leading-tight">{t.checkup}</div>
                  <div className="text-lg text-muted-foreground font-normal leading-relaxed">{t.checkupDesc}</div>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>

            {/* Hasta Hissediyorum - Large Neutral Clinical Panel */}
            <button
              onClick={() => setMode("inputChoice")}
              className="group relative p-8 rounded-xl border border-cyan-100/30 transition-all duration-200 hover:border-cyan-200/40 text-left shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2)]"
              style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}
            >
              <div className="relative flex items-center gap-6">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center border border-cyan-100/20 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_1px_4px_rgba(0,0,0,0.02)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.04)' }}>
                  <Stethoscope className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-sans font-semibold text-foreground mb-2 leading-tight">{t.symptomAnalysis}</div>
                  <div className="text-lg text-muted-foreground font-normal leading-relaxed">{t.symptomAnalysisDesc}</div>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground/70 transition-colors" />
              </div>
            </button>
          </div>

          <Button 
            variant="outline" 
            onClick={onBack} 
            className="mx-auto mt-8 gap-2 px-8 h-14 text-lg border border-cyan-100/30 hover:border-cyan-200/40 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_12px_rgba(207,250,254,0.1)]"
            style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}
          >
            <ArrowLeft className="w-5 h-5" /> {t.back}
          </Button>
          <div className="mt-4 flex items-center justify-center gap-2 text-base text-muted-foreground">
            <AlertTriangle className="w-5 h-5" />
            <span>{t.emergency}</span>
          </div>
        </div>
      </KioskLayout>
    );
  }

  // Input Choice Mode - Large Clinical Selection (Medical input method, not game choice)
  if (mode === "inputChoice") {
    return (
      <KioskLayout showAvatar={false} title={t.symptomInput} subtitle={t.symptomInputSubtitle} avatarMood="neutral">
        <div key="inputChoice" className="h-full flex flex-col max-w-4xl mx-auto animate-fade-in">
          <div className="flex-1 flex gap-6 items-center justify-center">
            {/* Microphone option - Large Neutral panel */}
            <button
              onClick={() => startChat("microphone")}
              className="flex-1 max-w-sm p-10 rounded-xl border border-cyan-100/30 hover:border-cyan-200/40 transition-all duration-200 flex flex-col items-center justify-center gap-5 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2)]"
              style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}
            >
              <div className="w-24 h-24 rounded-xl bg-secondary/50 flex items-center justify-center border border-border/40">
                <Mic className="w-12 h-12 text-muted-foreground" />
              </div>
              <span className="text-2xl font-sans font-semibold text-foreground leading-tight">{t.voiceInput}</span>
              <span className="text-muted-foreground text-center text-lg font-normal leading-relaxed">{t.voiceInputDesc}</span>
            </button>

            {/* Keyboard option - Large Neutral panel */}
            <button
              onClick={() => startChat("keyboard")}
              className="flex-1 max-w-sm p-10 rounded-xl border border-cyan-100/30 hover:border-cyan-200/40 transition-all duration-200 flex flex-col items-center justify-center gap-5 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2)]"
              style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}
            >
              <div className="w-24 h-24 rounded-xl bg-secondary/50 flex items-center justify-center border border-border/40">
                <Keyboard className="w-12 h-12 text-muted-foreground" />
              </div>
              <span className="text-2xl font-sans font-semibold text-foreground leading-tight">{t.keyboardInput}</span>
              <span className="text-muted-foreground text-center text-lg font-normal leading-relaxed">{t.keyboardInputDesc}</span>
            </button>
          </div>

          <Button 
            variant="outline" 
            onClick={() => setMode("selection")} 
            className="mx-auto mt-8 gap-2 px-8 h-14 text-lg border border-cyan-100/30 hover:border-cyan-200/40 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_12px_rgba(207,250,254,0.1)]"
            style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}
          >
            <ArrowLeft className="w-5 h-5" /> {t.back}
          </Button>
        </div>
      </KioskLayout>
    );
  }

  // Chat Mode - Large, Clear Clinical Triage Interface
  return (
    <KioskLayout showAvatar={false} title={t.symptomEvaluation}>
      <div key="chat" className="min-h-full flex flex-col animate-fade-in pb-4">
        {/* Top: Avatar + Current AI message - Large, clear (clinical triage interface) */}
        <div className="flex gap-6 mb-6">
          {/* Avatar - clinical, not game NPC */}
          <div className="flex-shrink-0">
            <AIAvatar mood={avatarMood} size="md" animate={false} />
          </div>
          <div className="flex-1 flex items-center">
            <div className="rounded-xl border border-cyan-100/30 px-8 py-6 w-full shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.02)' }}>
              <p className="text-xl text-foreground leading-relaxed font-normal break-words">
                {conversation[conversation.length - 1]?.message}
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Options - Large Clinical choice buttons (neutral) */}
        {showOptions && getCurrentOptions().length > 0 && (
          <div className="flex-1 flex items-center">
            <div className="w-full grid grid-cols-2 gap-4">
              {getCurrentOptions().map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  onClick={() => handleOptionSelect(option)}
                  className="h-20 text-lg font-normal border border-cyan-100/30 hover:border-cyan-200/40 transition-all rounded-xl shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_12px_rgba(207,250,254,0.1)]"
                  style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(240, 249, 255, 0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(240, 249, 255, 0.05)'}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area - Large, clear, fixed at bottom (clinical, no pulse animations) */}
        {inputMode === "microphone" ? (
          <div className="rounded-xl border border-cyan-100/30 p-6" style={{ backgroundColor: 'rgba(240, 249, 255, 0.02)' }}>
            {isListening ? (
              <div className="flex items-center justify-center gap-6">
                <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Mic className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-foreground">{t.listening}</p>
                  <p className="text-lg text-muted-foreground font-normal">{t.listeningDesc}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleMicrophoneInput}
                className="w-full flex items-center justify-center gap-4 py-4"
              >
                <div className="w-18 h-18 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Mic className="w-9 h-9 text-primary" />
                </div>
                <span className="text-xl font-semibold text-foreground">{t.tapToSpeak}</span>
              </button>
            )}
          </div>
        ) : !showOptions ? (
          <div className="space-y-4">
            {/* Input field - Large */}
            <div className="rounded-xl border border-cyan-100/30 px-6 py-5" style={{ backgroundColor: 'rgba(240, 249, 255, 0.02)' }}>
              <div className="flex gap-4">
                <Input
                  placeholder={t.inputPlaceholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 h-16 text-xl px-4"
                  autoFocus
                />
                <Button 
                  size="lg"
                  className="h-16 px-10"
                  onClick={() => {
                    if (inputValue.trim()) {
                      handleUserMessage(inputValue.trim());
                    }
                  }}
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-7 h-7" />
                </Button>
              </div>
            </div>

            {/* Keyboard - only show when no options */}
            <VirtualKeyboard
              onKeyPress={(key) => setInputValue(prev => prev + key)}
              onBackspace={() => setInputValue(prev => prev.slice(0, -1))}
              onEnter={() => {
                if (inputValue.trim()) {
                  handleUserMessage(inputValue.trim());
                }
              }}
              variant="full"
            />
          </div>
        ) : null}

        {/* Back button - small, at very bottom */}
        <button 
          onClick={() => {
            setMode("inputChoice");
            setConversation([]);
            setQuestionIndex(-1);
            setShowOptions(false);
          }} 
          className="mt-3 flex items-center justify-center gap-2 text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> {t.back}
        </button>
      </div>
    </KioskLayout>
  );
};

export default TriageScreen;
