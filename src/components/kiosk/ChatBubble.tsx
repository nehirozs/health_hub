import { ReactNode } from "react";

interface ChatBubbleProps {
  message: string;
  sender: "ai" | "user";
  children?: ReactNode;
  timestamp?: string;
}

const ChatBubble = ({ message, sender, children, timestamp }: ChatBubbleProps) => {
  const isAI = sender === "ai";

  return (
    <div 
      className={`flex ${isAI ? "justify-start" : "justify-end"} animate-fade-in`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isAI
            ? "bg-card border border-border rounded-bl-none shadow-soft"
            : "gradient-primary text-primary-foreground rounded-br-none shadow-card"
        }`}
      >
        <p className={`text-sm ${isAI ? "text-foreground" : "text-primary-foreground"}`}>
          {message}
        </p>
        
        {children && (
          <div className="mt-3">
            {children}
          </div>
        )}

        {timestamp && (
          <p className={`text-xs mt-2 ${isAI ? "text-muted-foreground" : "text-primary-foreground/70"}`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
