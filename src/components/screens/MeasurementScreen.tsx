import { useState, useEffect } from "react";
import KioskLayout from "@/components/kiosk/KioskLayout";
import BreathingCircle from "@/components/kiosk/BreathingCircle";
import BloodPressureGauge from "@/components/kiosk/BloodPressureGauge";
import SpO2Gauge from "@/components/kiosk/SpO2Gauge";
import BMIGauge from "@/components/kiosk/BMIGauge";
import TemperatureGauge from "@/components/kiosk/TemperatureGauge";
import { FuturisticOxygenIcon, FuturisticScaleIcon, FuturisticThermometerIcon } from "@/components/kiosk/icons/FuturisticIcons";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X, Activity, Scale, Thermometer, Heart } from "lucide-react";

type MeasurementType = "bp" | "spo2" | "weight" | "temp" | null;
type Language = "tr" | "en" | "fi";

interface MeasurementScreenProps {
  onComplete: (results: MeasurementResults) => void;
  onBack: () => void;
  language?: Language;
}

export interface MeasurementResults {
  systolic: number;
  diastolic: number;
  pulse: number;
  spo2: number;
  weight: number;
  height: number;
  bmi: number;
  temperature: number;
}

const translations = {
  tr: {
    title: "Ölçümler",
    completed: "tamamlandı",
    back: "Geri",
    viewResults: "Sonuçları Gör",
    measurements: [
      { title: "Kan Basıncı", subtitle: "Tansiyon Ölçümü" },
      { title: "SpO2", subtitle: "Oksijen Satürasyonu" },
      { title: "Kilo & BMI", subtitle: "Vücut Analizi" },
      { title: "Ateş", subtitle: "Vücut Sıcaklığı" }
    ],
    instructions: {
      bp: {
        title: "Kan Basıncı",
        steps: [
          "Sol kolunuzu tansiyon manşetine yerleştirin",
          "Kolunuz kalp hizasında olacak şekilde rahat oturun",
          "Ölçüm bitene kadar konuşmayın ve hareket etmeyin"
        ]
      },
      spo2: {
        title: "Oksijen",
        steps: [
          "Parmağınızı oksijen ölçüm cihazına yerleştirin",
          "Başlat butonuna basın",
          "Cihaz bip sesi çıkarana kadar bekleyin"
        ]
      },
      weight: {
        title: "Kilo & Boy",
        steps: [
          "Ayakkabılarınızı çıkarın",
          "Tartının ortasına çıkın ve dik durun",
          "Ölçüm tamamlanana kadar sabit bekleyin"
        ]
      },
      temp: {
        title: "Ateş",
        steps: [
          "Alnınızı temiz ve kuru tutun",
          "Yüzünüzü sensöre doğru tutun",
          "Bip sesi duyana kadar sabit kalın"
        ]
      }
    },
    instructionTitle: "Ölçüm Talimatları",
    photoPlaceholder: "Fotoğraf veya Video Alanı",
    startMeasurement: "Ölçümü Başlat",
    close: "Kapat",
    measuring: "Ölçülüyor...",
    weighing: "Tartılıyor...",
    bpInstructions: "Rahat olun, konuşmayın ve bacak bacak üstüne atmayın.",
    completed: "Tamamlandı"
  },
  en: {
    title: "Measurements",
    completed: "completed",
    back: "Back",
    viewResults: "View Results",
    measurements: [
      { title: "Blood Pressure", subtitle: "BP Measurement" },
      { title: "SpO2", subtitle: "Oxygen Saturation" },
      { title: "Weight & BMI", subtitle: "Body Analysis" },
      { title: "Temperature", subtitle: "Body Temperature" }
    ],
    instructions: {
      bp: {
        title: "Blood Pressure",
        steps: [
          "Place your left arm in the blood pressure cuff",
          "Sit comfortably with your arm at heart level",
          "Do not speak or move until the measurement is complete"
        ]
      },
      spo2: {
        title: "Oxygen",
        steps: [
          "Place your finger in the oxygen measurement device",
          "Press the start button",
          "Wait until the device beeps"
        ]
      },
      weight: {
        title: "Weight & Height",
        steps: [
          "Remove your shoes",
          "Step onto the center of the scale and stand straight",
          "Stay still until the measurement is complete"
        ]
      },
      temp: {
        title: "Temperature",
        steps: [
          "Keep your forehead clean and dry",
          "Hold your face toward the sensor",
          "Stay still until you hear a beep"
        ]
      }
    },
    instructionTitle: "Measurement Instructions",
    photoPlaceholder: "Photo or Video Area",
    startMeasurement: "Start Measurement",
    close: "Close",
    measuring: "Measuring...",
    weighing: "Weighing...",
    bpInstructions: "Relax, do not speak and do not cross your legs.",
    completed: "Completed"
  },
  fi: {
    title: "Mittaukset",
    completed: "valmis",
    back: "Takaisin",
    viewResults: "Näytä Tulokset",
    measurements: [
      { title: "Verenpaine", subtitle: "Verenpaineen Mittaus" },
      { title: "SpO2", subtitle: "Hapen Kyllästys" },
      { title: "Paino & BMI", subtitle: "Kehon Analyysi" },
      { title: "Lämpötila", subtitle: "Kehon Lämpötila" }
    ],
    instructions: {
      bp: {
        title: "Verenpaine",
        steps: [
          "Aseta vasen käsivartesi verenpaineen hihnaan",
          "Istu mukavasti käsivartesi sydämen korkeudella",
          "Älä puhu tai liiku mittauksen loppuun asti"
        ]
      },
      spo2: {
        title: "Happi",
        steps: [
          "Aseta sormesi happimittauslaitteeseen",
          "Paina käynnistyspainiketta",
          "Odota kunnes laite piippaa"
        ]
      },
      weight: {
        title: "Paino & Pituus",
        steps: [
          "Ota kengät pois",
          "Astu vaaka keskelle ja seiso suorassa",
          "Pysy paikallaan mittauksen loppuun asti"
        ]
      },
      temp: {
        title: "Lämpötila",
        steps: [
          "Pidä otsasi puhdas ja kuiva",
          "Pidä kasvosi kohti anturia",
          "Pysy paikallaan kunnes kuulet piippauksen"
        ]
      }
    },
    instructionTitle: "Mittausohjeet",
    photoPlaceholder: "Valokuva tai Video Alue",
    startMeasurement: "Aloita Mittaus",
    close: "Sulje",
    measuring: "Mittaa...",
    weighing: "Punnitaan...",
    bpInstructions: "Rentoudu, älä puhu ja älä risti jalkojasi.",
    completed: "Valmis"
  }
};

