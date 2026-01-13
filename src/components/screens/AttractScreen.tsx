import { useState, Suspense, useMemo } from "react";
import FixedHeader from "@/components/kiosk/FixedHeader";
import { useTheme } from "@/hooks/use-theme";
import { Heart, Thermometer, Scale, ArrowRight } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Vector3, Spherical } from "three";
import aiAssistantModel from "@/assets/ai_assistant.glb?url";

type Language = "tr" | "en" | "fi";

interface AttractScreenProps {
  onStart: (language: Language) => void;
}

const translations = {
  tr: {
    title: "Dijital Sağlık Merkezi",
    subtitle: "Özel • Hızlı • Güvenli",
    start: "Sağlık Kontrolünü Başlat",
    startAlt: "Kontrole Devam Et",
    statusReady: "Oturum Hazır",
    statusSecure: "Özel ve Şifrelenmiş",
    heartRate: "Kalp Ritmi",
    bodyTemp: "Vücut Isısı",
    analysis: "Genel Analiz",
    privacy: "Verileriniz kaydedilmez"
  },
  en: {
    title: "Start Health Check",
    subtitle: "Private • Secure • Takes 2 Minutes",
    start: "Start Health Check",
    startAlt: "Continue Check",
    statusReady: "Session Ready",
    statusSecure: "Private & Encrypted",
    heartRate: "Heart Rate",
    bodyTemp: "Body Temp",
    analysis: "Analysis",
    privacy: "Your data is not stored"
  },
  fi: {
    title: "Aloita Terveystarkastus",
    subtitle: "Yksityinen • Turvallinen • 2 Minuuttia",
    start: "Aloita Terveystarkastus",
    startAlt: "Jatka Tarkastusta",
    statusReady: "Istunto Valmis",
    statusSecure: "Yksityinen ja Salattu",
    heartRate: "Syke",
    bodyTemp: "Lämpötila",
    analysis: "Analyysi",
    privacy: "Tietojasi ei tallenneta"
  }
};

const languages = [
  { code: "tr" as Language, name: "Türkçe" },
  { code: "en" as Language, name: "English" },
  { code: "fi" as Language, name: "Suomi" }
];

// Flag components
const TurkeyFlag = () => (
  <svg viewBox="0 0 36 24" className="w-8 h-6 rounded-sm">
    <rect width="36" height="24" fill="#E30A17"/>
    <circle cx="13" cy="12" r="6" fill="white"/>
    <circle cx="14.5" cy="12" r="4.8" fill="#E30A17"/>
    <polygon fill="white" points="19,12 21.5,10.5 20,12 21.5,13.5" transform="rotate(18, 19, 12)"/>
  </svg>
);

const UKFlag = () => (
  <svg viewBox="0 0 36 24" className="w-8 h-6 rounded-sm">
    <rect width="36" height="24" fill="#012169"/>
    <path d="M0,0 L36,24 M36,0 L0,24" stroke="white" strokeWidth="4"/>
    <path d="M0,0 L36,24 M36,0 L0,24" stroke="#C8102E" strokeWidth="2.5"/>
    <path d="M18,0 V24 M0,12 H36" stroke="white" strokeWidth="6"/>
    <path d="M18,0 V24 M0,12 H36" stroke="#C8102E" strokeWidth="3.5"/>
  </svg>
);

const FinlandFlag = () => (
  <svg viewBox="0 0 36 24" className="w-8 h-6 rounded-sm">
    <rect width="36" height="24" fill="white"/>
    <rect x="10" y="0" width="6" height="24" fill="#003580"/>
    <rect x="0" y="9" width="36" height="6" fill="#003580"/>
  </svg>
);

const FlagComponent = ({ code }: { code: Language }) => {
  switch (code) {
    case "tr": return <TurkeyFlag />;
    case "en": return <UKFlag />;
    case "fi": return <FinlandFlag />;
  }
};

// Simple 3D Model Component for AttractScreen
function AIAssistantModel() {
  const { scene } = useGLTF(aiAssistantModel);
  
  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    
    // Calculate bounding box and center the model
    const box = new Box3().setFromObject(cloned);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 5.5 / maxDim;
    
    // Apply clinical appearance
    cloned.traverse((child) => {
      if ((child as any).isMesh) {
        const material = (child as any).material.clone();
        material.transparent = true;
        material.opacity = 0.75;
        
        if (material.color) {
          material.color.setRGB(0.95, 0.95, 0.98);
          material.color.multiplyScalar(1.2);
        }
        
        if (material.emissive !== undefined) {
          material.emissive.setRGB(0.15, 0.15, 0.18);
        }
        
        if (material.roughness !== undefined) {
          material.roughness = Math.min(material.roughness * 0.6, 0.3);
        }
        
        if (material.metalness !== undefined) {
          material.metalness = Math.max(material.metalness * 0.3, 0.0);
        }
        
        (child as any).material = material;
      }
    });
    
    cloned.position.sub(center);
    cloned.scale.set(scale, scale, scale);
    cloned.position.y += 2.0;
    
    return cloned;
  }, [scene]);
  
  return <primitive object={clonedScene} rotation={[0, 0, 0]} />;
}

