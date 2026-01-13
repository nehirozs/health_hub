import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import MedicalSciFiBackground from "@/components/kiosk/MedicalSciFiBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative">
      {/* Consistent medical sci-fi glassmorphism background */}
      <MedicalSciFiBackground />
      
      <div className="text-center max-w-2xl px-8 relative z-10">
        <h1 className="mb-6 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-8 text-2xl text-muted-foreground leading-relaxed">Sayfa bulunamadı</p>
        <p className="mb-10 text-lg text-muted-foreground leading-relaxed">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors"
        >
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  );
};

export default NotFound;
