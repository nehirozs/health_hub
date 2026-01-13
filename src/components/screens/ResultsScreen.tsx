import { Button } from "@/components/ui/button";
import { MeasurementResults } from "./MeasurementScreen";
import RadarChart from "@/components/kiosk/RadarChart";
import SystemCard from "@/components/kiosk/SystemCard";
import FixedHeader from "@/components/kiosk/FixedHeader";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { 
  Heart, Video, RefreshCw, TrendingUp,
  Zap, Shield, Clock, Brain, Wind, Bone, ArrowLeft, ChevronDown,
  ChevronLeft, ChevronRight, Calendar, Mail
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Model3D from "@/components/kiosk/Model3D";

type ActiveRegion = 'cardiovascular' | 'neurological' | 'respiratory' | 'musculoskeletal' | 'score' | null;
type Language = "tr" | "en" | "fi";

interface ResultsScreenProps {
  results: MeasurementResults;
  onTelehealth: () => void;
  onRestart: () => void;
  onExit: () => void;
  onBack: () => void;
  language?: Language;
}

const translations = {
  tr: {
    title: "Sağlık Analizi",
    subtitle: "Kapsamlı sağlık değerlendirme raporunuz",
    back: "Geri",
    newMeasurement: "Yeni Ölçüm",
    consultDoctor: "Doktorla Görüş",
    exit: "Çıkış",
    viewDetailedReport: "Detaylı Raporu Gör",
    eCliniqScore: "E-Cliniq Skoru",
    status: "Durum",
    veryGood: "Çok İyi",
    followUpRequired: "Takip Gerekli",
    healthSummary: "Sağlık Özeti",
    previousMeasurements: "Geçmiş Ölçümler",
    last30Days: "Son 30 gün",
    bodyBalanceProfile: "Vücut Denge Profili",
    irregularAreas: "Düzensiz alanlar takip edilmelidir",
    upcomingCalls: "Yaklaşan Görüşmeler",
    pastCalls: "Geçmiş Görüşmeler",
    scheduled: "Planlandı",
    completed: "Tamamlandı",
    details: "Detaylar"
  },
  en: {
    title: "Health Analysis",
    subtitle: "Your comprehensive health assessment report",
    back: "Back",
    newMeasurement: "New Measurement",
    consultDoctor: "Consult Doctor",
    exit: "Exit",
    viewDetailedReport: "View Detailed Report",
    eCliniqScore: "E-Cliniq Score",
    status: "Status",
    veryGood: "Very Good",
    followUpRequired: "Follow-up Required",
    healthSummary: "Health Summary",
    previousMeasurements: "Previous Measurements",
    last30Days: "Last 30 days",
    bodyBalanceProfile: "Body Balance Profile",
    irregularAreas: "Irregular areas should be monitored",
    upcomingCalls: "Upcoming Consultations",
    pastCalls: "Past Consultations",
    scheduled: "Scheduled",
    completed: "Completed",
    details: "Details"
  },
  fi: {
    title: "Terveysanalyysi",
    subtitle: "Kattava terveysarviointiraporttisi",
    back: "Takaisin",
    newMeasurement: "Uusi Mittaus",
    consultDoctor: "Konsultoi Lääkäriä",
    exit: "Poistu",
    viewDetailedReport: "Näytä Yksityiskohtainen Raportti",
    eCliniqScore: "E-Cliniq Pisteet",
    status: "Tila",
    veryGood: "Erittäin Hyvä",
    followUpRequired: "Seuranta Tarvitaan",
    healthSummary: "Terveysyhteenveto",
    previousMeasurements: "Aiemmat Mittaukset",
    last30Days: "Viimeiset 30 päivää",
    bodyBalanceProfile: "Kehon Tasapainoprofiili",
    irregularAreas: "Epäsäännölliset alueet tulee seurata",
    upcomingCalls: "Tulevat Konsultaatiot",
    pastCalls: "Aiemmat Konsultaatiot",
    scheduled: "Ajoitettu",
    completed: "Valmis",
    details: "Yksityiskohdat"
  }
};

const ResultsScreen = ({ results, onTelehealth, onRestart, onExit, onBack, language = "tr" }: ResultsScreenProps) => {
  const t = translations[language];
  const bpScore = results.systolic < 120 && results.diastolic < 80 ? 95 :
                  results.systolic < 130 && results.diastolic < 85 ? 80 :
                  results.systolic < 140 && results.diastolic < 90 ? 60 : 40;
  
  const spo2Score = results.spo2 >= 98 ? 100 : results.spo2 >= 95 ? 85 : results.spo2 >= 90 ? 60 : 30;
  const bmiScore = results.bmi >= 18.5 && results.bmi < 25 ? 95 : results.bmi >= 25 && results.bmi < 27 ? 75 : results.bmi >= 27 && results.bmi < 30 ? 55 : 35;
  const tempScore = results.temperature < 37.2 ? 100 : results.temperature < 37.5 ? 80 : results.temperature < 38 ? 50 : 25;
  const pulseScore = results.pulse >= 60 && results.pulse <= 100 ? 90 : results.pulse >= 50 && results.pulse <= 110 ? 70 : 45;

  const wellnessScore = Math.round((bpScore + spo2Score + bmiScore + tempScore + pulseScore) / 5);
  const isHealthy = wellnessScore >= 70;

  const radarData = [
    { label: "Tansiyon", value: bpScore },
    { label: "Oksijen", value: spo2Score },
    { label: "Vücut Kitle", value: bmiScore },
    { label: "Sıcaklık", value: tempScore },
    { label: "Nabız", value: pulseScore }
  ];

  const previousMeasurements = [
    { date: "10 Oca", score: 72 },
    { date: "15 Oca", score: 78 },
    { date: "20 Oca", score: 75 },
    { date: "25 Oca", score: 82 },
    { date: "Bugün", score: wellnessScore }
  ];

  const getScoreColor = () => {
    if (wellnessScore >= 85) return "text-success";
    if (wellnessScore >= 70) return "text-primary";
    if (wellnessScore >= 50) return "text-warning";
    return "text-destructive";
  };

  const getScoreGradient = () => {
    if (wellnessScore >= 85) return "from-success to-health-good";
    if (wellnessScore >= 70) return "from-primary to-info";
    if (wellnessScore >= 50) return "from-warning to-amber-600";
    return "from-destructive to-rose-600";
  };

  // Color-coded trend with medical UX standards (amber for warnings, red only for critical)
  const getTrendColor = (score: number) => {
    if (score >= 80) return "text-success"; // Good - green
    if (score >= 60) return "text-muted-foreground"; // Neutral - muted
    if (score >= 40) return "text-warning"; // Warning - amber
    return "text-destructive"; // Critical - red
  };


  // Body system categories - standardized 2 metrics each
  const bodySystemCategories = [
    {
      id: 'cardiovascular',
      title: 'Kardiyovasküler',
      icon: Heart,
      metrics: [
        { label: 'Tansiyon', value: `${results.systolic}/${results.diastolic}`, unit: 'mmHg', score: bpScore },
        { label: 'Nabız', value: results.pulse.toString(), unit: 'bpm', score: pulseScore }
      ]
    },
    {
      id: 'neurological',
      title: 'Nörolojik',
      icon: Brain,
      metrics: [
        { label: 'Ateş', value: results.temperature.toString(), unit: '°C', score: tempScore },
        { label: 'Stres', value: isHealthy ? 'Düşük' : 'Orta', unit: '', score: isHealthy ? 85 : 60 }
      ]
    },
    {
      id: 'respiratory',
      title: 'Solunum',
      icon: Wind,
      metrics: [
        { label: 'SpO2', value: results.spo2.toString(), unit: '%', score: spo2Score },
        { label: 'Solunum', value: '16', unit: '/dk', score: 88 }
      ]
    },
    {
      id: 'musculoskeletal',
      title: 'Kas & İskelet',
      icon: Bone,
      metrics: [
        { label: 'BMI', value: results.bmi.toString(), unit: '', score: bmiScore },
        { label: 'Kilo', value: results.weight.toString(), unit: 'kg', score: bmiScore }
      ]
    }
  ];

  const detailsRef = useRef<HTMLDivElement>(null);
  const [activeRegion, setActiveRegion] = useState<ActiveRegion>(null);
  const [hoveredRegion, setHoveredRegion] = useState<ActiveRegion>(null);
  
  // Health Summary section state
  const [selectedMetric, setSelectedMetric] = useState<string>('Tansiyon');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30-gün');
  const [currentDateRange, setCurrentDateRange] = useState({ start: '29 Kas', end: '28 Ara' });

  // Combined region for glow display (active takes priority, then hover - but exclude score from hover glow)
  const glowRegion = activeRegion || (hoveredRegion && hoveredRegion !== 'score' ? hoveredRegion : null);

  // Sample chart data for health metrics
  const chartData = [
    { date: '29/11', systolic: 107, diastolic: 70 },
    { date: '4/12', systolic: 116, diastolic: 72 },
    { date: '10/12', systolic: 125, diastolic: 75 },
    { date: '16/12', systolic: 134, diastolic: 78 },
    { date: '22/12', systolic: 143, diastolic: 80 },
    { date: '28/12', systolic: 152, diastolic: 82 }
  ];

  const healthMetrics = ['Tansiyon', 'Nabız', 'Oksijen', 'Kilo', 'Sıcaklık', 'BMI', 'Vücut Kompozisyonu'];
  const timeframes = ['7-gün', '30-gün', '90-gün', '1-yıl'];

  const chartConfig = {
    systolic: {
      label: "Sistolik",
      color: "hsl(222, 47%, 11%)",
    },
    diastolic: {
      label: "Diyastolik",
      color: "hsl(222, 47%, 11%)",
    },
    normal: {
      label: "Normal",
      color: "hsl(142, 76%, 36%)",
    },
    elevated: {
      label: "Yüksek Normal",
      color: "hsl(45, 93%, 47%)",
    },
    high: {
      label: "Yüksek",
      color: "hsl(0, 84%, 60%)",
    },
  };

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCardClick = (region: ActiveRegion) => {
    setActiveRegion(prev => prev === region ? null : region);
  };

  const handleCardHover = (region: ActiveRegion, isHovering: boolean) => {
    setHoveredRegion(isHovering ? region : null);
  };

  // Clear active state when clicking outside cards
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if click is inside a card or score card
      if (!target.closest('[data-card]')) {
        setActiveRegion(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="h-full w-full relative overflow-y-auto bg-transparent">
      {/* Fixed Header - Same on all screens */}
      <FixedHeader />
      
      {/* First Page - Full Viewport */}
      <div className="h-screen w-full relative p-3 flex flex-col">
        
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header with Title - Large, clear */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-sans font-semibold text-foreground mb-2 tracking-normal">{t.title}</h1>
            <p className="text-lg font-sans font-normal text-muted-foreground opacity-70">{t.subtitle}</p>
          </div>

          {/* Main Content - Da Vinci Layout */}
          <div className="flex-1 flex justify-center items-center min-h-0 px-4">
            <div className="flex items-center gap-6 w-full max-w-[1600px] justify-center">
              {/* Left Column - Top 2 Categories */}
              <div className="w-[420px] flex flex-col justify-center gap-4" style={{ perspective: '800px' }}>
                {bodySystemCategories.slice(0, 2).map((category) => (
                  <div key={category.id} data-card>
                    <SystemCard
                      id={category.id}
                      title={category.title}
                      icon={category.icon}
                      metrics={category.metrics}
                      position="left"
                      getTrendColor={getTrendColor}
                      isActive={activeRegion === category.id}
                      onClick={() => handleCardClick(category.id as ActiveRegion)}
                      onHover={(isHovering) => handleCardHover(category.id as ActiveRegion, isHovering)}
                    />
                  </div>
                ))}
              </div>

              {/* Center - Da Vinci Figure with Wellness Score on top */}
              <div className="w-[400px] flex flex-col items-center justify-center relative flex-shrink-0" style={{ perspective: '800px' }}>
                {/* Wellness Score Card - Same style as SystemCards */}
                <div 
                  data-card
                  className={`group relative z-20 mb-4 -mt-8 rounded-xl px-6 py-4 relative overflow-hidden border border-cyan-100/30 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] transition-all duration-200 ease-out cursor-pointer
                    ${activeRegion === 'score' 
                      ? 'border-cyan-200/40 shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2),0_0_60px_rgba(165,243,252,0.1)] scale-[1.02]' 
                      : 'hover:border-cyan-200/40 hover:shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2),0_0_60px_rgba(165,243,252,0.1)] hover:scale-[1.02] hover:[transform:perspective(800px)_rotateX(-8deg)_translateZ(10px)]'
                    }`}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: activeRegion === 'score' ? 'perspective(800px) rotateX(-8deg) translateZ(10px)' : undefined,
                    backgroundColor: 'rgba(240, 249, 255, 0.06)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick('score');
                  }}
                  onMouseEnter={() => handleCardHover('score', true)}
                  onMouseLeave={() => handleCardHover('score', false)}
                >
                  
                  <div className="relative z-10 flex items-center gap-5">
                    <div className="flex items-center gap-3">
                      <div className={`text-5xl font-sans font-semibold text-primary transition-transform duration-200 ${activeRegion === 'score' ? 'scale-110' : 'group-hover:scale-110'}`}>{wellnessScore}</div>
                      <div className="text-lg font-sans font-normal text-primary">/100</div>
                    </div>
                    <div className="flex flex-col border-l border-border/20 pl-5">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-lg font-sans font-medium text-foreground">{t.eCliniqScore}</span>
                      </div>
                      <span className="text-base text-muted-foreground">
                        {t.status}: <span className={getScoreColor()}>{isHealthy ? t.veryGood : t.followUpRequired}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Holographic glow effect */}
                <div className="absolute inset-0 flex items-center justify-center mt-12">
                  <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-r from-primary/15 via-info/10 to-primary/15 blur-2xl" />
                </div>
                
                {/* Da Vinci Figure with Anatomical Overlays */}
                <div className="relative z-10">
                  <Model3D glowRegion={glowRegion} />
                  
                  {/* Glow Overlays - positioned on top of 3D model */}
                  <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
                    {/* Heart Glow - Cardiovascular - positioned at heart */}
                    <div 
                      className={`absolute top-[28%] left-[52%] w-[50px] h-[50px] rounded-full ${glowRegion === 'cardiovascular' ? 'opacity-85' : 'opacity-0'}`}
                      style={{ 
                        background: 'radial-gradient(circle, hsl(0 85% 55% / 0.65) 0%, hsl(180 100% 50% / 0.55) 40%, hsl(180 100% 50% / 0.4) 60%, transparent 80%)',
                        transform: 'translate(-50%, -50%)',
                        filter: 'blur(8px)',
                        transition: 'opacity 200ms ease-out',
                        boxShadow: glowRegion === 'cardiovascular' ? '0 0 18px hsl(0 85% 55% / 0.65), 0 0 35px hsl(180 100% 50% / 0.5)' : 'none'
                      }}
                    />
                    
                    {/* Brain Glow - Neurological - positioned at head */}
                    <div 
                      className={`absolute top-[12%] left-[50%] w-[55px] h-[50px] rounded-full ${glowRegion === 'neurological' ? 'opacity-85' : 'opacity-0'}`}
                      style={{ 
                        background: 'radial-gradient(ellipse, hsl(0 85% 55% / 0.65) 0%, hsl(180 100% 50% / 0.55) 40%, hsl(180 100% 50% / 0.4) 60%, transparent 80%)',
                        transform: 'translate(-50%, -50%)',
                        filter: 'blur(8px)',
                        transition: 'opacity 200ms ease-out',
                        boxShadow: glowRegion === 'neurological' ? '0 0 18px hsl(0 85% 55% / 0.65), 0 0 35px hsl(180 100% 50% / 0.5)' : 'none'
                      }}
                    />
                    
                    {/* Lungs Glow - Respiratory */}
                    <div 
                      className={`absolute top-[28%] left-[50%] w-[70px] h-[85px] rounded-full ${glowRegion === 'respiratory' ? 'opacity-85' : 'opacity-0'}`}
                      style={{ 
                        background: 'radial-gradient(ellipse, hsl(0 85% 55% / 0.65) 0%, hsl(180 100% 50% / 0.55) 40%, hsl(180 100% 50% / 0.4) 60%, transparent 80%)',
                        transform: 'translate(-50%, -50%)',
                        filter: 'blur(10px)',
                        transition: 'opacity 200ms ease-out',
                        boxShadow: glowRegion === 'respiratory' ? '0 0 25px hsl(0 85% 55% / 0.65), 0 0 50px hsl(180 100% 50% / 0.5)' : 'none'
                      }}
                    />
                    
                    {/* Musculoskeletal Glow - full body subtle */}
                    <div 
                      className={`absolute top-[40%] left-[50%] w-[100px] h-[200px] rounded-full ${glowRegion === 'musculoskeletal' ? 'opacity-85' : 'opacity-0'}`}
                      style={{ 
                        background: 'radial-gradient(ellipse, hsl(0 85% 55% / 0.55) 0%, hsl(180 100% 50% / 0.5) 40%, hsl(180 100% 50% / 0.35) 60%, transparent 80%)',
                        transform: 'translate(-50%, -50%)',
                        filter: 'blur(12px)',
                        transition: 'opacity 200ms ease-out',
                        boxShadow: glowRegion === 'musculoskeletal' ? '0 0 30px hsl(0 85% 55% / 0.55), 0 0 60px hsl(180 100% 50% / 0.4)' : 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Detaylı Raporu Gör button below figure */}
                <Button 
                  variant="outline" 
                  onClick={scrollToDetails}
                  className="relative z-10 mt-6 gap-2 text-sm border border-cyan-100/30 hover:border-cyan-200/40 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_12px_rgba(207,250,254,0.1)]"
                  style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}
                >
                  <ChevronDown className="w-4 h-4" />
                  {t.viewDetailedReport}
                </Button>
              </div>

              {/* Right Column - Bottom 2 Categories */}
              <div className="w-[420px] flex flex-col justify-center gap-4" style={{ perspective: '800px' }}>
                {bodySystemCategories.slice(2, 4).map((category) => (
                  <div key={category.id} data-card>
                    <SystemCard
                      id={category.id}
                      title={category.title}
                      icon={category.icon}
                      metrics={category.metrics}
                      position="right"
                      getTrendColor={getTrendColor}
                      isActive={activeRegion === category.id}
                      onClick={() => handleCardClick(category.id as ActiveRegion)}
                      onHover={(isHovering) => handleCardHover(category.id as ActiveRegion, isHovering)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons at Bottom - Large, clear Horizontal Layout */}
          <div className="flex justify-center gap-4 mt-6 mb-4 flex-wrap">
            <Button variant="ghost" onClick={onBack} className="gap-2 text-lg text-muted-foreground hover:text-foreground border border-cyan-100/30 px-8 h-14 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] hover:border-cyan-200/40 hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_12px_rgba(207,250,254,0.1)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}>
              <ArrowLeft className="w-5 h-5" /> {t.back}
            </Button>
            <Button variant="ghost" onClick={onRestart} className="gap-2 text-lg text-muted-foreground hover:text-foreground border border-cyan-100/30 px-8 h-14 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] hover:border-cyan-200/40 hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_12px_rgba(207,250,254,0.1)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}>
              <RefreshCw className="w-5 h-5" /> {t.newMeasurement}
            </Button>
            <Button 
              onClick={onTelehealth} 
              className="gap-2 text-lg px-8 h-14 border border-cyan-200/40 shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_4px_16px_rgba(207,250,254,0.2),0_0_30px_rgba(165,243,252,0.15)] hover:border-cyan-300/50 hover:shadow-[0_0_0_1px_rgba(207,250,254,0.5),0_6px_20px_rgba(207,250,254,0.25),0_0_40px_rgba(165,243,252,0.2)] text-foreground"
              style={{ backgroundColor: 'rgba(207, 250, 254, 0.15)' }}
            >
              <Video className="w-5 h-5" /> {t.consultDoctor}
            </Button>
            <Button variant="ghost" onClick={onExit} className="text-lg text-muted-foreground hover:text-foreground border border-cyan-100/30 px-8 h-14 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)] hover:border-cyan-200/40 hover:shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_12px_rgba(207,250,254,0.1)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}>
              {t.exit}
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Details Section */}
      <div ref={detailsRef} className="w-full relative p-6 min-h-screen">
        <div className="relative z-10 max-w-[1200px] mx-auto">
          {/* Sağlık Özeti Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-7 h-7 text-primary" />
              <span className="text-2xl font-sans font-medium text-foreground">{t.healthSummary}</span>
            </div>

            {/* Top Control Panel */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              {/* Health Metric Buttons */}
              <div className="flex gap-2 flex-wrap">
                {healthMetrics.map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                      selectedMetric === metric
                        ? 'border-cyan-200/40 text-foreground shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_8px_rgba(207,250,254,0.1)]'
                        : 'border-cyan-100/20 text-muted-foreground hover:border-cyan-100/30 hover:text-foreground'
                    }`}
                    style={{ backgroundColor: selectedMetric === metric ? 'rgba(240, 249, 255, 0.08)' : 'rgba(240, 249, 255, 0.04)' }}
                  >
                    {metric}
                  </button>
                ))}
              </div>

              {/* Date Range Selector */}
              <div className="flex items-center gap-2 rounded-lg px-4 py-2 border border-cyan-100/30 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_8px_rgba(0,0,0,0.03)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}>
                <button className="p-1 hover:bg-secondary rounded">
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
                <span className="text-sm font-medium text-foreground px-2">
                  {currentDateRange.start} - {currentDateRange.end}
                </span>
                <button className="p-1 hover:bg-secondary rounded">
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>
              </div>

              {/* Timeframe Buttons */}
              <div className="flex gap-2">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                      selectedTimeframe === timeframe
                        ? 'border-cyan-200/40 text-foreground shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_2px_8px_rgba(207,250,254,0.1)]'
                        : 'border-cyan-100/20 text-muted-foreground hover:border-cyan-100/30 hover:text-foreground'
                    }`}
                    style={{ backgroundColor: selectedTimeframe === timeframe ? 'rgba(240, 249, 255, 0.08)' : 'rgba(240, 249, 255, 0.04)' }}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>

            {/* Central Line Graph */}
            <div className="rounded-xl p-6 mb-6 border border-cyan-100/30 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}>
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    label={{ value: 'Tarih', position: 'insideBottom', offset: -5, style: { fontSize: '12px', fill: '#6b7280' } }}
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    label={{ value: 'mmHg', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6b7280' } }}
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    domain={[100, 160]}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    ticks={[107, 116, 125, 134, 143, 152]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    content={() => (
                      <div className="flex items-center justify-center gap-6 pt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-muted-foreground">Sistolik</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-muted-foreground">Diyastolik</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs text-gray-600 dark:text-muted-foreground">Normal</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <span className="text-xs text-gray-600 dark:text-muted-foreground">Yüksek Normal</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-xs text-gray-600 dark:text-muted-foreground">Yüksek</span>
                        </div>
                      </div>
                    )}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="systolic" 
                    stroke="hsl(300, 80%, 55%)" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(300, 80%, 55%)', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>

            {/* Previous Charts - History Chart & Radar */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 rounded-xl p-3 border border-cyan-100/30 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-sans font-medium text-foreground">{t.previousMeasurements}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{t.last30Days}</span>
                </div>
                <div className="h-16 flex items-end justify-between gap-2 px-2">
                  {previousMeasurements.map((m, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className={`w-full rounded-t transition-all ${i === previousMeasurements.length - 1 ? `bg-gradient-to-t ${getScoreGradient()} glow-cyan` : 'bg-primary/30'}`}
                        style={{ height: `${(m.score / 100) * 100}%`, minHeight: '6px' }}
                      />
                      <span className="text-[10px] text-muted-foreground">{m.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-3 w-[240px] border border-cyan-100/30 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] flex flex-col items-center" style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}>
                <span className="text-xs text-muted-foreground font-medium mb-1">{t.bodyBalanceProfile}</span>
                <div className="opacity-90">
                  <RadarChart data={radarData} size={100} />
                </div>
                <span className="text-[10px] text-muted-foreground/70 mt-1">{t.irregularAreas}</span>
              </div>
            </div>

            {/* Call Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Upcoming Calls */}
              <div>
                <div className="rounded-lg px-4 py-3 mb-3 border border-cyan-100/20 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_12px_rgba(0,0,0,0.03)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}>
                  <span className="text-sm font-sans font-medium text-foreground">{t.upcomingCalls}</span>
                </div>
                <div className="rounded-xl p-5 border border-cyan-100/30 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base font-sans font-medium text-foreground">Dr. Nehir Özsunar</span>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">{t.scheduled}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Mail className="w-4 h-4" />
                        <span>doctor@example.com</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>28 Aralık 2025, 22:00</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      {t.details}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Past Calls */}
              <div>
                <div className="rounded-lg px-4 py-3 mb-3 border border-cyan-100/20 shadow-[0_0_0_1px_rgba(207,250,254,0.2),0_2px_12px_rgba(0,0,0,0.03)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.05)' }}>
                  <span className="text-sm font-sans font-medium text-foreground">{t.pastCalls}</span>
                </div>
                <div className="rounded-xl p-5 border border-cyan-100/30 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)]" style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base font-sans font-medium text-foreground">Dr. Nehir Özsunar</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">{t.completed}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Mail className="w-4 h-4" />
                        <span>doctor@example.com</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>26 Aralık 2025, 20:00</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>30 dakika</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      {t.details}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
