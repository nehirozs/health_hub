import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme class on document before rendering
const getInitialTheme = (): "dark" | "light" => {
  const stored = localStorage.getItem("ecliniq-theme") as "dark" | "light" | null;
  if (stored === "dark" || stored === "light") {
    return stored;
  }
  
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const initialTheme = getInitialTheme();
document.documentElement.classList.add(initialTheme);
if (initialTheme === "light") {
  document.documentElement.classList.remove("dark");
} else {
  document.documentElement.classList.remove("light");
}

createRoot(document.getElementById("root")!).render(<App />);
