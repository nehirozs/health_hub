import { ReactNode } from "react";
import AIAvatar from "./AIAvatar";
import FixedHeader from "./FixedHeader";

interface KioskLayoutProps {
  children: ReactNode;
  showAvatar?: boolean;
  avatarMood?: "neutral" | "happy" | "concerned" | "speaking";
  showBackground?: boolean;
  title?: string;
  subtitle?: string;
}

const KioskLayout = ({
  children,
  showAvatar = true,
  avatarMood = "neutral",
  showBackground = false,
  title,
  subtitle
}: KioskLayoutProps) => {
  return (
    <div className="h-screen w-full relative overflow-hidden flex flex-col bg-transparent">
      {/* Fixed Header - Same on all screens */}
      <FixedHeader />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header with Avatar */}
        {(showAvatar || title) && (
          <header className="flex-shrink-0 px-6 py-4 pt-20 flex items-center gap-4">
            {showAvatar && (
              <AIAvatar mood={avatarMood} size="md" />
            )}
            {(title || subtitle) && (
              <div className="flex-1">
                {title && (
                  <h1 className="text-3xl font-sans font-semibold text-foreground tracking-normal leading-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-muted-foreground font-normal leading-relaxed">{subtitle}</p>
                )}
              </div>
            )}
          </header>
        )}

        {/* Main content */}
        <main className="flex-1 px-6 py-2 overflow-y-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 px-4 py-3 flex items-center justify-between glass border-t border-border/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Sistem Aktif</span>
          </div>
          <div className="text-xs text-muted-foreground font-sans tracking-normal">
            ecliniq © 2026
          </div>
        </footer>
      </div>
    </div>
  );
};

export default KioskLayout;