const MeasurementScreen = ({ onComplete, onBack, language = "tr" }: MeasurementScreenProps) => {
  const t = translations[language];
  const [activeMeasurement, setActiveMeasurement] = useState<MeasurementType>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  
  const [progress, setProgress] = useState(0);
  
  const [completedMeasurements, setCompletedMeasurements] = useState<{
    bp: boolean;
    spo2: boolean;
    weight: boolean;
    temp: boolean;
  }>({ bp: false, spo2: false, weight: false, temp: false });

  const [results, setResults] = useState<Partial<MeasurementResults>>({});

  // Breathing exercise for BP
  useEffect(() => {
    if (isMeasuring && activeMeasurement === "bp") {
      const phases: ("inhale" | "hold" | "exhale")[] = ["inhale", "hold", "exhale"];
      let phaseIndex = 0;
      
      const interval = setInterval(() => {
        phaseIndex = (phaseIndex + 1) % 3;
        setBreathPhase(phases[phaseIndex]);
      }, 3000);

      const timer = setTimeout(() => {
        setIsMeasuring(false);
        const newResults = {
          systolic: 118 + Math.floor(Math.random() * 10),
          diastolic: 75 + Math.floor(Math.random() * 8),
          pulse: 68 + Math.floor(Math.random() * 12)
        };
        setResults(prev => ({ ...prev, ...newResults }));
        setCompletedMeasurements(prev => ({ ...prev, bp: true }));
        clearInterval(interval);
      }, 9000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isMeasuring, activeMeasurement]);

  // Progress for other measurements
  useEffect(() => {
    if (isMeasuring && activeMeasurement && activeMeasurement !== "bp") {
      const duration = activeMeasurement === "spo2" ? 4000 : 3000;
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, duration / 10);

      const timer = setTimeout(() => {
        setIsMeasuring(false);
        setProgress(0);

        if (activeMeasurement === "spo2") {
          setResults(prev => ({ ...prev, spo2: 96 + Math.floor(Math.random() * 3) }));
          setCompletedMeasurements(prev => ({ ...prev, spo2: true }));
        } else if (activeMeasurement === "weight") {
          const weight = 70 + Math.floor(Math.random() * 20);
          const height = 170 + Math.floor(Math.random() * 15);
          const bmi = +(weight / Math.pow(height / 100, 2)).toFixed(1);
          setResults(prev => ({ ...prev, weight, height, bmi }));
          setCompletedMeasurements(prev => ({ ...prev, weight: true }));
        } else if (activeMeasurement === "temp") {
          setResults(prev => ({ ...prev, temperature: +(36.2 + Math.random() * 0.8).toFixed(1) }));
          setCompletedMeasurements(prev => ({ ...prev, temp: true }));
        }
      }, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isMeasuring, activeMeasurement]);

  const startMeasurement = () => {
    setIsMeasuring(true);
  };

  const closeMeasurement = () => {
    setActiveMeasurement(null);
    setIsMeasuring(false);
    setProgress(0);
  };

  const handleComplete = () => {
    // Fill missing values with 0
    const finalResults: MeasurementResults = {
      systolic: results.systolic || 0,
      diastolic: results.diastolic || 0,
      pulse: results.pulse || 0,
      spo2: results.spo2 || 0,
      weight: results.weight || 0,
      height: results.height || 0,
      bmi: results.bmi || 0,
      temperature: results.temperature || 0
    };
    onComplete(finalResults);
  };

  const completedCount = Object.values(completedMeasurements).filter(Boolean).length;

  const measurements = t.measurements.map((m, index) => {
    const icons = [Heart, Activity, Scale, Thermometer];
    return {
      key: (["bp", "spo2", "weight", "temp"] as const)[index],
      icon: icons[index],
      title: m.title,
      subtitle: m.subtitle
    };
  });

  // Main menu - Procedural Measurement Checklist (NOT game choices)
  if (!activeMeasurement) {
    const { theme } = useTheme();
    
    // Determine next active measurement (first incomplete one)
    const nextActiveIndex = measurements.findIndex(m => !completedMeasurements[m.key]);
    const nextActiveKey = nextActiveIndex >= 0 ? measurements[nextActiveIndex].key : null;
    
    return (
      <KioskLayout 
        showAvatar={false}
        avatarMood="neutral" 
        title={t.title}
        subtitle={`${completedCount}/4 ${t.completed}`}
      >
        <div className="h-full flex flex-col max-w-2xl mx-auto">
          {/* Procedural checklist - Large vertical list, sequential workflow */}
          <div className="flex-1 flex flex-col gap-4 mb-6">
            {measurements.map(({ key, icon: Icon, title, subtitle }, index) => {
              const isCompleted = completedMeasurements[key];
              const isActive = !isCompleted && key === nextActiveKey; // Only next incomplete gets accent
              
              return (
                <button
                  key={key}
                  onClick={() => setActiveMeasurement(key)}
                  className="relative p-6 rounded-xl border border-cyan-100/30 hover:border-cyan-200/40 transition-all duration-200 text-left flex items-center gap-5 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2)]"
                  style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}
                >
                  {/* Step number / Status indicator */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border border-cyan-100/20"
                  style={{ backgroundColor: 'rgba(240, 249, 255, 0.04)' }}>
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-success" />
                    ) : (
                      <span className="text-lg font-semibold text-muted-foreground">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  
                  {/* Content - Typography hierarchy: Title + Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <Icon className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                      <h3 className="text-lg font-sans font-semibold leading-tight text-foreground">
                        {title}
                      </h3>
                    </div>
                    <p className="text-base font-normal leading-relaxed text-muted-foreground/80">
                      {subtitle}
                    </p>
                    
                    {/* Result preview if completed - Clinical data display */}
                    {isCompleted && (
                      <div className="mt-2 pt-2 border-t border-cyan-100/20">
                        <span className="text-base font-semibold text-foreground">
                          {key === "bp" && `${results.systolic}/${results.diastolic} mmHg`}
                          {key === "spo2" && `${results.spo2}%`}
                          {key === "weight" && `BMI: ${results.bmi}`}
                          {key === "temp" && `${results.temperature}°C`}
                        </span>
                      </div>
                    )}
                  </div>
                  
                </button>
              );
            })}
          </div>

          {/* Action buttons - Large, clear Clinical styling */}
          <div className="mt-auto flex gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1 h-14 text-lg border border-cyan-100/30 hover:border-cyan-200/40 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_12px_rgba(207,250,254,0.1)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}>
              {t.back}
            </Button>
            <Button 
              onClick={handleComplete} 
              className="flex-1 gap-3 h-14 text-lg"
              disabled={completedCount === 0}
              style={{
                ...(theme === "dark" ? {
                  background: 'linear-gradient(135deg, hsl(180 100% 50%), hsl(200 100% 60%))',
                  boxShadow: '0 2px 12px hsl(180 100% 50% / 0.25), 0 4px 24px hsl(180 100% 50% / 0.1)'
                } : {
                  background: 'hsl(186 85% 42%)',
                  boxShadow: '0 1px 3px hsl(0 0% 0% / 0.12), 0 1px 2px hsl(0 0% 0% / 0.08)'
                })
              }}
            >
              <span className="text-white">{t.viewResults}</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </KioskLayout>
    );
  }

  // Measurement instructions data
  const measurementInstructions = t.instructions;

  // Individual measurement screens
  const currentMeasurement = measurements.find(m => m.key === activeMeasurement)!;
  const Icon = currentMeasurement.icon;
  const instructions = measurementInstructions[activeMeasurement];
  const isCompleted = completedMeasurements[activeMeasurement];
  const { theme } = useTheme();

  // Instruction screen (before measurement starts) - Calm, text-first, procedural
  if (!isMeasuring && !isCompleted) {
    return (
      <KioskLayout 
        showAvatar 
        avatarMood="neutral" 
        title={instructions.title}
        subtitle={t.instructionTitle}
      >
        <div className="h-full flex flex-col max-w-3xl mx-auto">
          <div className="rounded-2xl border border-cyan-100/30 overflow-hidden shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] flex-1 flex flex-col" style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}>
            {/* Header - Clinical, icon + text */}
            <div className="flex items-center gap-4 p-6 border-b border-cyan-100/20">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">{instructions.title}</h2>
                <p className="text-base text-muted-foreground">{t.instructionTitle}</p>
              </div>
            </div>

            {/* Steps - Text-first, procedural, no gradients */}
            <div className="p-6 space-y-4">
              {instructions.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  {/* Step number - Neutral, flat, no gradient */}
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-base font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-base text-foreground pt-1.5 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            {/* Image/Video placeholder - Calm, no animations */}
            <div className="flex-1 mx-5 mb-5 rounded-xl border border-dashed border-cyan-100/30 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-center" style={{ backgroundColor: 'rgba(240, 249, 255, 0.04)' }}>
              <div className="text-center">
                <div className="w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-cyan-100/20 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_1px_4px_rgba(0,0,0,0.02)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}>
                  <Icon className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">{t.photoPlaceholder}</p>
              </div>
            </div>

            {/* Start button - Large, Flat, clinical */}
            <div className="p-8 pt-0 flex gap-4">
              <Button 
                variant="outline" 
                onClick={closeMeasurement}
                className="flex-shrink-0 h-14 w-14"
              >
                <X className="w-6 h-6" />
              </Button>
              <Button 
                onClick={startMeasurement}
                className="flex-1 h-14 text-xl font-semibold"
                style={{
                  ...(theme === "dark" ? {
                    background: 'linear-gradient(135deg, hsl(180 100% 50%), hsl(200 100% 60%))',
                    boxShadow: '0 2px 12px hsl(180 100% 50% / 0.25), 0 4px 24px hsl(180 100% 50% / 0.1)'
                  } : {
                    background: 'hsl(186 85% 42%)',
                    boxShadow: '0 1px 3px hsl(0 0% 0% / 0.12), 0 1px 2px hsl(0 0% 0% / 0.08)'
                  })
                }}
              >
                <span className="text-white">{t.startMeasurement}</span>
              </Button>
            </div>
          </div>
        </div>
      </KioskLayout>
    );
  }

  // Measuring or completed screen
  return (
    <KioskLayout 
      showAvatar 
      avatarMood={isMeasuring ? "speaking" : "neutral"} 
      title={currentMeasurement.title}
      subtitle={currentMeasurement.subtitle}
    >
      <div className="h-full flex flex-col max-w-2xl mx-auto">
        <div className="rounded-xl border border-cyan-100/30 p-4 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] flex-1 flex flex-col" style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}>
          
          {/* BP Measurement */}
          {activeMeasurement === "bp" && (
            <div className="flex-1 flex flex-col items-center justify-center">
              {isMeasuring ? (
                <>
                  <BreathingCircle phase={breathPhase} size={120} />
                  <p className="mt-4 text-sm text-muted-foreground text-center">
                    {t.bpInstructions}
                  </p>
                </>
              ) : (
                <BloodPressureGauge 
                  systolic={results.systolic!}
                  diastolic={results.diastolic!}
                  pulse={results.pulse}
                />
              )}
            </div>
          )}

          {/* SpO2 Measurement */}
          {activeMeasurement === "spo2" && (
            <div className="flex-1 flex flex-col items-center justify-center overflow-auto">
              {isMeasuring ? (
                <div className="text-center">
                  <div className="relative mb-4">
                    <FuturisticOxygenIcon size={64} className="text-cyan-500" />
                  </div>
                  <p className="text-lg text-muted-foreground">{t.measuring} %{progress}</p>
                </div>
              ) : (
                <SpO2Gauge value={results.spo2!} pulse={results.pulse} />
              )}
            </div>
          )}

          {/* Weight Measurement */}
          {activeMeasurement === "weight" && (
            <div className="flex-1 flex flex-col items-center justify-center overflow-auto">
              {isMeasuring ? (
                <div className="text-center">
                  <div className="relative mb-4">
                    <FuturisticScaleIcon size={64} className="text-emerald-500" />
                  </div>
                  <p className="text-lg text-muted-foreground">{t.weighing} %{progress}</p>
                </div>
              ) : (
                <BMIGauge bmi={results.bmi!} weight={results.weight!} height={results.height!} />
              )}
            </div>
          )}

          {/* Temperature Measurement */}
          {activeMeasurement === "temp" && (
            <div className="flex-1 flex flex-col items-center justify-center overflow-auto">
              {isMeasuring ? (
                <div className="text-center">
                  <div className="relative mb-4">
                    <FuturisticThermometerIcon size={64} className="text-amber-500" />
                  </div>
                  <p className="text-lg text-muted-foreground">{t.measuring} %{progress}</p>
                </div>
              ) : (
                <TemperatureGauge value={results.temperature!} />
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-cyan-100/20">
            <Button variant="outline" size="sm" onClick={closeMeasurement} className="gap-1">
              <X className="w-3 h-3" /> {t.close}
            </Button>
            {!completedMeasurements[activeMeasurement] && !isMeasuring && (
              <Button onClick={startMeasurement} size="sm" className="flex-1 gap-2">
                <Icon className="w-4 h-4" /> {t.startMeasurement}
              </Button>
            )}
            {completedMeasurements[activeMeasurement] && (
              <Button onClick={closeMeasurement} size="sm" className="flex-1 gap-2 bg-success hover:bg-success/90">
                <Check className="w-4 h-4" /> {t.completed}
              </Button>
            )}
          </div>
        </div>
      </div>
    </KioskLayout>
  );
};

export default MeasurementScreen;
