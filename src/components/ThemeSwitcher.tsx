import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * Live retheming control. Every accent in the platform resolves through the
 * CSS custom properties in `src/styles/theme.css`, so switching a theme is a
 * single `data-theme` attribute on <html> — no component changes required.
 */
const THEMES = [
  { id: "champagne", label: "Champagne", swatch: "linear-gradient(135deg,#f8ecd2,#cfa55a)" },
  { id: "ember", label: "Ember", swatch: "linear-gradient(135deg,#ffdcc9,#f4593a)" },
  { id: "iris", label: "Iris", swatch: "linear-gradient(135deg,#e2dcff,#7b65f5)" },
  { id: "karoo", label: "Karoo", swatch: "linear-gradient(135deg,#e6f2dc,#74a856)" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];
const KEY = "opentickets.theme";

export function ThemeSwitcher({ className }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeId>("champagne");

  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as ThemeId | null) ?? "champagne";
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  function apply(next: ThemeId) {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem(KEY, next);
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-mist-500">
        <Palette className="h-3.5 w-3.5" /> Theme
      </span>
      <div className="flex items-center gap-1.5">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => apply(t.id)}
            title={t.label}
            aria-label={`Apply the ${t.label} theme`}
            aria-pressed={theme === t.id}
            className={cn(
              "h-6 w-6 rounded-full border transition-all duration-300 hover:scale-110",
              theme === t.id
                ? "border-mist-100 shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
                : "border-white/15",
            )}
            style={{ background: t.swatch }}
          />
        ))}
      </div>
      <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.16em] text-mist-400 sm:inline">
        {THEMES.find((t) => t.id === theme)?.label}
      </span>
    </div>
  );
}
