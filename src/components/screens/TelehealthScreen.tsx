import { useState, useEffect } from "react";
import BreathingCircle from "@/components/kiosk/BreathingCircle";
import FixedHeader from "@/components/kiosk/FixedHeader";
import { Button } from "@/components/ui/button";
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2 } from "lucide-react";

type Language = "tr" | "en" | "fi";

interface TelehealthScreenProps {
  onEnd: () => void;
  onBack: () => void;
  language?: Language;
}

const translations = {
  tr: {
    connecting: "Doktorunuz Bağlanıyor",
    connectingDesc: "Beklerken derin nefes alarak rahatlayın",
    waitTime: "Bekleme süresi",
    connectingTitle: "Bağlantı Kuruluyor...",
    cancel: "İptal Et",
    endCall: "Görüşmeyi Bitir",
    bloodPressure: "Tansiyon",
    temperature: "Ateş"
  },
  en: {
    connecting: "Your Doctor is Connecting",
    connectingDesc: "Take deep breaths and relax while waiting",
    waitTime: "Wait time",
    connectingTitle: "Connecting...",
    cancel: "Cancel",
    endCall: "End Call",
    bloodPressure: "Blood Pressure",
    temperature: "Temperature"
  },
  fi: {
    connecting: "Lääkärisi Yhdistää",
    connectingDesc: "Ota syviä hengityksiä ja rentoudu odotellessa",
    waitTime: "Odotusaika",
    connectingTitle: "Yhdistetään...",
    cancel: "Peruuta",
    endCall: "Lopeta Puhelu",
    bloodPressure: "Verenpaine",
    temperature: "Lämpötila"
  }
};

const TelehealthScreen = ({ onEnd, onBack, language = "tr" }: TelehealthScreenProps) => {
  const t = translations[language];
  const [callState, setCallState] = useState<"waiting" | "connecting" | "connected">("waiting");
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [waitTime, setWaitTime] = useState(0);
  const [callDuration, setCallDuration] = useState(0);

  // Breathing animation during wait
  useEffect(() => {
    if (callState === "waiting" || callState === "connecting") {
      const phases: ("inhale" | "hold" | "exhale")[] = ["inhale", "hold", "exhale"];
      let phaseIndex = 0;
      
      const interval = setInterval(() => {
        phaseIndex = (phaseIndex + 1) % 3;
        setBreathPhase(phases[phaseIndex]);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [callState]);

  // Wait time counter
  useEffect(() => {
    if (callState === "waiting") {
      const interval = setInterval(() => {
        setWaitTime(prev => prev + 1);
      }, 1000);

      // Auto connect after 5 seconds for demo
      const timer = setTimeout(() => {
        setCallState("connecting");
        setTimeout(() => setCallState("connected"), 2000);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [callState]);

  // Call duration counter
  useEffect(() => {
    if (callState === "connected") {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [callState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Full screen layout
  return (
    <div className="h-screen w-full bg-transparent relative overflow-hidden">
      {/* Fixed Header - Same on all screens */}
      <FixedHeader />
      
      {/* Waiting State - Large, calm, professional */}
      {callState === "waiting" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-background to-card">
          <div className="mb-12">
            <BreathingCircle phase={breathPhase} size={200} />
          </div>
          <h1 className="text-4xl font-sans font-semibold text-foreground mb-4 leading-tight">
            {t.connecting}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-normal">
            {t.connectingDesc}
          </p>
          <div className="text-3xl font-mono text-primary font-semibold mb-2">
            {formatTime(waitTime)}
          </div>
          <p className="text-lg text-muted-foreground font-normal">{t.waitTime}</p>
          
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="absolute bottom-12 left-1/2 -translate-x-1/2 h-14 px-8 text-lg"
          >
            {t.cancel}
          </Button>
        </div>
      )}

      {/* Connecting State - Large, Clinical, no pulse */}
      {callState === "connecting" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-background to-card">
          <div className="w-32 h-32 rounded-xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20">
            <Video className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-3xl font-sans font-semibold text-foreground leading-tight">
            {t.connectingTitle}
          </h1>
        </div>
      )}

      {/* Connected State - Full Screen Video */}
      {callState === "connected" && (
        <>
          {/* Doctor Video - Full Screen Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Simulated doctor video */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mx-auto mb-6 border-4 border-white/20 shadow-2xl">
                  <span className="text-8xl">👨‍⚕️</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Dr. Ahmet Yılmaz</h2>
                <p className="text-white/60">Aile Hekimi</p>
              </div>
            </div>
          </div>

          {/* Call Duration - Top Center - Large, Clinical, no pulse */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-xl px-6 py-3 flex items-center gap-3 border border-white/10">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-white font-mono text-xl font-semibold">{formatTime(callDuration)}</span>
          </div>

          {/* Vital Data Strip - Top Right - Large, readable */}
          <div className="absolute top-8 right-8 bg-black/50 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10">
            <div className="flex gap-8 text-base">
              <div className="text-center">
                <div className="text-white/60 text-sm mb-2">{t.bloodPressure}</div>
                <div className="text-white font-bold text-lg">120/80</div>
              </div>
              <div className="text-center">
                <div className="text-white/60 text-sm mb-2">SpO2</div>
                <div className="text-white font-bold text-lg">98%</div>
              </div>
              <div className="text-center">
                <div className="text-white/60 text-sm mb-2">{t.temperature}</div>
                <div className="text-white font-bold text-lg">36.5°C</div>
              </div>
            </div>
          </div>

          {/* Self View - Bottom Right */}
          <div className="absolute bottom-28 right-6 w-40 h-28 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl border-2 border-white/20 overflow-hidden shadow-2xl">
            {isVideoOff ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-900">
                <VideoOff className="w-8 h-8 text-white/30" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
            )}
          </div>

          {/* Call Controls - Bottom Center */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
            {/* Mute Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-14 rounded-full border-2 ${
                isMuted 
                  ? "bg-rose-500/20 border-rose-500 hover:bg-rose-500/30" 
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6 text-rose-400" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </Button>

            {/* End Call Button */}
            <Button
              onClick={onEnd}
              className="h-16 px-10 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-lg font-semibold shadow-lg shadow-rose-500/30 gap-3"
            >
              <PhoneOff className="w-6 h-6" />
              {t.endCall}
            </Button>

            {/* Video Toggle */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-14 h-14 rounded-full border-2 ${
                isVideoOff 
                  ? "bg-rose-500/20 border-rose-500 hover:bg-rose-500/30" 
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
            >
              {isVideoOff ? (
                <VideoOff className="w-6 h-6 text-rose-400" />
              ) : (
                <Video className="w-6 h-6 text-white" />
              )}
            </Button>

            {/* Volume */}
            <Button
              variant="outline"
              size="lg"
              className="w-14 h-14 rounded-full border-2 bg-white/10 border-white/20 hover:bg-white/20"
            >
              <Volume2 className="w-6 h-6 text-white" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TelehealthScreen;