// Preload the model
useGLTF.preload(aiAssistantModel);

const AttractScreen = ({ onStart }: AttractScreenProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("tr");
  const { theme, toggleTheme } = useTheme();

  const t = translations[selectedLanguage];

  // Camera setup - tilted up view
  const defaultPolarAngle = Math.PI / 3.0; // ~60 degrees - more tilted up view
  const radius = 8.0; // Camera distance - further back
  const initialAzimuth = 0;
  
  // Calculate initial camera position using spherical coordinates
  const initialOffset = new Vector3().setFromSpherical(
    new Spherical(radius, defaultPolarAngle, initialAzimuth)
  );
  const initialCameraPosition = initialOffset.toArray() as [number, number, number];

  return (
    <div className="h-screen w-full relative overflow-hidden bg-transparent">
      {/* Fixed Header - Same on all screens */}
      <FixedHeader />

      {/* Language flags - positioned below fixed header */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelectedLanguage(lang.code)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
              selectedLanguage === lang.code 
                ? 'border border-cyan-200/40 shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_4px_24px_rgba(0,0,0,0.06),0_0_30px_rgba(207,250,254,0.2)]' 
                : 'border border-cyan-100/30 hover:border-cyan-200/40 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2)]'
            }`}
            style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}
          >
            <FlagComponent code={lang.code} />
          </button>
        ))}
      </div>

      {/* Main content - Fits entirely in viewport, no scrolling needed */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-between px-8 pt-20 pb-6 overflow-hidden">
        {/* Top spacer for fixed header */}
        <div className="h-20 flex-shrink-0"></div>
        
        {/* Central 3D Model */}
        <div className="flex flex-col items-center gap-4 flex-shrink-0 -mt-16">
          {/* 3D Model */}
          <div className="relative w-96 h-96 flex items-center justify-center">
            <div className="w-full h-full relative transition-all duration-200 drop-shadow-[0_0_25px_hsl(var(--primary)/0.3)]">
              <Canvas
                camera={{ position: initialCameraPosition, fov: 50 }}
                style={{ width: '100%', height: '100%', background: 'transparent' }}
                gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={1.0} />
                  <directionalLight position={[5, 5, 5]} intensity={1.2} />
                  <directionalLight position={[-5, -5, -5]} intensity={0.6} />
                  <directionalLight position={[0, 10, 0]} intensity={0.8} />
                  <AIAssistantModel />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={true}
                    minDistance={8.0}
                    maxDistance={8.0}
                    autoRotate={true}
                    autoRotateSpeed={-3.5}
                    rotateSpeed={0.5}
                    target={[0, 2.0, 0]}
                  />
                </Suspense>
              </Canvas>
            </div>
          </div>
        </div>

        {/* Title - large, confident, readable from distance */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0 -mt-4">
          <h1 className="text-4xl md:text-5xl font-sans font-semibold text-foreground text-center tracking-normal leading-tight max-w-3xl">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground text-center font-normal tracking-normal leading-relaxed max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        {/* Primary Action Button - Large, clear, medical appropriate */}
        <button
          onClick={() => onStart(selectedLanguage)}
          className="group relative flex items-center gap-3 px-14 py-5 rounded-xl border border-cyan-300/50 hover:border-cyan-400/60 font-sans font-semibold text-lg transition-all duration-200 flex-shrink-0 shadow-[0_0_0_1px_rgba(103,232,249,0.4),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(103,232,249,0.2)] hover:shadow-[0_0_0_1px_rgba(103,232,249,0.5),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(103,232,249,0.3)]"
          style={{ backgroundColor: 'rgba(103, 232, 249, 0.1)' }}
        >
          <span className="text-cyan-100 relative z-10">{t.start}</span>
          <ArrowRight className="w-5 h-5 text-cyan-100 relative z-10 transition-opacity duration-100 group-hover:opacity-80" />
        </button>

        {/* Feature icons - matching WelcomeScreen theme */}
        <div className="flex items-center justify-center gap-8 md:gap-12 flex-shrink-0 pb-2">
          {[
            { 
              icon: Heart, 
              label: t.heartRate
            },
            { 
              icon: Thermometer, 
              label: t.bodyTemp
            },
            { 
              icon: Scale, 
              label: t.analysis
            }
          ].map(({ icon: Icon, label }) => {
            return (
              <div key={label} className="text-center group">
                <div 
                  className="w-16 h-16 rounded-xl border border-cyan-100/30 hover:border-cyan-200/40 flex items-center justify-center mb-3 mx-auto transition-all duration-200 shadow-[0_0_0_1px_rgba(207,250,254,0.3),0_4px_24px_rgba(0,0,0,0.04),0_0_30px_rgba(207,250,254,0.15)] hover:shadow-[0_0_0_1px_rgba(207,250,254,0.4),0_6px_32px_rgba(0,0,0,0.08),0_0_40px_rgba(207,250,254,0.2)]"
                  style={{ backgroundColor: 'rgba(240, 249, 255, 0.06)' }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <span className="text-sm text-foreground font-medium tracking-normal">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttractScreen;
