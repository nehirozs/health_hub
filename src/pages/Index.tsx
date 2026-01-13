import { useState } from "react";
import AttractScreen from "@/components/screens/AttractScreen";
import LanguageSelectionScreen from "@/components/screens/LanguageSelectionScreen";
import WelcomeScreen from "@/components/screens/WelcomeScreen";
import TriageScreen from "@/components/screens/TriageScreen";
import MeasurementScreen, { MeasurementResults } from "@/components/screens/MeasurementScreen";
import ResultsScreen from "@/components/screens/ResultsScreen";
import TelehealthScreen from "@/components/screens/TelehealthScreen";
import MedicalSciFiBackground from "@/components/kiosk/MedicalSciFiBackground";

type Screen = "attract" | "language" | "welcome" | "triage" | "measurement" | "results" | "telehealth";
type Language = "tr" | "en" | "fi";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("attract");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("tr");
  const [measurementResults, setMeasurementResults] = useState<MeasurementResults | null>(null);

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang);
    setCurrentScreen("welcome");
  };

  const handleMeasurementComplete = (results: MeasurementResults) => {
    setMeasurementResults(results);
    setCurrentScreen("results");
  };

  const handleRestart = () => {
    setCurrentScreen("attract");
    setMeasurementResults(null);
  };

  return (
    <div className="h-screen bg-background overflow-hidden relative">
      {/* Consistent medical sci-fi glassmorphism background */}
      <MedicalSciFiBackground />
      
      <div className="relative z-10 h-full w-full">
        {currentScreen === "attract" && (
          <AttractScreen onStart={handleLanguageSelect} />
        )}

        {currentScreen === "language" && (
          <LanguageSelectionScreen
            onSelectLanguage={handleLanguageSelect}
            onBack={() => setCurrentScreen("attract")}
          />
        )}
        
        {currentScreen === "welcome" && (
          <WelcomeScreen
            onGuestStart={() => setCurrentScreen("triage")}
            onAuthStart={() => setCurrentScreen("triage")}
            onBack={() => setCurrentScreen("attract")}
            language={selectedLanguage}
          />
        )}
        
        {currentScreen === "triage" && (
          <TriageScreen
            onCheckup={() => setCurrentScreen("measurement")}
            onSymptomAnalysis={() => setCurrentScreen("measurement")}
            onEmergency={() => setCurrentScreen("telehealth")}
            onBack={() => setCurrentScreen("welcome")}
            language={selectedLanguage}
          />
        )}
        
        {currentScreen === "measurement" && (
          <MeasurementScreen
            onComplete={handleMeasurementComplete}
            onBack={() => setCurrentScreen("triage")}
            language={selectedLanguage}
          />
        )}
        
        {currentScreen === "results" && measurementResults && (
          <ResultsScreen
            results={measurementResults}
            onTelehealth={() => setCurrentScreen("telehealth")}
            onRestart={handleRestart}
            onExit={handleRestart}
            onBack={() => setCurrentScreen("measurement")}
            language={selectedLanguage}
          />
        )}

        {currentScreen === "telehealth" && (
          <TelehealthScreen
            onEnd={handleRestart}
            onBack={() => setCurrentScreen("results")}
            language={selectedLanguage}
          />
        )}
      </div>

    </div>
  );
};

export default Index;
